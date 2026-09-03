const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
برنامج.يحصل("/", (طلب, res) => {
  res.إرسال(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>موقع الوكيل</title>
      <style>body{text-align:center;padding:50px;font-family:Arial;background:#f5f5f5}h1{color:#333}</style>
    </head>
    <body>
      <h1>استكشف الوكيل</h1>
      <br><br>
      <a href="https://wa.me/96179381871?text=مرحبا، اريد الاستفسار عن خدمات Sitelb" target="_blank" 
         style="background-color:#25D366; color:white; padding:15px 25px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:18px;">
         💬 تحدث مع الوكيل على واتساب
      </a>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
