import OpenAI from "openai";
import {
  RunnableToolFunctionWithParse,
  RunnableToolFunctionWithoutParse,
} from "openai/lib/RunnableFunction";
interface WeatherParams {
  location: string;
  unit?: "Celsius" | "Fahrenheit";
}

export const getCurrentWeather = (location: string) => {
  const weather = {
    location,
    temperature: "75",
    unit: "F",
    forecast: "sunny",
  };
  return JSON.stringify(weather);
};

export async function getLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const text = await response.json();

    return JSON.stringify(text);
  } catch (err) {
    console.log(err);
  }
}
export const functions: readonly (
  | RunnableToolFunctionWithoutParse
  | RunnableToolFunctionWithParse<any>
)[] = [
  {
    type: "function",
    function: {
      description: "Get the current weather",
      function: getLocation,
      parse: JSON.parse,
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      function: getCurrentWeather,
      description: "Get the current weather",
      parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" },
        },
      },
    },
  },
];

export const toolsV2: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The location from where to get the weather",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get the user's current location",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];
