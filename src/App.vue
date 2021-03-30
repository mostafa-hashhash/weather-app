<template>
  <div id="app">

    <div>
      <button> F </button>
      <button> C </button>
    </div>

      {{ city }} <br>
      {{ summary }} <br>
      {{ date }} <br>
      {{ temperature }} <br>
      {{ lowTemp }} / {{ highTemp }} <br>
      {{ todaySummary }}


    <div class="daily">

      <ul>
        <li
          v-for="day in daily_list.data"
          :key="day.time"
        >
          <p>
            {{ toDay(day.time) }}
          </p>
          <img src="./assets/sunny.svg" alt="">
          <p>
            {{ Math.round(day.temperatureHigh) }}
          </p>
        </li>

      </ul>
    </div>

    <div class="hourly">

      <ul>
        <li
          v-for="index in 24"
          :key="index"
        >
          <p> {{ toHourly(hourly_list.data[index].time) }} </p>
          <img src="./assets/sunny.svg" alt="">
          <p> {{ Math.round(hourly_list.data[index].temperature) }} </p>
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

    toCelsius(temp){
      return Math.round((temp*(9/5))+32)
    },

    toFahrenheit(temp){
      return Math.round((5/9)*(temp-32))
    },

    toHourly(time){
      return new Date(time*1000).toLocaleString('en-us', { minute:"numeric", hour: "numeric" })
    },

    toDay(time){
      return new Date(time*1000).toLocaleString('en-us', { weekday: "short"})
    },


    getWeatherInfo(latitude, longitude){
    // getWeatherInfo(){
      axios
      // .get(`http://api.darksky.net/forecast/a177f8481c31fa96c3f95ad4f4f84610/${latitude},${longitude}`
      // ,{
      //   headers: {
      //     'Referrer-Policy': 'no-referrer'
      //   }
      // }
      // )

      let url = process.env.VUE_APP_mockedURL
      let apiKey = process.env.VUE_APP_API_KEY
      axios
      .get(`${url}/${apiKey}/${latitude},${longitude}`)
      .then(
        weatherData =>{

          this.city = weatherData.data.timezone.split('/').pop()

          this.summary = weatherData.data.currently.summary
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}

#app{
  height: 100%;
  color: white;

}
body {
  height: 100%;
  background: url("./assets/Background.png") center ;
  background-repeat: no-repeat;
  background-size: cover;
  
} 

ul{
  list-style: none;
}

ul li {
    display: inline-block;
    margin: 10px;

}

.hourly, .daily {
  overflow: auto ;
  white-space: nowrap;

  
}
</style>
