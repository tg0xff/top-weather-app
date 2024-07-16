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
    `Location: ${response.resolvedAddress}`,
  );
  console.log(`Weather: ${response.currentConditions.conditions}`);
  console.log(`Temperature: ${response.currentConditions.temp}℃`);
  console.log(`Feels like: ${response.currentConditions.feelslike}℃`);
  console.log(`UV index: ${response.currentConditions.uvindex}`);
  const hours = response.days[0].hours;
  console.log("Hours:");
  for (const hour of hours) {
    console.log(`  Hour: ${hour.datetime.slice(0, 5)}`);
    console.log(`    Weather: ${hour.conditions}`);
    console.log(`    Temperature: ${hour.temp}℃`);
  }
  const days = response.days;
  console.log("Days:");
  for (const day of days) {
    console.log(`  Day: ${day.datetime}`);
    console.log(`    Weather: ${day.conditions}`);
    console.log(`    Max: ${day.tempmax}℃`);
    console.log(`    Min: ${day.tempmin}℃`);
    console.log(`    Chance of rain: ${day.precipprob}%`);
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

getWeatherData("New York").then((response) => {
  console.log(response);
  printWeatherInfo(response);
});
