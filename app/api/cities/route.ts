import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get("state");

  try {
    const response = await fetch(
      `https://iran-locations-api.ir/api/v1/fa/cities?state=${state}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.log(error);

    return Response.json(
      { error: "Failed to fetch data from API" },
      { status: 500 }
    );
  }
}
