GitHubconst express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// تهيئة عميل جوجل للذكاء الاصطناعي باستخدام مفتاح الـ API من متغيرات البيئة
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// مسار رئيسي للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
    res.send('Opportunity Discovery Agent Server is running successfully!');
});

// مسار Webhook لاستقبال الرسائل والطلبات ومعالجتها عبر نموذج Gemini
app.post('/webhook', async (req, res) => {
    try {
        const userMessage = req.body.message || req.body.Body || "مرحباً";
        
        // توليد الرد الذكي باستخدام نموذج Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `أنت وكيل ذكاء اصطناعي متخصص في تدقيق البصمة الرقمية واكتشاف الفرص التجارية. العميل أرسل الرسالة التالية: "${userMessage}". أجب باحترافية وبشكل مختصر باللغة العربية.`
        });

        const replyText = response.text;

        res.status(200).json({ 
            status: 'success', 
            reply: replyText 
        });
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
