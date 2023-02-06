<template>
  <section class="widget__container">
    <button class="configuration__button" @click="openConfig">
          <img
            class="configuration__button-img"
            :src="isClosed ? './gear.png' : './close.png'"
            alt=""
          />
        </button>
    <div class="widget__item" v-for="city in weatherItems" :key="city">
      <header class="widget__header">
        <h3 class="title">{{ isClosed ? city.name : "Settings" }}</h3>

      </header>
      <div class="widget__item-representaion" v-if="city.weatherData">
        <img
          class="widget__item-icon"
          :src="`http://openweathermap.org/img/wn/${city.weatherIcon}.png`"
          alt="icon-weather"
        />
        <span class="widget__item-degree" v-if="city.weatherData"
          >{{ city.weatherData.main.temp }}°C</span
        >
      </div>
      <div class="widget__item-info" v-if="city.weatherData">
        <p class="widget__item-info-feels">
          Feels like {{ city.weatherData.main["feels_like"] }}°C. {{ city.weatherData.weather[0].main }}, {{ city.weatherData.weather[0].description }}
        </p>
        <div class="widget__item-info-description">
          <p class="widget__item-info-wind"> 
          <img class="widget__item-info-icon" src="../assets/wind.png" alt="wind">
          {{ city.weatherData.wind.speed }}m/s, {{ city.weatherData.wind.deg }}</p>
        <p class="widget__item-info-pressure">
          <img class="widget__item-info-icon" src="../assets/pressure.png" alt="pressure">
          {{ city.weatherData.main.pressure }} hPa
        </p>
        <p class="widget__item-info-humidity">
          Humidity: {{ city.weatherData.main.humidity }}%
        </p>
        <p class="widget__item-info-visibility">
          Visibility: {{
            city.weatherData.visibility
          }}m
        </p>
        </div>


        </div>
      </div>

    <div class="weather__configuration" ref="config">
      <draggable
        v-model="weatherItems"
        handle=".weather__configuration__item-hamburger"
        @start="drag = true"
        @end="drag = false"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="weather__configuration__item">
            <button class="weather__configuration__item-hamburger">Ham</button>
            <span class="weather__configuration__item-city"
              >{{ element.name }},
              {{ element.country ? element.country : "Ne" }}</span
            >
            <button
              class="weather__configuration__item-delete"
              @click="deleteCity(element)"
            >
              <img
                class="weather__configuration__item-delete-img"
                src="../assets/delete.png"
                alt=""
              />
            </button>
          </div>
        </template>
      </draggable>
      <div class="weather__configuration__location">
        <label class="weather__configuration__location-label" for="input"
          >Add Location:
        </label>
        <input
          type="text"
          class="weather__configuration__location-input"
          id="input"
          v-model="inputCity"
        />
        <button
          class="weather__configuration__location-button"
          @click="addCity"
        >
          Add
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>

import { ref, onMounted } from "vue";

import draggable from "vuedraggable";

let inputCity = ref("");

let drag = ref(false);
let config = ref(null);

let addCity = () => {
  getData(inputCity.value);
  saveCities();
};

let deleteCity = (element) => {
  weatherItems.value = weatherItems.value.filter((city, index) => {
    return city !== element;
  });
};

const API_KEY = "06b132db1e926d7c73ce52431bc7a68c";

let weatherIcon = ref("");
let isClosed = ref(true);
let weatherItems = ref([]);
async function getData(city) {
  let result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    let data = await result.json();
    weatherItems.value.push({
      name: city,
      country: data.sys.country,
      weatherData: data,
      weatherIcon: data.weather[0].icon,
    })
}
function openConfig() {
  isClosed.value = !isClosed.value;
  isClosed.value ?  config.value.className=config.value.className = "weather__configuration": config.value.className=config.value.className + " active" ;
  console.log(config.value.className);

}

function saveCities(){
  localStorage.setItem("cities", weatherItems.value);
}


onMounted(async () => {
  navigator.geolocation.getCurrentPosition(async(position) => {
    let cityData = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
    let {city} = await cityData.json();
    getData(city);
  });
});
</script>

<style lang="scss">

$base-color: black;
$title-size: 24px;

.title{
  font-size: $title-size;
}


.widget__item-representaion{
  display: flex;
  align-items: center;
  justify-content: center;
}
.widget__container {
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid black;
  position: relative;
}

.widget__header {
  display: flex;
  justify-content: space-between;
  height: 20%;
}
.configuration__button {
  position: absolute;
  right: 0;
  width: 50px;
  height: 50px;
  outline: none;
  border: none;
  background-color: transparent;
  background-size: cover;
}
.widget__item-degree {
  color: $base-color;
  font-weight: 700;
  font-size: $title-size * 1.2;
}
.configuration__button-img {
  width: 50px;
  height: 50px;
}
.widget__item-icon {
  width: 100px;
  height: 100px;
}
.widget__item-info-icon{
  width: 40px;
  height: 40px;
}

.widget__item-info-description{
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr;
}
.weather__configuration {
  border: 1px solid black;
  position: absolute;
  left: 0;
  top: 0;
  background-color: aqua;
  width: 100%;
  height: 80%;
  transform: translateY(-200%);
  transition: transform .2s linear;
}

.weather__configuration.active {
  transform: translateY(20%);
}
.weather__configuration__item {
  background-color: rgb(160, 196, 226);
  border: 1px solid black;
  color: white;
  margin: 0 auto;
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather__configuration__item-hamburger {
  cursor: pointer;
}

.weather__configuration-header {
  display: flex;
  justify-content: space-between;
}

.weather__configuration__location-label {
  display: block;
}

.weather__configuration__item-delete {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
}
.weather__configuration__item-delete-img {
  width: 20px;
  height: 20px;
}
</style>
