export async function GET() {
  try {
    const response = await fetch(
      "https://iran-locations-api.ir/api/v1/fa/states"
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
