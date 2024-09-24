// app/lib/fetchData.ts
export async function fetchData(endpoint: string) {
  try {
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Fetch error: ", error)
    return []
  }
}
