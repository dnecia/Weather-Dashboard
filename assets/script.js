var cities = [];

var cityFormEl = document.querySelector("#search-city");
var cityInputEl = document.querySelector("#city");
var pastSearchButtonEl = document.querySelector("#previous-search-button");
var forecastTitle = document.querySelector("#forecast");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");

var forecastContainerEl = document.querySelector("#fiveday-container");
//form submission conditions. Entering city name, if no name entered alert to Enter a city//
var submitForm = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getWeather(city);
    get5Day(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Enter a City");
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
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  //fetch the data//
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function (weather, searchCity) {
  //clearing old content so that a new search is successful//
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  //using moment to set the date//

  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInputEl.appendChild(currentDate);
  //adding the weather icons to reflect the current weather conditions
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

  //creating the temp, wind, humidty list to store the data from app//
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temp: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item";

  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  weatherContainerEl.appendChild(temperatureEl);

  weatherContainerEl.appendChild(windSpeedEl);

  weatherContainerEl.appendChild(humidityEl);
  //Add the UV index represented in lat/lon//
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat, lon);
};
//adding the api key here to fetch UV index from open weather app//
var getUvIndex = function (lat, lon) {
  var apiKey = "e37434abc7cdd3f1fcace9a17b2487ef";
  var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUvIndex(data);
    });
  });
};

var displayUvIndex = function (index) {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  uvIndexEl.classList = "list-group-item";

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    uvIndexValue.classList = "favorable";
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "moderate ";
  } else if (index.value > 8) {
    uvIndexValue.classList = "severe";
  }

  uvIndexEl.appendChild(uvIndexValue);

  //append index to current weather
  weatherContainerEl.appendChild(uvIndexEl);
};

var get5Day = function (city) {
  var apiKey = "e37434abc7cdd3f1fcace9a17b2487ef";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-dark text-light m-2";

    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    forecastEl.appendChild(weatherIcon);

    //Temperature span
    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";

    //append to forecast card
    forecastEl.appendChild(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    //append to forecast card
    forecastEl.appendChild(forecastHumEl);

    //append to five day container
    forecastContainerEl.appendChild(forecastEl);
  }
};

var pastSearch = function (pastSearch) {
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};

var pastSearch = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getWeather(city);
    get5Day(city);
  }
};

//adding an event listener for the submit//

cityFormEl.addEventListener("submit", submitForm);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
