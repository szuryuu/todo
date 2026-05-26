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

  const prompt = `You are a productivity assistant.
From the following text, extract a list of tasks.
Return ONLY a JSON array in the format:
[{ "title": string, "priority": "low"|"medium"|"high", "energy": "light"|"heavy", "dueDate": "YYYY-MM-DD"|null }]
- priority: explicit deadline = high, "tomorrow/soon" = medium, rest = low
- energy: needs deep focus = heavy, can be done while relaxed = light
- dueDate: fill if specific time is mentioned, null if none
Text: ${text}`;

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
    return [
      { title: text, priority: "medium", energy: "light", dueDate: null },
    ];
  }
});
