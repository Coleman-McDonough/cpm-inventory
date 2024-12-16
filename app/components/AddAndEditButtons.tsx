"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import {
  PropertyEntry,
  EquipmentEntry,
  MaterialsEntry,
  HaulingEntry,
  TypesAndPrices,
} from "../models/EntrySchemas"
import PropertyForm from "../components/PropertyForm"
import EquipmentForm from "../components/EquipmentForm"
import MaterialsForm from "../components/MaterialsForm"
import HaulingForm from "./HaulingForm"

// Fetch and delete item utility functions
async function deleteItem(
  id: string,
  type: "property" | "equipment" | "materials" | "hauling"
) {
  const response = await fetch(`/api/${type}?_id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete item")
  }

  return response.json()
}

async function updateItem(
  item: PropertyEntry | EquipmentEntry | MaterialsEntry | HaulingEntry,
  type: "property" | "equipment" | "materials" | "hauling"
) {
  const response = await fetch(`/api/${type}?_id=${item._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    throw new Error("Failed to update item")
  }

  return response.json()
}

interface ClientSideComponentProps {
  entry: PropertyEntry | EquipmentEntry | MaterialsEntry | HaulingEntry
  type: "property" | "equipment" | "materials" | "hauling"
}

export default function ClientSideComponent({
  entry,
  type,
}: ClientSideComponentProps) {
  const [selectedItem, setSelectedItem] = useState<
    PropertyEntry | EquipmentEntry | MaterialsEntry | HaulingEntry | null
  >(entry)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: session } = useSession()

  const accessEmails = [
    "cpmcdonoughconstructioncorp@gmail.com",
    "colemanpmcdonough@gmail.com",
    "rickmcfarley@gmail.com",
    "patdawagon@gmail.com",
  ]
  const hasAccess = session && accessEmails.includes(session.user?.email || "")

  const handleEdit = () => {
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(entry._id!.toString(), type)
        alert("Item deleted successfully!")
        window.location.href = "/"
      } catch (error) {
        console.error("Failed to delete item", error)
        alert("Failed to delete item.")
      }
    }
  }

  const handleSave = async () => {
    if (selectedItem) {
      try {
        await updateItem(selectedItem, type)
        alert("Item updated successfully!")
        setIsModalOpen(false)
      } catch (error) {
        console.error("Failed to update item", error)
        alert("Failed to update item.")
      }
      window.location.reload()
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [e.target.name]: e.target.checked,
      })
    }
  }

  // Handle updates to the `typesAndPrices` array for materials
  const handleTypesAndPricesChange = (
    index: number,
    field: keyof TypesAndPrices,
    value: string
  ) => {
    if (selectedItem && type === "materials") {
      const updatedItem = { ...selectedItem } as MaterialsEntry
      const updatedTypesAndPrices = [...(updatedItem.typesAndPrices || [])]
      updatedTypesAndPrices[index] = {
        ...updatedTypesAndPrices[index],
        [field]: value,
      }
      updatedItem.typesAndPrices = updatedTypesAndPrices
      setSelectedItem(updatedItem)
    }
  }

  const addTypeAndPrice = () => {
    if (selectedItem && type === "materials") {
      const updatedItem = { ...selectedItem } as MaterialsEntry
      updatedItem.typesAndPrices = [
        ...(updatedItem.typesAndPrices || []),
        { type: "", deliveryPrice: "", pickupPrice: "" },
      ]
      setSelectedItem(updatedItem)
    }
  }

  const removeTypeAndPrice = (index: number) => {
    if (selectedItem && type === "materials") {
      const updatedItem = { ...selectedItem } as MaterialsEntry
      updatedItem.typesAndPrices = (updatedItem.typesAndPrices || []).filter(
        (_, i) => i !== index
      )
      setSelectedItem(updatedItem)
    }
  }

  return (
    <div>
      {/* Conditionally render Edit and Delete buttons if the user has access */}
      {hasAccess && (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleEdit}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}

      {/* Modal for updating selected item */}
      {isModalOpen && selectedItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Update Item</h2>

            {type === "property" && (
              <PropertyForm
                formData={selectedItem as PropertyEntry}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleArrayChange={() => {}}
              />
            )}

            {type === "equipment" && (
              <EquipmentForm
                formData={selectedItem as EquipmentEntry}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            )}

            {type === "materials" && (
              <MaterialsForm
                formData={selectedItem as MaterialsEntry}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleTypesAndPricesChange={handleTypesAndPricesChange}
                addTypeAndPrice={addTypeAndPrice}
                removeTypeAndPrice={removeTypeAndPrice}
              />
            )}

            {type === "hauling" && (
              <HaulingForm
                formData={selectedItem as HaulingEntry}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            )}

            {/* Modal Buttons */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-500 p-2 rounded mr-2 text-white"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-500 p-2 rounded text-white"
                onClick={() => setIsModalOpen(false)}
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
