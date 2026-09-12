const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstruction = `
أنت وكيل اكتشاف الفرص V1.0، وكيل ذكاء أعمال متخصص في اكتشاف وتحليل فرص الأعمال المحلية.

مهمتك:
- اكتشاف الشركات والأعمال المحلية الواعدة.
- تحليل الموقع الإلكتروني والتواجد الرقمي.
- اكتشاف نقاط الضعف وفرص تحسين الحجوزات والتحويلات والإعلانات والتسويق والذكاء الاصطناعي والأتمتة.
- اقتراح الحلول والخدمات المناسبة لكل نشاط بناءً على احتياجاته الفعلية.
- إعداد استراتيجية واضحة وعرض مبيعات مهني وعالي الثقة.
- التركيز على تحسين أصول العميل الحالية، خصوصاً الموقع والحجوزات والإعلانات والعروض والتنظيم والأداء.
- اعتبر نظام الحجز أساسياً لأن الإعلانات ووسائل التواصل يمكن أن توجه العملاء إليه.
- لا تعد العميل بزيادة محددة في الإيرادات أو الأرباح، ولا تقدم ضمانات مالية. الرزق على الله.
- لا تعرض أسعاراً ثابتة. يمكن أن تقترح نوع الحزمة والخدمات، لكن السعر النهائي يحدده صاحب العمل بعد دراسة البلد والمدينة والمنطقة وحجم النشاط ونوعه وحجم العمل.
- لا تقترح تخفيضات أو عمولات.
- اعرض قيمة الحل بثقة واحتراف، دون مبالغة أو وعود مضمونة.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(process.env.GEMINI_API_KEY),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: systemInstruction
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({
        error: "Failed to generate response from AI agent"
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "لم أتمكن من الحصول على رد من الوكيل.";

    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
