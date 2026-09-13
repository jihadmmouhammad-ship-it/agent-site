const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// قاعدة بيانات مؤقتة لتخزين الطلبات في الذاكرة
let orders = [];

// مسار استقبال الطلبات من العميل
app.post('/api/create-order', (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, financialCompany, planName, paymentReceiptRef } = req.body;

        if (!customerName || !customerEmail || !customerPhone || !financialCompany || !planName || !paymentReceiptRef) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة، يرجى ملء كافة التفاصيل.' });
        }

        const newOrder = {
            orderId: 'ORD-' + Date.now(),
            customerName,
            customerEmail,
            customerPhone,
            financialCompany,
            planName,
            paymentReceiptRef,
            status: 'Pending',
            createdAt: new Date()
        };

        orders.push(newOrder);

        res.json({
            success: true,
            message: 'تم استلام طلبك بنجاح وجاري مراجعته من قبل الوكيل.',
            orderId: newOrder.orderId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'حدث خطأ في الخادم الداخلي.' });
    }
});

// مسار جلب الطلبات المعلقة للوكيل (لوحة التحكم)
app.get('/api/agent/pending-orders', (req, res) => {
    res.json({
        success: true,
        orders: orders.filter(o => o.status === 'Pending')
    });
});

// مسار اعتماد الطلب من قبل الوكيل
app.post('/api/agent/approve-order', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        order.status = 'Approved';
        res.json({ success: true, message: `تم اعتماد الطلب ${orderId} بنجاح!` });
    } else {
        res.status(404).json({ success: false, message: 'الطلب غير موجود.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
