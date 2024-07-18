import "./style.css";
import getIcon from "./icons.js";

async function getWeatherData(location) {
  const apiUrl = encodeURI(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next5days?unitGroup=metric&key=YE4KH7CP73XDJX8JRQRWHALSF`,
  );
  const response = await fetch(apiUrl, { mode: "cors" });
  return response.json();
}

function printWeatherInfo(response) {
  console.log(`Location: ${response.resolvedAddress}`);
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
    this.searchBar = document.querySelector("#search");
    this.searchBar.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.displayInfo.call(this);
    });
    this.locationElem = document.querySelector("#location");
    this.dateTimeElem = document.querySelector("#date-time");
    this.weatherIconElem = document.querySelector("#weather-icon");
    this.temperatureElem = document.querySelector("#temperature");
    this.flTemperatureElem = document.querySelector("#fl-temperature");
    this.uvIndexElem = document.querySelector("#uv-index");
    this.hourForecastElem = document.querySelector("#hour-forecast");
    this.dailyForecastElem = document.querySelector("#daily-forecast");
  }
  Constructor.prototype.populateHourForecast = function (response) {
    this.hourForecastElem.replaceChildren();
    const hours = response.days[0].hours.filter(
      (hour) => hour.datetimeEpoch > response.currentConditions.datetimeEpoch,
    );
    for (const hour of hours) {
      const parentDiv = document.createElement("div");
      parentDiv.className = "hour";
      const hourDiv = document.createElement("div");
      hourDiv.className = "hour-display";
      hourDiv.textContent = hour.datetime.slice(0, 5);
      parentDiv.appendChild(hourDiv);
      const weatherIconDiv = document.createElement("div");
      weatherIconDiv.className = "weather-icon";
      const weatherIconSvg = getIcon(hour.icon);
      weatherIconDiv.appendChild(weatherIconSvg);
      const weatherText = document.createElement("div");
      weatherText.textContent = hour.conditions;
      weatherIconDiv.appendChild(weatherText);
      parentDiv.appendChild(weatherIconDiv);
      const temperatureDiv = document.createElement("div");
      temperatureDiv.className = "temperature";
      temperatureDiv.textContent = `${hour.temp}℃`;
      parentDiv.appendChild(temperatureDiv);
      this.hourForecastElem.appendChild(parentDiv);
    }
  };
  Constructor.prototype.populateDailyForecast = function (response) {
    this.dailyForecastElem.replaceChildren();
    const days = response.days;
    for (const day of days) {
      const parentDiv = document.createElement("div");
      parentDiv.className = "day";
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day.datetime.slice(-2);
      dayDiv.className = "date";
      parentDiv.appendChild(dayDiv);
      const weatherIconDiv = document.createElement("div");
      weatherIconDiv.className = "weather-icon";
      const weatherIconSvg = getIcon(day.icon);
      weatherIconDiv.appendChild(weatherIconSvg);
      const weatherText = document.createElement("div");
      weatherText.textContent = day.conditions;
      weatherIconDiv.appendChild(weatherText);
      parentDiv.appendChild(weatherIconDiv);
      const maxTempDiv = document.createElement("div");
      maxTempDiv.className = "max-temp";
      maxTempDiv.textContent = `${day.tempmax}℃`;
      parentDiv.appendChild(maxTempDiv);
      const minTempDiv = document.createElement("div");
      minTempDiv.className = "min-temp";
      minTempDiv.textContent = `${day.tempmin}℃`;
      parentDiv.appendChild(minTempDiv);
      const chanceRainDiv = document.createElement("div");
      chanceRainDiv.className = "rain-chance";
      chanceRainDiv.textContent = `Chance of rain: ${day.precipprob}%`;
      parentDiv.appendChild(chanceRainDiv);
      this.dailyForecastElem.appendChild(parentDiv);
    }
  };
  Constructor.prototype.displayInfo = async function () {
    if (!this.searchBar.value) return;
    const response = await getWeatherData(this.searchBar.value);
    console.log(response);
    printWeatherInfo(response);
    this.locationElem.textContent = response.resolvedAddress;
    this.dateTimeElem.textContent = new Date(
      response.currentConditions.datetimeEpoch * 1000,
    ).toLocaleString();
    this.weatherIconElem.replaceChildren();
    const weatherIcon = getIcon(response.currentConditions.icon);
    this.weatherIconElem.appendChild(weatherIcon);
    const weatherText = document.createElement("div");
    weatherText.textContent = response.currentConditions.conditions;
    this.weatherIconElem.appendChild(weatherText);
    this.temperatureElem.textContent = `${response.currentConditions.temp}℃`;
    this.flTemperatureElem.textContent = `FL: ${response.currentConditions.feelslike}℃`;
    this.uvIndexElem.textContent = `UV Index: ${response.currentConditions.uvindex}`;
    this.populateHourForecast(response);
    this.populateDailyForecast(response);
  };
  return new Constructor();
})();
