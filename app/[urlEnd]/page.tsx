import { notFound } from "next/navigation" // Next.js App Router's way of handling 404s
import { PropertyEntry } from "../models/EntrySchemas"

interface Props {
  params: {
    urlEnd: string // Dynamic route parameter
  }
}

// Mocked fetchData function for demo purposes, replace with actual data fetching logic
async function fetchData(
  urlEnd: string,
  origin: string
): Promise<PropertyEntry | null> {
  const response = await fetch(`${origin}/api/property?urlEnd=${urlEnd}`)

  if (!response.ok) {
    // Handle error or not found
    return null
  }

  const property = await response.json()
  return property || null
}

export default async function PropertyPage({
  params,
}: {
  params: { urlEnd: string }
}) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" // Fallback to localhost in development

  const property = await fetchData(params.urlEnd, origin)

  if (!property) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 align-middle bg-white text-black">
      <div className="flex justify-between items-center  mb-4">
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <a href={`/`} className="p-2 bg-green-500 text-white rounded">
          Go Back
        </a>
      </div>
      <img
        src={property.imageUrl}
        alt={property.name}
        className="w-full h-96 object-cover mb-4"
      />
      <p className="border-2 p-1">
        <strong>Address:</strong> {property.address}
      </p>
      <p className="border-2 p-1">
        <strong>Square Footage:</strong> {property.squareFootage}
      </p>
      <p className="border-2 p-1">
        <strong>Price:</strong> ${property.price.toLocaleString()}
      </p>
      <p className="border-2 p-1">
        <strong>Description:</strong> {property.description}
      </p>
      <p className="border-2 p-1">
        <strong>Rental Status:</strong>{" "}
        {property.isRental ? "For Rent" : "For Sale"}
      </p>
      <p className="border-2 p-1">
        <strong>Listing Websites:</strong> {property.listingWebsites}
      </p>
    </div>
  )
}
