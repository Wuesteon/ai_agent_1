import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY;

export const openAi = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

const response = await openAi.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "user",
      content:
        "Give me a list of activity ideas based on my current location and weather",
    },
  ],
});

console.log(response.choices[0].message.content);
