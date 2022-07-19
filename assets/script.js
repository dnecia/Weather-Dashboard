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
//clearing old content so that a new search is successful//
//using moment to set the date//
//adding the weather icons to reflect the current weather conditions
