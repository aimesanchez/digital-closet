import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Location from "expo-location";

const WeatherContext = createContext();

function getWeatherCategory(tempF) {
  if (tempF >= 80) {
    return "Hot";
  }

  if (tempF >= 65) {
    return "Warm";
  }

  if (tempF >= 50) {
    return "Cool";
  }

  return "Cold";
}

function getConditionFromCode(code) {
  const conditions = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Cloudy",

    45: "Foggy",
    48: "Foggy",

    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",

    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",

    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",

    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Rain Showers",

    95: "Thunderstorms",
    96: "Thunderstorms",
    99: "Thunderstorms",
  };

  return conditions[code] || "Unknown";
}

export function WeatherProvider({
  children,
}) {
  const [
    currentWeather,
    setCurrentWeather,
  ] = useState(null);

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(true);

  const [
    weatherError,
    setWeatherError,
  ] = useState(null);

  const loadWeather = async () => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

      /* ---------------------------- */
      /* LOCATION PERMISSION          */
      /* ---------------------------- */

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (
        permission.status !==
        "granted"
      ) {
        setWeatherError(
          "Location permission was denied."
        );

        return;
      }

      /* ---------------------------- */
      /* GET LOCATION                 */
      /* ---------------------------- */

      let latitude;
      let longitude;

      try {
        const location =
          await Location.getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.Balanced,
          });

        latitude =
          location.coords.latitude;

        longitude =
          location.coords.longitude;

        console.log(
          "Using current location:",
          latitude,
          longitude
        );
      } catch (error) {
        console.log(
          "Current GPS unavailable."
        );

        if (__DEV__) {
          /*
           * Emulator fallback.
           *
           * Only used while developing
           * if the Android emulator does
           * not provide a GPS fix.
           */

          latitude = 27.5036;
          longitude = -99.5076;

          console.log(
            "Using emulator test location:",
            latitude,
            longitude
          );
        } else {
          const lastKnownLocation =
            await Location.getLastKnownPositionAsync();

          if (lastKnownLocation) {
            latitude =
              lastKnownLocation.coords.latitude;

            longitude =
              lastKnownLocation.coords.longitude;

            console.log(
              "Using last known location:",
              latitude,
              longitude
            );
          } else {
            throw new Error(
              "Unable to determine your location."
            );
          }
        }
      }

      /* ---------------------------- */
      /* FETCH WEATHER                */
      /* ---------------------------- */

      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,precipitation_probability,uv_index` +
        `&temperature_unit=fahrenheit` +
        `&wind_speed_unit=mph` +
        `&timezone=auto` +
        `&forecast_days=1`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Weather request failed."
        );
      }

      const data =
        await response.json();

      /* ---------------------------- */
      /* FIND CURRENT HOUR            */
      /* ---------------------------- */

      const currentHour =
        new Date().getHours();

      const hourlyTimes =
        data.hourly.time;

      let currentIndex = 0;

      for (
        let i = 0;
        i < hourlyTimes.length;
        i++
      ) {
        const hour =
          new Date(
            hourlyTimes[i]
          ).getHours();

        if (
          hour >= currentHour
        ) {
          currentIndex = i;
          break;
        }
      }

      /* ---------------------------- */
      /* RAIN FOR REST OF DAY         */
      /* ---------------------------- */

      const remainingRainChances =
        data.hourly
          .precipitation_probability
          .slice(currentIndex);

      const rainChance =
        remainingRainChances.length >
        0
          ? Math.max(
              ...remainingRainChances
            )
          : 0;

      const rainExpected =
        rainChance >= 40;

      /* ---------------------------- */
      /* EVENING TEMPERATURE          */
      /* ---------------------------- */

      let eveningTemperature =
        data.hourly.temperature_2m[
          data.hourly
            .temperature_2m.length - 1
        ];

      const eveningIndex =
        hourlyTimes.findIndex(
          (time) =>
            new Date(
              time
            ).getHours() === 19
        );

      if (
        eveningIndex !== -1
      ) {
        eveningTemperature =
          data.hourly.temperature_2m[
            eveningIndex
          ];
      }

      /* ---------------------------- */
      /* UV                           */
      /* ---------------------------- */

      const remainingUV =
        data.hourly.uv_index.slice(
          currentIndex
        );

      const uvIndex =
        remainingUV.length > 0
          ? Math.max(
              ...remainingUV
            )
          : 0;

      /* ---------------------------- */
      /* FINAL WEATHER OBJECT         */
      /* ---------------------------- */

      const temp =
        data.current
          .temperature_2m;

      const weatherObject = {
        temperature:
          Math.round(temp),

        feelsLike:
          Math.round(
            data.current
              .apparent_temperature
          ),

        condition:
          getConditionFromCode(
            data.current.weather_code
          ),

        weatherCategory:
          getWeatherCategory(temp),

        rainExpected,

        rainChance:
          Math.round(
            rainChance
          ),

        windSpeed:
          Math.round(
            data.current
              .wind_speed_10m
          ),

        uvIndex:
          Math.round(
            uvIndex
          ),

        eveningTemperature:
          Math.round(
            eveningTemperature
          ),
      };

      console.log(
        "Real weather:",
        weatherObject
      );

      setCurrentWeather(
        weatherObject
      );
    } catch (error) {
      console.error(
        "Weather error:",
        error
      );

      setWeatherError(
        "Unable to load weather."
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        weatherLoading,
        weatherError,
        refreshWeather:
          loadWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(
    WeatherContext
  );
}