import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.MOONSHOT_API_KEY;
const model = process.env.MOONSHOT_MODEL || "kimi-k2.5";
const baseURL = process.env.MOONSHOT_BASE_URL || "https://api.moonshot.cn/v1";

if (!apiKey) {
  console.error("Missing MOONSHOT_API_KEY in .env");
  process.exit(1);
}

console.log("Testing Kimi / Moonshot...");
console.log("Base URL:", baseURL);
console.log("Model:", model);
console.log("Has API key:", apiKey.startsWith("sk-"));

const client = new OpenAI({
  apiKey,
  baseURL,
});

try {
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: "Reply with exactly this sentence: Kimi connection OK",
      },
    ],
    temperature: 0.6,
    max_tokens: 512,
    thinking: {
      type: "disabled",
    },
  });

  const message = response.choices?.[0]?.message;
  const content = message?.content;

  console.log("Finish reason:", response.choices?.[0]?.finish_reason || "unknown");

  if (content) {
    console.log(content);
  } else {
    console.log("(empty content)");
    console.log("Full response:");
    console.dir(response, { depth: null });
  }
} catch (error) {
  console.error("Kimi test failed:");
  console.error("Status:", error.status || "unknown");
  console.error("Message:", error.message);
  process.exit(1);
}