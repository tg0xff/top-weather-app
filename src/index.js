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
    const response = await fetch(apiUrl, { mode: "cors" });
    return response.json();
  };
  Constructor.prototype.search = async function (e) {
    if (this.searchBar.value && e.key === "Enter") {
      const response = await this.getWeatherData();
      console.log(response);
      WeatherWindow.displayInfo(response);
    }
  };
  return new Constructor();
})();
