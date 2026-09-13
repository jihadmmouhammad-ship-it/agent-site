# 🤖 Opportunity Discovery Agent v1.0
> وكيل ذكي لاكتشاف فرص المبيعات وتحليل الأداء الرقمي للمواقع والمتاجر الإلكترونية.

---

## 📌 نبذة عن المشروع
مشروع ويب متكامل يعتمد على خادم Node.js وواجهة تفاعلية خفيفة، يهدف إلى مسح المواقع الإلكترونية للعملاء المحتملين، واستخراج بيانات التواصل (البريد الإلكتروني والأرقام)، وتقييم سرعة تحميل الموقع، ثم توليد توصيات مبيعات مخصصة لخدمات التسويق وتحسين الأداء.

---

## 🚀 الرابط المباشر للمشروع (Live Demo)
يمكن تجربة الخدمة مباشرة عبر الرابط التالي:
👉 [https://agent-sitelb.onrender.com/](https://agent-sitelb.onrender.com/)

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend**: HTML5, CSS3, Modern JavaScript (Fetch API).
- **Backend**: Node.js, Express.js.
- **Web Scraping**: Axios, Cheerio, Regular Expressions (Regex).
- **Hosting & Deployment**: Render (Connected via GitHub CI/CD).

---

## 🔌 نقاط النهاية للمحرك (API Endpoints)

### 1. فحص صحة الخادم
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "ok"
}
