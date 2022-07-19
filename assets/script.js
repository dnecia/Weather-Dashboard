//variables to be used throughout script file//
var cities = [];
var cityFormEl = document.querySelector("#search-city");
var cityInputEl = document.querySelector("#city");
var pastSearchButtonEl = document.querySelector("#previous-search-button");
var forecastTitle = document.querySelector("#forecast");
var weatherContainerEl = document.querySelector("#current-weather-contianer");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastContainerEl = document.querySelector("#fiveday-contianer");

//form submission conditions. Entering city name, if no name entered alert to Enter a city//
var submitForm = function (event) {
  event.preventDefault();
  var city = cityInputEl.ariaValueMax.trim();
  if (city) {
    getWeather(city);
    get5Day(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  saveSearch();
  pastSearch(city);
};
//storing searched cities//
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};
//utiizing api key and openweather site to fetch the weather//
var getWeather = function (city) {
  var apiKey = "e37434abc7cdd3f1fcace9a17b2487ef";
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  //fetch the data//
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};
//clearing old content so that a new search is successful//
var displayWeather = function (weather, searchCity) {
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;
};
//using moment to set the date//
var currentDate = document.createElement("span");
currentDate.textContent =
  " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
citySearchInputEl.appendChild(currentDate);

//adding the weather icons to reflect the current weather conditions
