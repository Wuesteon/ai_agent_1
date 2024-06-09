import OpenAI from "openai";
import * as dotenv from "dotenv";
import { getCurrentWeather, getLocation, toolsV2 } from "./tools.js";

dotenv.config();

const apiKey = process.env.API_KEY;
const MAX_ITERATIONS = 5;
export const openAi = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

const availableFunctions = {
  getCurrentWeather,
  getLocation,
};
type AvailableFunctions = typeof availableFunctions;
type AvailableFunctionNames = keyof AvailableFunctions;

async function agent(query: string) {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers.",
    },
    { role: "user", content: query },
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(`Iteration #${i + 1}`);
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      tools: toolsV2,
    });

    const { finish_reason: finishReason, message } = response.choices[0];
    const { tool_calls: toolCalls } = message;

    messages.push(message);

    console.log(message);
    console.log("finishReason", finishReason);
    if (finishReason === "stop") {
      console.log("Agent finished with task");
      console.log(messages);
      return message;
    } else if (finishReason === "tool_calls") {
      if (!toolCalls) throw new Error("No tool calls found");
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall =
          availableFunctions[functionName as AvailableFunctionNames];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        const functionResponse = await functionToCall(functionArgs);
        console.log(functionResponse);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          content: functionResponse ?? "",
        });
      }
    }
  }
}

await agent("What's the current weather in my location?");
