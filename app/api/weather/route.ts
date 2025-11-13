import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Extract the city from the request's URL
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  //   const apiKey = process.env.WEATHER_API_KEY;
  const apiKey = "c4682d53b4e71c9fc7d66112840ce5e0";
  console.log(apiKey, " check api key");
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const weatherResponse = await fetch(apiUrl);
    const weatherData = await weatherResponse.json();

    if (weatherResponse.status !== 200) {
      return NextResponse.json(
        { error: weatherData.message || "Failed to fetch weather data" },
        { status: weatherResponse.status }
      );
    }

    // Simplify the response to be easily consumable by an AI
    const simplifiedData = {
      location: weatherData.name,
      temperature_celsius: weatherData.main.temp,
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
    };

    return NextResponse.json(simplifiedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
