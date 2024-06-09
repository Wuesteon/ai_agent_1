import OpenAI from "openai";
import * as dotenv from "dotenv";
import { functions, getCurrentWeather, getLocation, toolsV2 } from "./tools.js";

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
  const runner = openAi.beta.chat.completions
    .runTools({
      model: "gpt-3.5-turbo",
      messages,
      tools: functions,
    })
    .on("message", (message) => console.log(message));
  const response = await runner;
}

await agent("What's the current weather in my current location?");
