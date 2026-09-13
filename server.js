const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        res.json({ reply: 'Request received successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
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

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

        const foundEmails = [...new Set(html.match(emailRegex) || [])];
        const foundPhones = [...new Set(html.match(phoneRegex) || [])];

        res.json({
            url: url,
            loadTimeSeconds: `${loadTimeSeconds} seconds`,
            isSlow: loadTimeSeconds > 3.0,
            emails: foundEmails,
            phones: foundPhones
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scan website' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
