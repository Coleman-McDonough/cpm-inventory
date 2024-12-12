"use client"

import { useState } from "react"
import PropertyForm from "../components/PropertyForm"
import EquipmentForm from "../components/EquipmentForm"
import MaterialsForm from "../components/MaterialsForm"
import HaulingForm from "./HaulingForm"
import {
  PropertyEntry,
  EquipmentEntry,
  MaterialsEntry,
  HaulingEntry,
} from "../models/EntrySchemas"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  hasAccess: boolean
}

const AddEntryModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  hasAccess,
}) => {
  const [entryType, setEntryType] = useState<string>("property")
  //const hasAccess = true // Replace this with your actual condition for access

  const [formData, setFormData] = useState<
    PropertyEntry | EquipmentEntry | MaterialsEntry | HaulingEntry
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const arrayValue = value.split(",").map((item) => item.trim())
    setFormData((prev) => ({
      ...prev,
      [name]: arrayValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/${entryType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert(`${entryType} added successfully!`)
        onClose()
        window.location.reload()
      } else {
        alert("Error adding entry")
      }
    } catch (error) {
      console.error("Failed to submit the form", error)
    }
  }

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

      case "hauling":
        return (
          <HaulingForm
            formData={formData as HaulingEntry}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {hasAccess ? (
          <div>
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
                    listingWebsites: "",
                    urlEnd: "",
                    isActive: false,
                  })
                }}
                className="p-2 border text-black"
              >
                <option value="property">Property</option>
                <option value="equipment">Equipment</option>
                <option value="materials">Materials</option>
                <option value="hauling">Hauling</option>
              </select>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {renderFields()}
              <div className="flex justify-evenly items-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 px-10 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="bg-red-500 text-white p-2 px-10 rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center align-middle">
            <p>You do not have access to this content.</p>

            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 px-10 rounded"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddEntryModal
