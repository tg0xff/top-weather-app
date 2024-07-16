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
    const hours = response.days[0].hours.filter((hour) => hour.datetimeEpoch > response.currentConditions.datetimeEpoch);
    for (const hour of hours) {
      const parentDiv = document.createElement("div");
      const hourDiv = document.createElement("div");
      hourDiv.textContent = hour.datetime.slice(0, 5);
      parentDiv.appendChild(hourDiv);
      const weatherIconDiv = document.createElement("div");
      weatherIconDiv.textContent = hour.conditions;
      parentDiv.appendChild(weatherIconDiv);
      const temperatureDiv = document.createElement("div");
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
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day.datetime;
      parentDiv.appendChild(dayDiv);
      const weatherIconDiv = document.createElement("div");
      weatherIconDiv.textContent = day.conditions;
      parentDiv.appendChild(weatherIconDiv);
      const maxTempDiv = document.createElement("div");
      maxTempDiv.textContent = `${day.tempmax}℃`;
      parentDiv.appendChild(maxTempDiv);
      const minTempDiv = document.createElement("div");
      minTempDiv.textContent = `${day.tempmin}℃`;
      parentDiv.appendChild(minTempDiv);
      const chanceRainDiv = document.createElement("div");
      chanceRainDiv.textContent = `${day.precipprob}%`;
      parentDiv.appendChild(chanceRainDiv);
      this.dailyForecastElem.appendChild(parentDiv);
    }
  };
  Constructor.prototype.displayInfo = async function () {
    if (!this.searchBar.value) return;
    const response = await getWeatherData(this.searchBar.value);
    this.locationElem.textContent = response.resolvedAddress;
    this.dateTimeElem.textContent = new Date(response.currentConditions.datetimeEpoch * 1000).toLocaleString();
    this.weatherIconElem.textContent = response.currentConditions.conditions;
    this.temperatureElem.textContent = response.currentConditions.temp;
    this.flTemperatureElem.textContent = response.currentConditions.feelslike;
    this.uvIndexElem.textContent = response.currentConditions.uvindex;
    this.populateHourForecast(response);
    this.populateDailyForecast(response);
  };
  return new Constructor();
})();

getWeatherData("New York").then((response) => {
  console.log(response);
  printWeatherInfo(response);
});
