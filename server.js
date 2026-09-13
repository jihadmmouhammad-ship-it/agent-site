const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد عميل Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/scan', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Please provide a url parameter' });
    }

    try {
        let url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        const startTime = Date.now();

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 10000
        });

        const loadTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        const html = response.data;
        const $ = cheerio.load(html);
        const pageTitle = $('title').text().trim() || 'بدون عنوان';

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?[0-9]{1,3}[- ]?)?\(?[0-9]{2,4}\)?[- ]?[0-9]{3,4}[- ]?[0-9]{3,4}/g;

        const foundEmails = [...new Set(html.match(emailRegex) || [])];
        const foundPhones = [...new Set(html.match(phoneRegex) || [])];

        let salesPitch = '';
        if (process.env.GEMINI_API_KEY) {
            try {
                const prompt = `أنت وكيل مبيعات محترف. تحليل الموقع: ${url}
العنوان: ${pageTitle}
سرعة التحميل: ${loadTimeSeconds} ثانية
الإيميلات المكتشفة: ${foundEmails.join(', ') || 'لا يوجد'}
الهواتف المكتشفة: ${foundPhones.join(', ') || 'لا يوجد'}
اكتب في 3 أسطر باللغة العربية لعرض على صاحب هذا الموقع خدماتنا لتطوير أداء موقع زيادة مبيعات المتجر وسد ثغرات المنافسين.`;

                const aiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                salesPitch = aiResponse.text;
            } catch (aiErr) {
                console.error(aiErr);
                salesPitch = 'المؤسسة مناسبة، ينصح بالتواصل مع العميل لتحسين الأداء الرقمي وعرض الاتصال.';
            }
        } else {
            salesPitch = 'الموقع بطيء نسبياً. الفرصة المقترحة: عرض خدمة تخصيص السرعة لزيادة نسبة المبيعات.\n الموقع آماك سمار. الفرصة المقترحة: عرض خدمات التسويق الرقمي وإدارة الخدمات.';
        }

        res.json({
            url,
            pageTitle,
            loadTimeSeconds,
            foundEmails,
            foundPhones,
            salesPitch
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to scan the website', details: error.message });
    }
});

// --- مسارات إدارة الطلبات والوكيل (حسب الاتفاق) ---
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
