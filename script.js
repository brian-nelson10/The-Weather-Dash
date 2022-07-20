// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

//search box elements
var citySearchEl = document.querySelector("#citySearch");
var enterCityVal = document.querySelector(".form-control");
var citySearchBtn = document.querySelector("#citySearchBtn");
var searchedCitiesEl = document.querySelector(".list-group")
var existingEntries = JSON.parse(localStorage.getItem("cities"));
var weatherContentDiv = document.querySelector("#weatherContent");

//open weather api

var apiKey = "0f03dfce7a166afdf62967ae1a00af7e";
var openWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/";
var cardTitleEl = document.querySelector(".card-title");
var uvIndexEl = document.querySelector("#uv");
var openWeatherIconEl = document.querySelector("#icon");


// The load event is fired when the window has loaded
window.onload = function initializeDashboard() {
    // retrieving our data from local storage and converting it back into an array
    if (localStorage.getItem("cities") !== null) {
      for (var i = 0; i < existingEntries.length; i++) {
// create a button element with city name
createNewCityButton(existingEntries[i], searchedCitiesEl);
      }
    }
};

// function to create new list item in the sidebar with the city's name
function createNewCityButton(cityName, location) {
    var cityBtnEl = document.createElement("button");
    cityBtnEl.setAttribute("type", "button");
    cityBtnEl.classList.add("list-group-item", "list-group-item-action");
    cityBtnEl.textContent = cityName;
    cityBtnEl.setAttribute("value", cityName);
    location.prepend(cityBtnEl);
    cityBtnEl.addEventListener("click", function () {
      // remove active class from other buttons
      var allCityBtns = document.querySelectorAll(".list-group-item");
      for (var i = 0; i < allCityBtns.length; i++) {
        allCityBtns[i].classList.remove("active");
      }
      getCurrentWeather(cityBtnEl.value, apiKey);
     // getForecast(cityBtnEl.value, apiKey);
      cityBtnEl.classList.add("active");
    });
  }

// Add eventListener to search button
citySearchBtn.addEventListener("click", handleSearch);


function handleSearch(event) {
    event.preventDefault();
  
    var enterCities = enterCityVal.value.trim();
  
    if (!enterCities) {
      // alert empty input error to user
      //errorMessage("You must enter a valid city name", citySearchEl, 5000);
      //return;
    } else {
      getCurrentWeather(enterCities, apiKey);
      //getForecast(enterCities, apiKey);
      enterCityVal.value = "";
      //weatherContentDiv.classList.add("hide");
      //createNewCityButton();
    };
  }

  function getCurrentWeather(cityName, apiKey) {
    // For temperature in Fahrenheit and wind speed in miles/hour use units=imperial
    var url =
      openWeatherQueryUrl +
      "weather?q=" +
      cityName +
      "&appid=" +
      apiKey;
      "&units=imperial";
  
    fetch(url)
      // check for 200 response if not send error message
      .then(function (response) {
        if (!response.ok) {
          console.log("There is an Error. Status Code: " + response.status);
         
          window.alert(cityName + " DOES NOT EXIST!");

          return;

        } else {
          return response.json(); // no error
        }
      })
      .then(function (weatherData) {
        console.log(weatherData);
        // show the weather data 
        weatherContentDiv.classList.remove("visually-hidden");
        showWeatherData(weatherData);
      });  

var currentDate = moment().format("dddd, MMMM Do YYYY");

      function showWeatherData(resultObj) {
        // show city and date
        cardTitleEl.textContent =
        resultObj.name + " (" + currentDate + ") ";

        // setting src and alt attribute of image
        openWeatherIconEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + resultObj.weather[0].icon + "@2x.png"
        );
        cardTitleEl.append(openWeatherIconEl);
      
        var tempEl = document.querySelector("#temp");
        var humidityEl = document.querySelector("#humidity");
        var windSpeedEl = document.querySelector("#windSpeed");
        var uvIndexEl = document.querySelector("#uvIndex");
      
        // Adding temperature information if temperature data exists
        if (resultObj.main.temp) {
          tempEl.textContent = resultObj.main.temp + " °F";
        } else {
          tempEl.textContent = "No temperature for this city.";
        }
      
        // Adding humidity information if humidity data exists
        if (resultObj.main.humidity) {
          humidityEl.textContent = resultObj.main.humidity + "%";
        } else {
          humidityEl.textContent = "No humidity for this city.";
        }
      
        // Adding wind speed information if wind speed data exists
        if (resultObj.wind.speed) {
          windSpeedEl.textContent = resultObj.wind.speed + " MPH";
        } else {
          windSpeedEl.textContent = "No wind speed for this city.";
        }
      
        // Adding uv index data if exists
        if (resultObj.coord.lat && resultObj.coord.lon) {
          var lat = resultObj.coord.lat;
          var lon = resultObj.coord.lon;
          getUVIndex(lat, lon, apiKey);
        } else {
          uvIndexEl.textContent = "No UV index for this city.";
        }
      }
    }

    // This function uses the API to grab the current UV index of the input city
function getUVIndex(lat, lon, apiKey) {
    uvIndexQueryUrl =
      openWeatherQueryUrl + "uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(uvIndexQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (uvData) {
        console.log("Here is the object containing the current UV Index");
        console.log(uvData);
        var uvIndex = uvData.value;
  
        // change color to indicate whether the uv conditions are favorable, moderate, or severe
        if (uvIndex <= 2) {
          colorClass = "go";
        } else if (uvIndex <= 5) {
          colorClass = "caution";
        } else if (uvIndex <= 7) {
          colorClass = "warn";
        } else if (uvIndex <= 10) {
          colorClass = "warning"
        } else if (uvIndex > 10) {
          colorClass = "danger";
        }
        document.querySelector("#uv").setAttribute("class", colorClass);
        uvIndexEl.textContent = uvIndex;
      })
      .catch(function (error) {
        console.log("There is a error: " + error);
      });
  }




  