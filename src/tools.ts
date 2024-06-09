export const getCurrentWeather = (param?: any) => {
  const weather = {
    temperature: "72",
    unit: "F",
    forecast: "sunny",
  };
  return JSON.stringify(weather);
};
export const getLocation = (param?: any) => {
  return "New York City, NY";
};
