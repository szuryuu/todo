export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const text = body.text;

  if (!text) {
    throw createError({ statusCode: 400, message: "Text is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createError({ statusCode: 500, message: "API Key not configured" });
  }

  const prompt = `From the following text, extract a list of tasks. Return ONLY a JSON array in the format: [{"title": string, "priority": "low"|"medium"|"high", "dueDate": "YYYY-MM-DD"|null}]. Text: ${text}`;

  const response = await $fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      body: {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" },
      },
    },
  );

  try {
    const raw = (response as any).candidates[0].content.parts[0].text;
    return JSON.parse(raw);
  } catch (e) {
    return [{ title: text, priority: "medium", dueDate: null }];
  }
});
