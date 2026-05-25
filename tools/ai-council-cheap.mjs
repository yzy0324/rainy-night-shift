import "dotenv/config";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const task = process.argv.slice(2).join(" ").trim();

if (!task) {
  console.error('Usage: node tools/ai-council-cheap.mjs "your task"');
  process.exit(1);
}

const timeoutMs = Number(process.env.COUNCIL_TIMEOUT_MS || 120000);

function withTimeout(promise, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`${name} timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

function buildPrompt(role, taskText, previousAnswers = "") {
  return `
You are acting as: ${role}

Original task:
${taskText}

Other model answers, if any:
${previousAnswers || "(none yet)"}

Important rules:
- Be concrete.
- Do not invent files, functions, APIs, commands, or test results.
- If local project context is missing, say what Claude Code should inspect.
- For coding tasks, focus on implementation risk, changed files, tests, and rollback.
- Keep the answer short but useful.
- If you disagree with another model, explain the exact reason.

Output format:
1. Main judgment
2. Suggested plan
3. Risks
4. Verification / tests
5. Final recommendation
`;
}

async function askOpenAICompatible({
  name,
  apiKey,
  baseURL,
  model,
  role,
  taskText,
  previousAnswers = "",
  temperature = 0.2,
  maxTokens = 1200,
  extraBody = {},
}) {
  if (!apiKey || !model) {
    return {
      name,
      ok: false,
      text: `Skipped: missing API key or model for ${name}.`,
    };
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  try {
    const response = await withTimeout(
      client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: `You are ${name}, a strict software engineering reviewer.`,
          },
          {
            role: "user",
            content: buildPrompt(role, taskText, previousAnswers),
          },
        ],
        temperature,
        max_tokens: maxTokens,
        ...extraBody,
      }),
      name
    );

    const message = response.choices?.[0]?.message;
    const content = message?.content;

    return {
      name,
      ok: true,
      text: content || "(empty response)",
    };
  } catch (error) {
    return {
      name,
      ok: false,
      text: error.message,
    };
  }
}

async function askDeepSeek({
  taskText,
  previousAnswers = "",
  role = "implementation reviewer",
}) {
  return askOpenAICompatible({
    name: "DeepSeek",
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
    role,
    taskText,
    previousAnswers,
    temperature: 0.2,
    maxTokens: 1200,
  });
}

async function askKimi({
  taskText,
  previousAnswers = "",
  role = "long-context code reviewer",
}) {
  return askOpenAICompatible({
    name: "Kimi",
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: process.env.MOONSHOT_BASE_URL || "https://api.moonshot.cn/v1",
    model: process.env.MOONSHOT_MODEL || "kimi-k2.5",
    role,
    taskText,
    previousAnswers,

    // Kimi k2.5 on moonshot.cn requires temperature 0.6.
    temperature: 0.6,

    // Give Kimi enough output space.
    maxTokens: 1600,

    // Disable thinking so it returns normal message.content more reliably.
    extraBody: {
      thinking: {
        type: "disabled",
      },
    },
  });
}

async function askGemini({
  taskText,
  previousAnswers = "",
  role = "cheap second-opinion reviewer",
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

  if (!apiKey || !model) {
    return {
      name: "Gemini",
      ok: false,
      text: "Skipped: missing GEMINI_API_KEY or GEMINI_MODEL.",
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: buildPrompt(role, taskText, previousAnswers),
        config: {
          temperature: 0.2,
          maxOutputTokens: 1200,
        },
      }),
      "Gemini"
    );

    return {
      name: "Gemini",
      ok: true,
      text: response.text || "(empty response)",
    };
  } catch (error) {
    return {
      name: "Gemini",
      ok: false,
      text: error.message,
    };
  }
}

function renderResults(title, results) {
  const output = [`\n# ${title}\n`];

  for (const result of results) {
    output.push(`\n## ${result.name}\n`);

    if (result.ok) {
      output.push(result.text);
    } else {
      output.push(`ERROR / SKIPPED:\n${result.text}`);
    }

    output.push("\n");
  }

  return output.join("\n");
}

async function runSupervisor(supervisorName, originalTask, firstRoundText) {
  const supervisorInput = `
Original task:
${originalTask}

Round 1 model answers:
${firstRoundText}

Now act as the final supervisor.

Your job:
1. Compare the answers.
2. Identify the safest plan.
3. Ignore weak or unsupported suggestions.
4. Produce one final recommendation for Claude Code.
5. Make sure the plan avoids unrelated file edits.
6. Include a simple acceptance checklist.
`;

  if (supervisorName === "kimi") {
    const result = await askKimi({
      taskText: supervisorInput,
      previousAnswers: firstRoundText,
      role: "final supervisor",
    });
    result.name = "Supervisor: Kimi";
    return result;
  }

  if (supervisorName === "gemini") {
    const result = await askGemini({
      taskText: supervisorInput,
      previousAnswers: firstRoundText,
      role: "final supervisor",
    });
    result.name = "Supervisor: Gemini";
    return result;
  }

  const result = await askDeepSeek({
    taskText: supervisorInput,
    previousAnswers: firstRoundText,
    role: "final supervisor",
  });
  result.name = "Supervisor: DeepSeek";
  return result;
}

async function main() {
  console.log("\nCheap AI Council started: DeepSeek + Gemini + Kimi\n");

  const firstRound = await Promise.all([
    askDeepSeek({
      taskText: task,
      role: "main implementation reviewer",
    }),

    askGemini({
      taskText: task,
      role: "cheap second-opinion reviewer",
    }),

    askKimi({
      taskText: task,
      role: "long-context and architecture reviewer",
    }),
  ]);

  const firstRoundText = renderResults(
    "ROUND 1: Independent answers from cheap AI council",
    firstRound
  );

  const supervisorName = (
    process.env.COUNCIL_SUPERVISOR || "deepseek"
  ).toLowerCase();

  const supervisorResult = await runSupervisor(
    supervisorName,
    task,
    firstRoundText
  );

  const finalOutput = [
    firstRoundText,
    renderResults("ROUND 2: Supervisor final decision", [supervisorResult]),
  ].join("\n\n");

  console.log(finalOutput);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});