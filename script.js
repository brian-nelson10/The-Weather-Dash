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
var weatherContentDiv = document.querySelector("#weatherContent");

//weather elements

var apiKey = "0f03dfce7a166afdf62967ae1a00af7e";
var openWeatherQueryUrl = "https://api.openweathermap.org/data/2.5/";
var cardTitleEl = document.querySelector(".card-title");
var uvIndexEl = document.querySelector("#uv");
var openWeatherIconEl = document.querySelector("#icon");
var itemsArray = localStorage.getItem("cities")?JSON.parse(localStorage.getItem("cities")):[];

window.onload = function initializeDashboard() {
  if (localStorage.getItem("cities") !== null) {
    for (var i = 0; i < itemsArray.length; i++) {
    }
  }
};

//eventListener for search button
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
      getForecast(enterCities, apiKey);
      enterCityVal.value = "";
      localStorage.setItem("cities", JSON.stringify(enterCities));
    };
  }

  document.getElementById("myUL").innerHTML = JSON.parse(localStorage.getItem("cities"));

  function getCurrentWeather(cityName, apiKey) {
    
    var url =
      openWeatherQueryUrl + "weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
  
    fetch(url)
      // check for 200 response
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

        // src for icon
        openWeatherIconEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + resultObj.weather[0].icon + "@2x.png"
        );
        cardTitleEl.append(openWeatherIconEl);
      
        var tempEl = document.querySelector("#temp");
        var humidityEl = document.querySelector("#humidity");
        var windSpeedEl = document.querySelector("#windSpeed");
        var uvIndexEl = document.querySelector("#uvIndex");
      
        // Temp
        if (resultObj.main.temp) {
          tempEl.textContent = resultObj.main.temp + " °F";
        } else {
          tempEl.textContent = "No temperature for this city!!";
        }
      
        // Humidity
        if (resultObj.main.humidity) {
          humidityEl.textContent = resultObj.main.humidity + "%";
        } else {
          humidityEl.textContent = "No humidity for this city!!";
        }
      
        // Wind
        if (resultObj.wind.speed) {
          windSpeedEl.textContent = resultObj.wind.speed + " MPH";
        } else {
          windSpeedEl.textContent = "No wind speed for this city!!";
        }
      
        // UV Index
        if (resultObj.coord.lat && resultObj.coord.lon) {
          var lat = resultObj.coord.lat;
          var lon = resultObj.coord.lon;
          getUVIndex(lat, lon, apiKey);
        } else {
          uvIndexEl.textContent = "No UV index for this city!!";
        }
      }
    }

    // Use api to get uv index based on lat & lon
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
          console.log("UV Index");
          console.log(uvData);
        var uvIndex = uvData.value;
  
        // change color box 
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
        console.log("There is an error: " + error);
      });       
  }
  // Forecast function
  function getForecast(enterCities, apiKey) {
    var url = openWeatherQueryUrl + "forecast?q=" + enterCities + "&appid=" + apiKey;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                console.log("There is an error. Status Code: " + response.status);
                return;
            } else {
                return response.json();
            }
            })
        .then(function (forecastData){
            console.log("Forecast");
            console.log(forecastData);
        var foreCastObject = [];
        for (var i = 0; i < forecastData.list.length; i++) {
            if (i % 8 === 0) {
            foreCastObject.push({
                date: forecastData.list[i].dt_text,
                icon: forecastData.list[i].weather[0].icon,
                des: forecastData.list[i].weather[0].description,
                temp: forecastData.list[i].main.temp,
                humidity: forecastData.list[i].main.humidity,
            });
        }
    }

  for (var i = 0; i < foreCastObject.length; i++) {
    var dateForeCast = document.querySelectorAll("#date-forecast");
    var iconEl = document.querySelectorAll("#forecastIcon");
    var tempSpan = document.querySelectorAll("#tempSpan");
    var humiditySpan = document.querySelectorAll("#humidityForecast");
    var descriptionSpan = document.querySelectorAll("#descriptionSpan");

    
    iconEl[i].setAttribute(
        "src", "https://openweathermap.org/img/wn/" + foreCastObject[i].icon + "@2x.png");

    dateForeCast[i].textContent = foreCastObject[i].date;   
    descriptionSpan[i].textContent = foreCastObject[i].des;
    tempSpan[i].textContent = foreCastObject[i].temp + " °F";
    humiditySpan[i].textContent = foreCastObject[i].humidity + "%";

  }
  console.log(foreCastObject);
})
  }

