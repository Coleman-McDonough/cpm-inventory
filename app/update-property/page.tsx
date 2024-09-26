"use client"

import React, { useState, useEffect } from "react"
import PropertyForm from "../components/PropertyForm"
import { PropertyEntry } from "../models/EntrySchemas"
import { signIn, signOut, useSession } from "next-auth/react"

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
  const { data: session } = useSession()

  // Gating access based on email
  const hasAccess =
    session &&
    [
      "cpmcdonoughconstructioncorp@gmail.com",
      "colemanpmcdonough@gmail.com",
      "rickmcfarley@gmail.com",
      "dobrien274@gmail.com",
      "patdawagon@gmail.com",
    ].includes(session.user?.email ?? "")

  useEffect(() => {
    if (hasAccess) {
      // Fetch properties on component mount if the user has access
      const getData = async () => {
        const data = await fetchProperties()
        setProperties(data)
      }
      getData()
    }
  }, [hasAccess])

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
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      {/* Authentication */}
      {!session ? (
        <button onClick={() => signIn()} className="p-4 font-bold">
          Login
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="mt-4">Logged in as: {session?.user?.email}</h2>
          <button
            onClick={() => signOut()}
            className="p-2 m-2 font-bold bg-slate-700"
          >
            Logout
          </button>

          {/* Render content if the user has access */}
          {hasAccess ? (
            <>
              <h1 className="text-3xl font-bold mb-4">Property Update</h1>
              <ul className="mb-8">
                {properties.map((property) => (
                  <li
                    key={property._id?.toString()} // Convert ObjectId to string
                    className="cursor-pointer text-blue-500 hover:underline mb-2 text-center"
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
                        className="bg-green-500 p-2 rounded mr-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500 text-center">
              You do not have access to update properties.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default PropertyUpdate
