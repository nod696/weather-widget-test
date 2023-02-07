import { ref } from "vue";

export async function useFetchData(city: string) {
  const API_KEY = "06b132db1e926d7c73ce52431bc7a68c";
  const data: any = ref(null);
  const error = ref(null);
  const weatherCityInfo: any = ref([]);

  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  data.value = await result.json();
  weatherCityInfo.value.push({
    name: city,
    country: data.value.sys.country,
    weatherData: data,
    weatherIcon: data.value.weather[0].icon,
  });
  return { weatherCityInfo };
}
