"use client"

import React, { useState, useEffect } from "react"
import PropertyForm from "../components/PropertyForm"
import EquipmentForm from "../components/EquipmentForm"
import MaterialsForm from "../components/MaterialsForm"
import {
  PropertyEntry,
  EquipmentEntry,
  MaterialsEntry,
} from "../models/EntrySchemas"
import { signIn, signOut, useSession } from "next-auth/react"
import AddEntryModal from "../components/AddEntryModal"

// Fetch properties, equipment, or materials
async function fetchItems(type: "property" | "equipment" | "materials") {
  const response = await fetch(`/api/${type}`)
  return response.json()
}

// Update property, equipment, or material
async function updateItem(
  item: PropertyEntry | EquipmentEntry | MaterialsEntry,
  type: "property" | "equipment" | "materials"
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

// Delete property, equipment, or material
async function deleteItem(
  id: string,
  type: "property" | "equipment" | "materials"
) {
  const response = await fetch(`/api/${type}?_id=${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete item")
  }

  return response.json()
}

const AdminMainPage = () => {
  const [isActiveFilter, setIsActiveFilter] = useState(true)
  const [showPropertyList, setShowPropertyList] = useState(true)
  const [showEquipmentList, setShowEquipmentList] = useState(true)
  const [showMaterialsList, setShowMaterialsList] = useState(true)
  const [properties, setProperties] = useState<PropertyEntry[]>([])
  const [equipment, setEquipment] = useState<EquipmentEntry[]>([])
  const [materials, setMaterials] = useState<MaterialsEntry[]>([])
  const [selectedItem, setSelectedItem] = useState<
    PropertyEntry | EquipmentEntry | MaterialsEntry | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentType, setCurrentType] = useState<
    "property" | "equipment" | "materials" | null
  >(null)
  const { data: session } = useSession()

  // Access control
  const hasAccess =
    (session &&
      session.user?.email === "cpmcdonoughconstructioncorp@gmail.com") ||
    (session && session.user?.email === "colemanpmcdonough@gmail.com") ||
    (session && session.user?.email === "rickmcfarley@gmail.com") ||
    //(session && session.user?.email === "dobrien274@gmail.com") ||
    (session && session.user?.email === "patdawagon@gmail.com") ||
    false

  // Fetch data when component mounts
  useEffect(() => {
    if (hasAccess) {
      if (showPropertyList) fetchData("property")
      if (showEquipmentList) fetchData("equipment")
      if (showMaterialsList) fetchData("materials")
    }
  }, [showPropertyList, showEquipmentList, showMaterialsList, hasAccess])

  const fetchData = async (type: "property" | "equipment" | "materials") => {
    const data = await fetchItems(type)
    if (type === "property") setProperties(data)
    if (type === "equipment") setEquipment(data)
    if (type === "materials") setMaterials(data)
  }

  const handleItemClick = (
    item: PropertyEntry | EquipmentEntry | MaterialsEntry,
    type: "property" | "equipment" | "materials"
  ) => {
    setSelectedItem(item)
    setCurrentType(type)
    setIsModalOpen(true)
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

  const handleSave = async () => {
    if (selectedItem && currentType) {
      try {
        await updateItem(selectedItem, currentType)
        alert("Item updated successfully!")
        setIsModalOpen(false)
        fetchData(currentType) // Refresh data after update
      } catch (error) {
        console.error("Failed to update item", error)
      }
    }
  }

  const handleDelete = async (
    id: string,
    type: "property" | "equipment" | "materials"
  ) => {
    try {
      await deleteItem(id, type)
      alert("Item deleted successfully!")
      fetchData(type) // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete item", error)
    }
  }

  const handleDeleteClick = (
    id: string,
    type: "property" | "equipment" | "materials"
  ) => {
    if (confirm("Are you sure you want to delete this item?")) {
      handleDelete(id, type)
    }
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
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
        <button
          className={`p-2 m-2 font-bold bg-slate-500 ${
            hasAccess ? "" : "hidden"
          }`}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add
        </button>
      </div>
      {session && hasAccess && (
        <div className="container mx-auto p-4 bg-white text-black min-h-screen max-w-xl">
          <h1 className="text-3xl font-bold text-center mb-4">
            CPM Inventory Management Admin
          </h1>
          <div className="mb-4 flex justify-center">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={isActiveFilter}
                onChange={(e) => setIsActiveFilter(e.target.checked)}
                className="mr-2"
              />
              Active
            </label>
          </div>

          <div className="flex justify-center mb-4">
            <label className="mr-4">
              <input
                type="checkbox"
                checked={showPropertyList}
                onChange={(e) => setShowPropertyList(e.target.checked)}
                className="mr-2"
              />
              Properties
            </label>

            <label className="mr-4">
              <input
                type="checkbox"
                checked={showEquipmentList}
                onChange={(e) => setShowEquipmentList(e.target.checked)}
                className="mr-2"
              />
              Equipment
            </label>

            <label>
              <input
                type="checkbox"
                checked={showMaterialsList}
                onChange={(e) => setShowMaterialsList(e.target.checked)}
                className="mr-2"
              />
              Materials
            </label>
          </div>

          {/* Lists */}
          {showPropertyList && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Properties</h2>
              <ul>
                {properties
                  .filter((property) =>
                    isActiveFilter ? property.isActive : true
                  )
                  .map((property) => (
                    <li
                      key={property._id?.toString()}
                      className="flex justify-between items-center border p-2 mb-2"
                    >
                      <span>{property.name}</span>
                      <div>
                        <button
                          onClick={() => handleItemClick(property, "property")}
                          className="mr-2 p-2 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              property._id?.toString()!,
                              "property"
                            )
                          }
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {showEquipmentList && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Equipment</h2>
              <ul>
                {equipment
                  .filter((eq) => (isActiveFilter ? eq.isActive : true))
                  .map((eq) => (
                    <li
                      key={eq._id?.toString()}
                      className="flex justify-between items-center border p-2 mb-2"
                    >
                      <span>{eq.name}</span>
                      <div>
                        <button
                          onClick={() => handleItemClick(eq, "equipment")}
                          className="mr-2 p-2 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(eq._id?.toString()!, "equipment")
                          }
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {showMaterialsList && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Materials</h2>
              <ul>
                {materials
                  .filter((material) =>
                    isActiveFilter ? material.isActive : true
                  )
                  .map((material) => (
                    <li
                      key={material._id?.toString()}
                      className="flex justify-between items-center border p-2 mb-2"
                    >
                      <span>{material.name}</span>
                      <div>
                        <button
                          onClick={() => handleItemClick(material, "materials")}
                          className="mr-2 p-2 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              material._id?.toString()!,
                              "materials"
                            )
                          }
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <AddEntryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            hasAccess={hasAccess}
          />
          {/* Modal for updating selected item */}
          {isModalOpen && selectedItem && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">Update Item</h2>

                {currentType === "property" && (
                  <PropertyForm
                    formData={selectedItem as PropertyEntry}
                    handleChange={handleChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleArrayChange={() => {}}
                  />
                )}

                {currentType === "equipment" && (
                  <EquipmentForm
                    formData={selectedItem as EquipmentEntry}
                    handleChange={handleChange}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                )}

                {currentType === "materials" && (
                  <MaterialsForm
                    formData={selectedItem as MaterialsEntry}
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
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {session && !hasAccess && (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center m-4">
            You do not have access to this page
          </h1>
        </div>
      )}
    </div>
  )
}

export default AdminMainPage
