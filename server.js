const express = require('express');
const app = express();

// تحديد المنفذ الخاص ببيئة Render أو 3000 محلياً
const PORT = process.env.PORT || 3000;

app.use(express.json());

// الصفحة الرئيسية للموقع
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>وكيل اكتشاف الفرص | الإصدار 1.0</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        nav { display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; font-weight: bold; }
        nav a { color: #3b82f6; text-decoration: none; margin-left: 15px; }
        .hero { text-align: center; margin: 40px 0; }
        .hero h1 { font-size: 2em; color: #0f172a; margin-bottom: 10px; }
        .btn { display: inline-block; background: #2563eb; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px; cursor: pointer; border: none; }
        .btn:hover { background: #1d4ed8; }
        .features { margin-top: 40px; }
        .feature-item { background: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
        .feature-item h3 { margin-top: 0; color: #1e293b; }
        footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <nav>
          <div>الفرص</div>
          <div>
            <a href="#features">الميزات</a> | 
            <a href="#about">عن المنصة</a> | 
            <a href="#contact">اتصل بنا</a>
          </div>
        </nav>

        <div class="hero">
          <small style="color: #2563eb; font-weight: bold;">ذكاء الأعمال المدعوم بالذكاء الاصطناعي</small>
          <h1>اكتشف فرصتك القادمة</h1>
          <p>ابحث عن فرص الأعمال المحلية ذات القيمة العالية، وقم بتحليل الوجود الرقمي، وابتكر استراتيجيات مبيعات أكثر ذكاءً.</p>
          <button class="btn" onclick="alert('سيتم ربط الوكيل بالـ API قريباً!')">تجربة الوكيل</button>
        </div>

        <div id="features" class="features">
          <h2>ما يفعله الوكيل</h2>
          <p>أدوات ذكية مصممة لاكتشاف وتحويل فرص الأعمال.</p>

          <div class="feature-item">
            <h3>اكتشاف الأعمال</h3>
            <p>اكتشف الشركات المحلية الواعدة وحدد أفضل الفرص.</p>
          </div>

          <div class="feature-item">
            <h3>التدقيق الرقمي</h3>
            <p>تحليل المواقع الإلكترونية، والتواجد على الإنترنت، ونقاط تسرب الإيرادات المحتملة.</p>
          </div>

          <div class="feature-item">
            <h3>استراتيجية الذكاء الاصطناعي</h3>
            <p>قم بإنشاء استراتيجيات وعروض تقديمية وحلول موصى بها مصممة خصيصًا.</p>
          </div>
        </div>

        <footer>
          <p>وكيل اكتشاف الفرص — تحويل بيانات الأعمال المحلية إلى فرص مبيعات قابلة للتنفيذ.</p>
          <p><strong>وكيل اكتشاف الفرص الإصدار 1.0</strong></p>
        </footer>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
