"use client"

import { useState } from "react"
import PropertyForm from "../components/PropertyForm"
import { signIn, signOut, useSession } from "next-auth/react"
import EquipmentForm from "../components/EquipmentForm"
import MaterialsForm from "../components/MaterialsForm"
import {
  PropertyEntry,
  EquipmentEntry,
  MaterialsEntry,
} from "../models/EntrySchemas" // Import your models

const AddEntryPage = () => {
  const [entryType, setEntryType] = useState<string>("property")
  const { data: session } = useSession()
  const hasAccess =
    (session &&
      session.user?.email === "cpmcdonoughconstructioncorp@gmail.com") ||
    (session && session.user?.email === "colemanpmcdonough@gmail.com") ||
    (session && session.user?.email === "rickmcfarley@gmail.com") ||
    (session && session.user?.email === "dobrien274@gmail.com") ||
    (session && session.user?.email === "patdawagon@gmail.com")

  const viewOnly =
    (session && session.user?.email === "colemanpmcdonough@gmail.com") ||
    (session && session.user?.email === "dobrien274@gmail.com") ||
    false

  // State to track form data based on the entry type
  const [formData, setFormData] = useState<
    PropertyEntry | EquipmentEntry | MaterialsEntry
  >({
    name: "",
    address: "",
    squareFootage: "0",
    price: "0",
    description: "",
    imageUrl: "",
    isRental: false,
    listingWebsites: "",
    urlEnd: "",
    isActive: false,
  })

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox change (for isRental)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle array field change (for listingWebsites)
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const arrayValue = value.split(",").map((item) => item.trim())
    setFormData((prev) => ({
      ...prev,
      [name]: arrayValue,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/${entryType}`, {
        method: "POST", // Use POST to create a new entry
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(`${entryType} added successfully!`)
      } else {
        alert("Error adding entry")
      }
    } catch (error) {
      console.error("Failed to submit the form", error)
    }
  }

  // Conditional form rendering based on the selected type
  const renderFields = () => {
    switch (entryType) {
      case "property":
        return (
          <PropertyForm
            formData={formData as PropertyEntry}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            handleArrayChange={handleArrayChange}
          />
        )

      case "equipment":
        return (
          <EquipmentForm
            formData={formData as EquipmentEntry}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        )

      case "materials":
        return (
          <MaterialsForm
            formData={formData as MaterialsEntry}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {!session ? (
        <button onClick={() => signIn()} className="p-4 font-bold">
          Login
        </button>
      ) : (
        <div className="flex">
          {/*<h2 className="mt-4">{session?.user?.email}</h2>*/}
          <button
            onClick={() => signOut()}
            className="p-2 m-2 font-bold bg-slate-700"
          >
            Logout
          </button>
        </div>
      )}

      <div className="flex">
        <a className="p-2 m-2 font-bold bg-slate-500" href="/">
          Home
        </a>
        <a className="p-2 m-2 font-bold bg-slate-500" href="/admin">
          Admin
        </a>
      </div>
      {session && (
        <div>
          <div className="container mx-auto bg-white text-black">
            {/* Conditionally render content based on the user's email */}
            {hasAccess ? (
              <div className="container mx-auto p-4 lg:max-w-3xl">
                <h1 className="text-3xl font-bold mb-4">Add New Entry</h1>
                <div className="mb-4">
                  <label htmlFor="entryType" className="mr-2">
                    Select Type:
                  </label>
                  <select
                    id="entryType"
                    value={entryType}
                    onChange={(e) => {
                      setEntryType(e.target.value)
                      setFormData({
                        name: "",
                        address: "",
                        squareFootage: "0",
                        price: "0",
                        description: "",
                        imageUrl: "",
                        isRental: false,
                        listingWebsites: "", // Reset as needed
                        urlEnd: "", // Reset as needed
                        isActive: false,
                      })
                    }}
                    className="p-2 border text-black"
                  >
                    <option value="property">Property</option>
                    <option value="equipment">Equipment</option>
                    <option value="materials">Materials</option>
                  </select>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  {renderFields()}
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 mt-4 rounded"
                  >
                    Submit
                  </button>
                </form>
              </div>
            ) : (
              <p>You do not have access to this content.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddEntryPage
