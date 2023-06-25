const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemEl = document.getElementById('current-weater-items');
const timezone = document.getElementById('time-zone');
const countryEL = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days=[
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const months=[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// const API_key = "c100398f8bc1b763e8b7fbcb98d79fdc";
const API_key = "6ac1d44cee5229dbdeaef254611097c6";

setInterval(() => {
    const time = new Date();
    const day = time.getDay();
    const date = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();
    const hour = time.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hours= hour>=13 ? hour%12 : hour;
    const minute = time.getMinutes();
    const minutes = minute<10 ? `0${minute}` : `${minute}`;

    timeEl.innerHTML = hours + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];

},1000);

getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success);

        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
        
    })
}

function showWeatherData( data ){
    let {humidity, pressure, sunrise, sunset ,wind_speed } = data.current;


    timezone.innerHTML = `${data.timezone}`;
    countryEL.innerHTML = data.lat+'N '+data.lon+'E'

    currentWeatherItemEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity : </div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure : </div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed : </div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise : </div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset : </div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>`;


    let otherDayForecast = "" ;
    data.daily.forEach((day ,idx) => {
        if(idx==0){
            currentTempEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
            <div class="today-forecast">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Day - ${day.temp.day} &#176;C</div>
                <div class="temp">Night - ${day.temp.night} &#176;C</div>
            </div>`
        }
        else{
            otherDayForecast+=`<div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
            <div class="temp">Day - ${day.temp.day} &#176;C</div>
            <div class="temp">Night - ${day.temp.night} &#176;C</div>
            </div>`;
        }
    })

    weatherForecastEl.innerHTML = otherDayForecast ;
}