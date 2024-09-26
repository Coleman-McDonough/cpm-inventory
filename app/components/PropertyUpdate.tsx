import React, { useState, useEffect } from "react"
import PropertyForm from "./PropertyForm"
import { PropertyEntry } from "../models/EntrySchemas"

// Mock function to simulate fetching properties
async function fetchProperties(): Promise<PropertyEntry[]> {
  const response = await fetch("/api/property")
  return response.json()
}

// Mock function to simulate saving property
async function updateProperty(property: PropertyEntry) {
  const response = await fetch(`/api/property?_id=${property._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(property),
  })

  if (!response.ok) {
    throw new Error("Failed to update property")
  }

  return response.json()
}

const PropertyUpdate = () => {
  const [properties, setProperties] = useState<PropertyEntry[]>([])
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Fetch properties on component mount
    const getData = async () => {
      const data = await fetchProperties()
      setProperties(data)
    }
    getData()
  }, [])

  // Handle property selection
  const handlePropertyClick = (property: PropertyEntry) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedProperty) {
      setSelectedProperty({
        ...selectedProperty,
        [e.target.name]: e.target.value,
      })
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedProperty) {
      setSelectedProperty({
        ...selectedProperty,
        [e.target.name]: e.target.checked,
      })
    }
  }

  // Handle form submission (saving property)
  const handleSave = async () => {
    if (selectedProperty) {
      try {
        await updateProperty(selectedProperty)
        alert("Property updated successfully!")
        setIsModalOpen(false)
      } catch (error) {
        console.error("Failed to update property", error)
      }
    }
  }

  // Handle closing the modal
  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Update</h1>

      {/* List of properties */}
      <ul className="mb-8">
        {properties.map((property) => (
          <li
            key={property._id?.toString()}
            className="cursor-pointer text-blue-500 hover:underline mb-2"
            onClick={() => handlePropertyClick(property)}
          >
            {property.name}
          </li>
        ))}
      </ul>

      {/* Modal for updating property */}
      {isModalOpen && selectedProperty && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Update Property</h2>

            <PropertyForm
              formData={selectedProperty}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              handleArrayChange={() => {}}
            />

            {/* Modal Buttons */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-500 text-white p-2 rounded mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyUpdate
