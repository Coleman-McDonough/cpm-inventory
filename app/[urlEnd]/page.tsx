import { notFound } from "next/navigation" // Next.js App Router's way of handling 404s
import {
  PropertyEntry,
  EquipmentEntry,
  MaterialsEntry,
} from "../models/EntrySchemas"
import { formatStringAsNumber } from "../lib/helpers"
import ClientSideComponent from "../components/AddAndEditButtons" // New client-side component for session handling

export const revalidate = 0 // Disable ISR and ensure the page is always fetched dynamically

interface Props {
  params: {
    urlEnd: string // Dynamic route parameter
  }
}

// Fetch data from either property, equipment, or materials based on the type
async function fetchData(
  urlEnd: string,
  origin: string,
  type: "property" | "equipment" | "materials"
): Promise<PropertyEntry | EquipmentEntry | MaterialsEntry | null> {
  const response = await fetch(`${origin}/api/${type}?urlEnd=${urlEnd}`, {
    cache: "no-store", // Ensure fresh data on each request
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()

  return data || null
}

export default async function PropertyOrEquipmentOrMaterialPage({
  params,
}: {
  params: { urlEnd: string }
}) {
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000" // Fallback to localhost in development

  // Try fetching from materials first, then equipment, then properties
  let entry = await fetchData(params.urlEnd, origin, "materials")
  let type: "property" | "equipment" | "materials" = "materials"

  if (!entry) {
    entry = await fetchData(params.urlEnd, origin, "equipment")
    type = "equipment"
  }

  if (!entry) {
    entry = await fetchData(params.urlEnd, origin, "property")
    type = "property"
  }

  if (!entry) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4 align-middle bg-white text-black">
      <div className="flex justify-between items-center mb-4">
        <a href={`/`} className="p-2 bg-green-500 text-white rounded">
          Go Back
        </a>
        <h1 className="text-2xl font-bold">{entry.name}</h1>
        <ClientSideComponent entry={entry} type={type} />
      </div>
      <img
        src={entry.imageUrl}
        alt={entry.name}
        className="w-full h-96 object-cover mb-4"
      />

      {/* Conditionally render fields based on whether it's property, equipment, or materials */}
      {type === "property" && (
        <>
          <p className="border-2 p-1">
            <strong>Address:</strong> {(entry as PropertyEntry).address}
          </p>
          <p className="border-2 p-1">
            <strong>Price:</strong> $
            {`${formatStringAsNumber((entry as PropertyEntry).price)}${
              (entry as PropertyEntry).isRental ? " /ft" : ""
            }`}
          </p>
          <p className="border-2 p-1">
            <strong>Square Footage:</strong>{" "}
            {formatStringAsNumber((entry as PropertyEntry).squareFootage)}
          </p>
          <p className="border-2 p-1">
            <strong>Rental Status:</strong>{" "}
            {(entry as PropertyEntry).isRental ? "For Rent" : "For Sale"}
          </p>
        </>
      )}

      {type === "equipment" && (
        <>
          <p className="border-2 p-1">
            <strong>Price:</strong> $
            {formatStringAsNumber((entry as EquipmentEntry).price)}
          </p>
        </>
      )}

      {type === "materials" && (
        <>
          <p className="border-2 p-1">
            <strong>Delivery Price:</strong> $
            {formatStringAsNumber((entry as MaterialsEntry).deliveryPrice)}
          </p>
          <p className="border-2 p-1">
            <strong>Pickup Price:</strong> $
            {formatStringAsNumber((entry as MaterialsEntry).pickupPrice)}
          </p>
        </>
      )}

      {/* Common fields for all types */}
      <p className="border-2 p-1">
        <strong>Description:</strong> {entry.description}
      </p>
      <p className="border-2 p-1">
        <strong>Active:</strong> {entry.isActive ? "Yes" : "No"}
      </p>
      <p className="border-2 p-1">
        <strong>Listing Websites:</strong> {entry.listingWebsites}
      </p>
    </div>
  )
}
