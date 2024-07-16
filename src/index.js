import "./style.css";

async function getWeatherData(location) {
  const apiUrl = encodeURI(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next5days?unitGroup=metric&key=YE4KH7CP73XDJX8JRQRWHALSF`,
  );
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
  console.log("Days:");
  for (const day of days) {
    console.log(`  Day: ${day.date}`);
    console.log(`    Weather: ${day.day.condition.text}`);
    console.log(`    Max: ${day.day.maxtemp_c}℃`);
    console.log(`    Min: ${day.day.mintemp_c}℃`);
    console.log(`    Chance of rain: ${day.day.daily_chance_of_rain}%`);
  }
}

const WeatherWindow = (() => {
  function Constructor() {
    this.locationElem = document.querySelector("#location");
    this.dateTimeElem = document.querySelector("#date-time");
    this.weatherIconElem = document.querySelector("#weather-icon");
    this.temperatureElem = document.querySelector("#temperature");
    this.flTemperatureElem = document.querySelector("#fl-temperature");
    this.uvIndexElem = document.querySelector("#uv-index");
    this.hourForecastElem = document.querySelector("#hour-forecast");
    this.dailyForecastElem = document.querySelector("#daily-forecast");
  }
  return new Constructor();
})();

// getWeatherData("New York").then((response) => {
//   console.log(response);
//   printWeatherInfo(response);
// });
