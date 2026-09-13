const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد كائن Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.static(path.join(__dirname)));
app.use(express.json());

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
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

        const foundEmails = [...new Set(html.match(emailRegex) || [])];
        const foundPhones = [...new Set(html.match(phoneRegex) || [])];

        let salesPitch = '';
        if (process.env.GEMINI_API_KEY) {
            try {
                const prompt = `أنت وكيل مبيعات خبير. قمنا بفحص موقع: ${url}
العنوان: ${pageTitle}
سرعة التحميل: ${loadTimeSeconds} ثانية
الإيميلات المكتشفة: ${foundEmails.join(', ') || 'لا يوجد'}
اكتب اقتراح مبيعات قصير ومبتكر (Sales Pitch) في 3 أسطر باللغة العربية لنعرض على صاحب هذا الموقع خدماتنا لتطوير أداء موقع زيادة مبيعاته.`;

                const aiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                salesPitch = aiResponse.text;
            } catch (aiErr) {
                console.error(aiErr);
                salesPitch = 'تعذر الاتصال بـ Gemini، التوصية القياسية: يُنصح بالتواصل مع العميل لتحسين الأداء الرقمي.';
            }
        } else {
            salesPitch = loadTimeSeconds > 3.0 
                ? 'الموقع بطيء نسبياً. الفرصة المقترحة: عرض خدمة تحسين السرعة لزيادة نسبة التحويلات.' 
                : 'الموقع أداؤه ممتاز. الفرصة المقترحة: عرض خدمات التسويق الرقمي وإدارة الحملات.';
        }

        res.json({
            url: url,
            title: pageTitle,
            loadTimeSeconds: `${loadTimeSeconds} seconds`,
            isSlow: loadTimeSeconds > 3.0,
            emails: foundEmails,
            phones: foundPhones,
            salesPitch: salesPitch
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to scan website' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
