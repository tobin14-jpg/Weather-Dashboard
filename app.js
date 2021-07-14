var city = "";
var searchCity = $("#search-city");
var searchBtn = $('#search-btn');
var clearBtn = $('#clear-btn');
var currentCity = $('#current-city');
var currentTemp = $('#temp');
var currentWind = $('#wind');
var currentHumidity = $('#humidity');
var currentUV = $('#uv-index');
var savedCities = [];

var APIKey = "ca294605ecdcaa34238174a14c505599";

// Grab the city from the input seach bar
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim()!=="") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}

// Fetches and displays the current weather
function currentWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    fetch(queryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (response) {
            console.log(response);

            var weatherIcon = response.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            var date = new Date(response.dt*1000).toLocaleDateString();

            currentCity.html(response.name + " " + date + "<img src = "+ iconURL +">");

            var tempC = response.main.temp - 273.15;
            currentTemp.html((tempC).toFixed(2) + "&#8451");

            var wind = response.wind.speed * 3.6;
            currentWind.html((wind).toFixed(1) + "km/h");

            var humidity = response.main.humidity;
            currentHumidity.html((humidity) + "%");

            forecast(response.coord.lat, response.coord.lon);

            if (response.cod === 200){
                savedCities = JSON.parse(localStorage.getItem("cityname"));
                console.log(savedCities);
                if (savedCities === null) {
                    savedCities = [];
                    savedCities.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(savedCities));
                    addToList(city);
                } else {
                    if (find(city) > 0) {
                        savedCities.push(city.toUpperCase());
                        localStorage.setItem("cityname", JSON.stringify(savedCities));
                        addToList(city);
                    }
                }
            }

        });
}

// Fetch and display the UV index and 5 day forcast using the one call API that signifies longitude & latitude
function forecast(lat, lon) {
    var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

    fetch(oneCallURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (response) {
            console.log(response);

            // UV index
            currentUV.html(response.current.uvi);
            if (response.current.uvi <= 3) {
                currentUV.addClass("low");
            } else if (response.current.uvi > 3 && response.current.uvi <= 5 ) {
                currentUV.addClass("medium");
            } else if (response.current.uvi > 5) {
                currentUV.addClass("high");
            }

            // 5 Day Forecast
            for (i=0; i<5; i++) {
                var date = new Date(response.daily[i+1].dt*1000).toLocaleDateString();
                $("#fDate" + i).html(date);

                var iconCode = "https://openweathermap.org/img/wn/" + response.daily[i+1].weather[0].icon + ".png";
                $("#fIcon" + i).html("<img src=" + iconCode + ">");

                var temp = response.daily[i+1].temp.day - 273.15;
                $("#fTemp" + i).html((temp).toFixed(2) + "&#8451");

                var wind = response.daily[i+1].wind_speed * 3.6;
                $("#fWind" + i).html((wind).toFixed(1) + "km/h");

                var humidity = response.daily[i+1].humidity;
                $("#fHumidity" + i).html(humidity + "%");

            }
    });
}

// Add the searched city to the search history list and appending it to the page
function addToList(c) {
    var list = $("<li>" + c.toUpperCase() + "</li>");
    list.addClass("list-group-item");
    list.attr("data-value", c.toUpperCase());
    $(".list-group").append(list);
}

// Display the city when it is clicked on from the search history list
function pastSearch(event) {
    var liEl = event.target;
    if (event.target.matches("li")){
        city = liEl.textContent.trim();
        currentWeather(city);
    }
}

// Clear the search history
function clearHistory(event){
    event.preventDefault();
    savedCities = [];
    localStorage.removeItem("cityname");
    document.location.reload();
}

// Searches for if the city is already saved
function find(c){
    for (var i=0; i<savedCities.length; i++){
        if (c.toUpperCase() === savedCities[i]){
            return -1;
        }
    }
    return 1;
}

// Loads the last searched city when the page loads
function loadLastCity(){
    $("ul").empty();
    var savedCities = JSON.parse(localStorage.getItem("cityname"));
    if (savedCities !== null){
        savedCities = JSON.parse(localStorage.getItem("cityname"));
        for (i=0; i<savedCities.length; i++){
            addToList(savedCities[i]);
        }
        city = savedCities[i-1];
        currentWeather(city);
    }
}



searchBtn.on("click", displayWeather);
clearBtn.on("click", clearHistory);
$(document).on("click", pastSearch);
$(window).on("load", loadLastCity);