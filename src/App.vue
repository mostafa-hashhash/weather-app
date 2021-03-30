<template>
  <div id="app">
    {{response}}

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  data(){
    return{
      errorMsg:"",
      response: ""
    }
  },

  methods:{
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
          this.response = weatherData.data
        }
      )
      
      // console.log(process.env)
      // console.log(process.env.API_KEY)
      // console.log(process.env)
      // console.log(process.env)
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
  background: url("./assets/Background.svg") center ;
  background-repeat: no-repeat;
  background-size: cover;
  
} 
</style>
