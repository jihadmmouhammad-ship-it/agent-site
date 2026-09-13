const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// مسار الفحص البسيط
app.get('/api/scan', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Please provide a url parameter' });
    }

    res.json({
        url: targetUrl,
        pageTitle: 'فحص موقع العميل',
        loadTimeSeconds: '1.2',
        salesPitch: 'فرصة مقترحة: تطوير البصمة الرقمية وزيادة المبيعات.'
    });
});

// --- مسارات إدارة الطلبات والوكيل ---
let ordersDatabase = [];

// 1. مسار استقبال اختيار الباقة وبيانات الدفع من العميل
app.post('/api/create-order', (req, res) => {
    const { customerName, customerEmail, planName, paymentReceiptRef } = req.body;

    const newOrder = {
        orderId: 'ORD-' + Date.now(),
        customerName,
        customerEmail,
        planName,
        paymentReceiptRef,
        status: 'pending_agent_approval',
        createdAt: new Date()
    };

    ordersDatabase.push(newOrder);

    console.log(`[طلب جديد] تم استلام طلب من العميل: ${customerName} للباقة: ${planName}، بانتظار تأكيد الوكيل.`);

    res.status(200).json({
        success: true,
        message: 'تم إرسال طلبك بنجاح! جاري مراجعة الدفع وتأكيد البيانات من قِبل الوكيل.',
        orderId: newOrder.orderId
    });
});

// 2. مسار خاص بالوكيل لمراجعة واعتماد الدفع وبدء العمل فوراً
app.post('/api/agent/approve-order', (req, res) => {
    const { orderId } = req.body;

    const order = ordersDatabase.find(o => o.orderId === orderId);
    if (!order) {
        return res.status(404).json({ success: false, message: 'الطلب غير موجود.' });
    }

    order.status = 'approved_and_running';

    console.log(`[اعتماد الوكيل] تم تأكيد الدفع للطلب ${orderId}. بدأ وكيل الفرص العمل فوراً للعميل: ${order.customerName}`);

    res.status(200).json({
        success: true,
        message: `تم اعتماد الطلب ${orderId} بنجاح، وبدأ الوكيل في تنفيذ مهام التدقيق للعميل.`
    });
});

// 3. مسار لعرض الطلبات المعلقة للوكيل
app.get('/api/agent/pending-orders', (req, res) => {
    const pendingOrders = ordersDatabase.filter(o => o.status === 'pending_agent_approval');
    res.status(200).json({
        success: true,
        count: pendingOrders.length,
        orders: pendingOrders
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
