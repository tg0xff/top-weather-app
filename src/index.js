import "./style.css";

async function getWeatherData(location) {
  const apiUrl = encodeURI(`https://api.weatherapi.com/v1/forecast.json?key=17e5b927abb948d193754551240907&q=${location}&days=3&lang=en`);
  const response = await fetch(apiUrl, { mode: "cors" });
  return response.json();
}

function printWeatherInfo(response) {
  console.log(
    `Location: ${response.location.name}, ${response.location.country}`,
  );
  console.log(`Weather: ${response.current.condition.text}`);
  console.log(`Temperature: ${response.current.temp_c}℃`);
  console.log(`Feels like: ${response.current.feelslike_c}℃`);
  console.log(`UV index: ${response.current.uv}`);
  const hours = response.forecast.forecastday[0].hour;
  console.log("Hours:");
  for (const hour of hours) {
    console.log(`  Hour: ${hour.time.slice(-5)}`);
    console.log(`    Weather: ${hour.condition.text}`);
    console.log(`    Temperature: ${hour.temp_c}℃`);
  }
  const days = response.forecast.forecastday;
  console.log("Days:")
  for (const day of days) {
    console.log(`  Day: ${day.date}`);
    console.log(`    Weather: ${day.day.condition.text}`);
    console.log(`    Max: ${day.day.maxtemp_c}℃`);
    console.log(`    Min: ${day.day.mintemp_c}℃`);
    console.log(`    Chance of rain: ${day.day.daily_chance_of_rain}%`);
  }
}

getWeatherData("New York").then((response) => {
  console.log(response);
  printWeatherInfo(response);
});
