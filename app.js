const apiKey = 'cfa23d89bffbe96dc09662a061712495'

const inputCity = document.getElementById('input-city')
const todayContainer = document.querySelector('.today-container')

function fetchWeather(city) {
    
    /* making a promise to return longitude & latitude of city later */
    return fetch (
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    ).then((response) => response.json())
        .then((response) => {

        console.log('2nd res:', response)

        const lon = response.coord.lon
        const lat = response.coord.lat

        fetchonecall(lon, lat)
            .then(onecallResponse => {
                return {
                    currentWeather: response,
                    onecallWeather: onecallResponse,
                }
            });
    })
}

function fetchonecall(lon, lat) {
    return fetch (
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    ).then((response) => response.json());

}

function createTodayCard(cityName, temp, wind, humidity, uvi) {

    const article = document.createElement('article')
    article.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = cityName;
    article.appendChild(h1);

    const tempEl = document.createElement('p');
    tempEl.textcontent = "Temp: " + temp + "C";
    article.appendChild(tempEl);

    const windEl = document.createElement('p');
    windEl.textcontent = "Wind: " + wind + "km/h";
    article.appendChild(windEl);

    const humidityEl = document.createElement('p');
    humidityEl.textcontent = "Humidity: " + humidity;
    article.appendChild(humidityEl);

    const uvEl = document.createElement('p');
    uvEl.textcontent = "UV: " + uvi;
    article.appendChild(uvEl);

    return article;
}

inputCity.addEventListener('change', function(event) {
    event.preventDefault()

    /*grabbing user input*/
    const userInput = event.target.value;
    console.log(userInput)

    // run fetch weather
    fetchWeather(userInput)
    .then((response) => {
        // today's section
        //temp
        const todayTemp = response.currentWeather.main.temp - 273.15;
        //wind speed
        const todayWind = response.currentWeather.wind.speed;
        // humidity
        const todayHumidity = response.currentWeather.main.humidity;
        // uv index
        const todayUv = response.onecallWeather.current.uvi;
        // 5 day forecast
        // loop through forecast
        //date
        const card = createTodayCard(
            userInput,
            todayTemp,
            todayWind,
            todayHumidity,
            todayUv
        )
        todayContainer.appendChild(card);

        const forecasts = response.onecallWeather.daily.slice(0, 5);

        //icon

        //temp

        //wind
        
        // humidity
    })
})


fetchWeather("perth");