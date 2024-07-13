async function getWeatherData(location) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=17e5b927abb948d193754551240907&q=${location}&days=3`;
  const response = await fetch(apiUrl, { mode: "cors" });
  return response.json();
}

function printWeatherInfo(response) {
  console.log(
    `Location: ${response.location.name}, ${response.location.country}`,
  );
  console.log(response.current.condition.text);
  console.log(`Temperature: ${response.current.temp_c}℃`);
  console.log(`Feels like: ${response.current.feelslike_c}℃`);
  console.log(`UV index: ${response.current.uv}`);
}

getWeatherData("London").then((response) => {
  console.log(response);
  printWeatherInfo(response);
});
