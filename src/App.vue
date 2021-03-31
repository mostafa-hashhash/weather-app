<template>
  <div id="app">

    <div class="header">
            
      <h2>INSTAWEATHER</h2>

      <div class="temp-btn">
        <button class="cel-btn" @click="()=>{isFeh = false}"> C </button>
        <button class="feh-btn" autofocus @click="()=>{isFeh = true}"> F </button>
      </div>

    </div>

    <div class="info">

      <div class="basic">
        <h1 class="city"> {{city}} </h1>
        <p class="date"><b>{{ date }}</b></p>
        <img v-if="icon == 'clear-day'" src="./assets/sunny.svg">
        <img v-else-if="icon == 'partly-cloudy-night'" src="./assets/cloudy-night.png" width="65px">
        <img v-else-if="icon == 'cloudy'" src="./assets/cloudy.svg">
        <img v-else src="./assets/night_clear.png" alt="Clear Night" width="65px">
        <p class="summary"><b>{{summary}}</b></p>
      </div>

      <div class="temp">
        <h1 class="current-temp"> {{ adjustTemp(temperature) }} <span>&#176;</span> </h1>
        <p class="high-low-temp">
          {{ adjustTemp(lowTemp) }}<span>&#176;</span> / 
          {{ adjustTemp(highTemp) }} <span>&#176;</span>
        </p>
        <p class="summary"><b>{{ todaySummary }}</b></p>
      </div>

    </div>
      

    <div class="forecast-btn">
      <button @click="()=>{isHourly = true}" autofocus >Hourly</button>
      <button @click="()=>{isHourly = false}" class="daily-btn">Daily</button>
    </div>


    <div class="forecast">

      <ul v-if="isHourly">
        <li
          v-for="index in 24"
          :key="index"
        >
          <p> {{ toHourly(hourly_list.data[index-1].time) }} </p>
          <img v-if="hourly_list.data[index-1].icon == 'clear-day'" src="./assets/sunny.svg">
          <img v-else-if="hourly_list.data[index-1].icon == 'cloudy'" src="./assets/cloudy.svg">
          <img v-else-if="hourly_list.data[index-1].icon == 'partly-cloudy-night'" src="./assets/cloudy-night.png" width="65px">
          <img v-else src="./assets/night_clear.png" alt="Clear Night" width="65px">
          <p>
            {{ adjustTemp(hourly_list.data[index-1].temperature) }}
            <span>&#176;</span>
          </p>
        </li>
      </ul>

      <ul v-else>
        <li
          v-for="day in daily_list.data"
          :key="day.time"
        >
          <p> {{ toDay(day.time) }} </p>
          <img v-if=" day.icon == 'clear-day' " src="./assets/sunny.svg" alt="Sunny Day">
          <img v-else src="./assets/cloudy.svg" alt="Partly Cloudy Day">
          <p>
            {{ adjustTemp(day.temperatureHigh) }}
            <span>&#176;</span>
          </p>
        </li>
      </ul>

    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  data(){
    return{
      isHourly: true,
      isFeh: true,
      errorMsg:"",
      response: "",
      daily_list: "",
      hourly_list: "",
      city: "",
      summary: "",
      date: "",
      temperature: "",
      lowTemp: "",
      highTemp: "",
      todaySummary: ""
    }
  },

  methods:{

    adjustTemp(temp){
      if(this.isFeh) 
        return Math.round(temp)
      else 
        return this.toCelsius(temp)
    },

    toCelsius(temp){
      return Math.round((5/9)*(temp-32))
    },

    toHourly(time){
      return new Date(time*1000).toLocaleString('en-us', { minute: "numeric", hour: "numeric" })
    },

    toDay(time){
      return new Date(time*1000).toLocaleString('en-us', { weekday: "short"})
    },


    getWeatherInfo(latitude, longitude){

      let url = process.env.VUE_APP_apiURL
      let apiKey = process.env.VUE_APP_API_KEY

      axios
      .get(`${url}/${apiKey}/${latitude},${longitude}`)
      .then(
        weatherData =>{

          this.city = weatherData.data.timezone.split('/').pop()

          this.summary = weatherData.data.currently.summary
          this.icon = weatherData.data.currently.icon
          this.date = new Date(weatherData.data.currently.time * 1000).toLocaleDateString('en-us',{weekday: "long", day: "numeric", year: "numeric"})
          this.temperature = weatherData.data.currently.temperature
          
          this.lowTemp = weatherData.data.daily.data[0].temperatureLow
          this.highTemp = weatherData.data.daily.data[0].temperatureHigh
          this.todaySummary = weatherData.data.daily.data[0].summary
          
          this.hourly_list = weatherData.data.hourly
          this.daily_list = weatherData.data.daily

        }
      )
    }

  },

  mounted(){

    if(!("geolocation" in navigator)){
      this.errorMsg = "Geolocation is not supported"
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.getWeatherInfo(position.coords.latitude, position.coords.longitude)
      }
    )

  }
}
</script>

<style>

* {
  color: white;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  padding: 1% 4%;
}

ul{
  list-style: none;
  padding: 0px;
  border-top: 1px solid rgb(255, 255, 255, 0.3)
}

ul li {
  display: inline-block;
  margin: 12px 15px;
  text-align: center;
}

.forecast {
  overflow: auto ;
  white-space: nowrap;
  width: 100%;
  margin-top: -10px;
}

button{
  background: transparent;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 4px ;
}

.forecast-btn {
  width: 100%;
  display: inline-block;
  margin: 2% 1% -10px 0px;
}

.forecast-btn button:focus {
  border-bottom: 2px solid;
}

body {
  height: 100%;
  background: url("./assets/Background.png") center ;
  background-repeat: no-repeat;
  background-size: cover;
}

.cel-btn {
  border-right: 1px solid white;
}

.feh-btn {
  border-left: 1px solid white;
}

.temp-btn button:focus{
  background-color: rgba(248, 247, 216, 0.3);
}

.temp-btn button {
  padding: 5px 25px;
}

.forecast::-webkit-scrollbar {
  height: 5px;
}

.forecast::-webkit-scrollbar-track {
  background: rgba(148, 148, 148, 0.4);
  border-radius: 5px;
}
 
.forecast::-webkit-scrollbar-thumb {
  background: rgb(255, 255, 255); 
  border-radius: 5px;
}

.forecast::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.8);
}

.info {
  padding: 1%; 
}

.basic {
  float: left;
}

.temp{
  text-align: right;
  float: right;
}

.header h2 {
  display: inline-block;
  margin: 1% ;
}

.header div {
  float: right;
  margin: auto;
  margin: 10px 5px;
}

.header{
  display: inline-block;
  width: 100%;
}

.city {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.current-temp {
  font-size: 70px;
  margin-bottom: 0px;
}

.high-low-temp {
  font-size: 25px;
  margin: 10px auto ;
}

.date, .summary {
  margin-top: 5px;
  margin-bottom: 25px;
}

.daily-btn {
  margin-left: 20px;
}

</style>