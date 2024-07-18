import "./style.css";
import WeatherWindow from "./weather-window.js";

const SearchBar = (() => {
  function Constructor() {
    this.searchBar = document.querySelector("#search");
    this.searchBar.addEventListener("keydown", this.search.bind(this));
  }
  Constructor.prototype.getWeatherData = async function () {
    const apiUrl = encodeURI(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.searchBar.value}/next5days?unitGroup=metric&key=YE4KH7CP73XDJX8JRQRWHALSF`,
    );
    let response;
    try {
      response = await fetch(apiUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error(error.message);
      WeatherWindow.displayWindow(false);
    }
    return response.json();
  };
  Constructor.prototype.search = async function (e) {
    if (e.key === "Enter" && this.searchBar.value) {
      const response = await this.getWeatherData();
      console.log(response);
      WeatherWindow.displayWindow(true);
      WeatherWindow.displayInfo(response);
    }
  };
  return new Constructor();
})();
