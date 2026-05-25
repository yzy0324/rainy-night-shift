\---

description: Ask the cheap external AI council: DeepSeek + Gemini + Kimi

allowed-tools: Bash

\---



Run the cheap external multi-AI council with the user's request.



Command to run:



```bash

node tools/ai-council-cheap.mjs "$ARGUMENTS"

```



After it finishes:



Summarize the agreement between DeepSeek, Gemini, and Kimi.

Summarize disagreements.

Identify the safest plan.

Tell the user which files are likely to change.

Do not edit files unless the user explicitly approves.



Usage example:



```text

/council I want to add Level 4. Only modify LEVELS data in game.js. Do not modify physics, collision, input, camera, or item system logic.

```

