<template>
  <section class="widget__container">
    <button class="configuration__button" @click="openConfig">
      <img
        class="configuration__button-img"
        :src="isClosed ? './gear.png' : './close.png'"
        alt=""
      />
    </button>
    <WeatherConfiguration
      v-if="weatherItems"
      @changeData="changeDataCities"
      :cities="weatherItems"
      :isClosed="isClosed"
    ></WeatherConfiguration>
    <div class="widget__list" v-if="isClosed">
      <div class="widget__item" v-for="city in weatherItems" :key="city">
        <header class="widget__header">
          <h3 class="title">{{ city.name }}</h3>
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
            Feels like {{ city.weatherData.main["feels_like"] }}°C.
            {{ city.weatherData.weather[0].main }},
            {{ city.weatherData.weather[0].description }}
          </p>
          <div class="widget__item-info-description">
            <p class="widget__item-info-wind">
              <img
                class="widget__item-info-icon"
                src="../assets/wind.png"
                alt="wind"
              />
              {{ city.weatherData.wind.speed }}m/s,
              {{ city.weatherData.wind.deg }}
            </p>
            <p class="widget__item-info-pressure">
              <img
                class="widget__item-info-icon"
                src="../assets/pressure.png"
                alt="pressure"
              />
              {{ city.weatherData.main.pressure }} hPa
            </p>
            <p class="widget__item-info-humidity">
              Humidity: {{ city.weatherData.main.humidity }}%
            </p>
            <p class="widget__item-info-visibility">
              Visibility: {{ city.weatherData.visibility }}m
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetchData } from "../composables/useFetchData";
import WeatherConfiguration from "./WeatherConfiguration.vue";

let weatherItems = ref();

function changeDataCities(arr: Array<object>) {
  weatherItems.value = arr;
}

let isClosed = ref(true);
function openConfig() {
  isClosed.value = !isClosed.value;
}
onMounted(async () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    let cityData = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
    );
    let { city } = await cityData.json();
    let { weatherCityInfo } = await useFetchData(city);
    weatherItems.value = [];
    weatherItems.value = [...weatherItems.value, ...weatherCityInfo.value];

    getCitiesFromStorage();
    return;
  });

});

function getCitiesFromStorage(){
  if(localStorage.getItem("cities")){
    let dataFromStorage: string = localStorage.getItem("cities");
  weatherItems.value = JSON.parse(dataFromStorage);
  }

}
</script>

<style lang="scss">
$base-color: black;
$title-size: 24px;

.title {
  font-size: $title-size;
  padding: 0 0 0 20px;
}

.widget__item-representaion {
  display: flex;
  align-items: center;
  justify-content: center;
}
.widget__container {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 6px 8px 0px rgba(34, 60, 80, 0.2);
}

.widget__header {
  display: flex;
  justify-content: space-between;
  height: 20%;
}
.configuration__button {
  cursor: pointer;
  position: absolute;
  z-index: 10;
  right: 0;
  width: 35px;
  height: 35px;
  margin: 20px;
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
  width: 35px;
  height: 35px;
}
.widget__item-icon {
  width: 100px;
  height: 100px;
}
.widget__item-info-icon {
  width: 40px;
  height: 40px;
}

.widget__item-info-description {
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr;
}
</style>
