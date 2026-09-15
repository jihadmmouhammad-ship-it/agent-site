const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// تهيئة مفتاح Gemini API باستخدام متغيرات البيئة بأمان
// تأكد من وضع GEMINI_API_KEY في إعدادات Render
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// مسار فحص صحة الخادم
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 1. مسار التحقق من Webhook الخاص بـ WhatsApp (GET)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_secure_verify_token';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// 2. مسار استقبال رسائل WhatsApp وتوليد رد من Gemini (POST)
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages && change.value.messages[0]) {
            const message = change.value.messages[0];
            const senderID = message.from; // رقم هاتف المرسل
            const userText = message.text ? message.text.body : ''; // نص الرسالة

            if (userText) {
              // توليد الرد باستخدام نموذج Gemini
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userText,
                config: {
                  systemInstruction: "أنت وكيل ذكي ومساعد تجاري، أجب باحترافية واختصار على رسائل العملاء."
                }
              });

              const replyText = response.text;
              console.log(`رد الوكيل على الرقم ${senderID}: ${replyText}`);

              // ملاحظة: لإرسال الرد فعلياً إلى واتساب، ستحتاج لاستخدام WhatsApp Cloud API 
              // (عن طريق fetch إلى Graph API الخاص بـ Meta باستخدام WHATSAPP_TOKEN)
            }
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
