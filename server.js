const express = require('express');
const path = require('path');
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
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    const systemInstruction = `أنت وكيل اكتشاف الفرص V1.0، وكيل ذكاء أعمال متخصص في اكتشاف فرص العمل لزيادة المبيعات للمتاجر والشركات المحلية.`;

    res.json({ reply: 'تم استقبال طلبك بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
