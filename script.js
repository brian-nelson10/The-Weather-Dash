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
var enterCityVal = document.querySelector("#enterCity");
var citySearchBtn = document.querySelector("#citySearchBtn");
var searchedCitiesEl = document.querySelector(".listYourCities")
//open weather api

var apiKey = "0f03dfce7a166afdf62967ae1a00af7e";

function handleSearch(event) {
    event.preventDefault();
  
    var enterCity = enterCityVal.value.trim();
  
    if (!enterCity) {
      // alert empty input error to user
      errorMessage("You must enter a valid city name", citySearchEl, 5000);
      return;
    } else {
      getCurrentWeather(enterCity, apiKey);
      getForecast(enterCity, apiKey);
      enterCityVal.value = "";
      weatherContentDiv.classList.add("hide");
    }
  }


// Add eventListener to search button
citySearchBtn.addEventListener("click", handleSearch);


// function to create new list item in the sidebar with the city's name
function createNewCityButton(cityName, location) {
    var cityBtnEl = document.createElement("button");
    cityBtnEl.setAttribute("type", "button");
    cityBtnEl.classList.add("listYourCities-item", "listYourCities-item-action");
    cityBtnEl.textContent = cityName;
    cityBtnEl.setAttribute("value", cityName);
    location.prepend(cityBtnEl);
    cityBtnEl.addEventListener("click", function () {
      // remove active class from other buttons
      var allCityBtns = document.querySelectorAll(".listYourCities-item");
      for (var i = 0; i < allCityBtns.length; i++) {
        allCityBtns[i].classList.remove("active");
      }
      getCurrentWeather(cityBtnEl.value, apiKey);
      getForecast(cityBtnEl.value, apiKey);
      cityBtnEl.classList.add("active");
    });
  }







