const express = require('express');
const path = require('path');
const app = express();

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Payment successful for session ID:', session.id);
    }

    res.json({ received: true });
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let orders = [];

app.post('/api/create-order', (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, financialcompany, planName, paymentReceiptRef } = req.body;

        if (!customerName || !customerEmail || !customerPhone || !financialcompany || !planName) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة، يرجى ملء كافة التفاصيل.' });
        }

        const newOrder = {
            orderId: 'ORD-' + Date.now(),
            customerName,
            customerEmail,
            customerPhone,
            financialcompany,
            planName,
            paymentReceiptRef: paymentReceiptRef || 'Stripe Payment',
            status: 'Pending',
            createdAt: new Date()
        };

        orders.push(newOrder);

        res.json({
            success: true,
            message: 'تم استلام طلبك بنجاح وجاري مراجعته من قبل الإدارة.',
            orderId: newOrder.orderId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'حدث خطا في الخادم الداخلي.' });
    }
});

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { planName } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: planName || 'AI Platform Subscription',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `https://agent-sitelb.onrender.com/success.html`,
            cancel_url: `https://agent-sitelb.onrender.com/cancel.html`,
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/agent/pending-orders', (req, res) => {
    res.json({
        success: true,
        orders: orders.filter(o => o.status === 'Pending')
    });
});

app.post('/api/agent/approve-order', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        order.status = 'Approved';
        res.json({ success: true, message: `تم اعتماد الطلب ${orderId} بنجاح` });
    } else {
        res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
