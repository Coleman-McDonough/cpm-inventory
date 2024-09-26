"use client"

import React, { useState, useEffect } from "react"
import EquipmentForm from "../components/EquipmentForm"
import { EquipmentEntry } from "../models/EntrySchemas"
import { signIn, signOut, useSession } from "next-auth/react"

// Mock function to simulate fetching equipment entries
async function fetchEquipment(): Promise<EquipmentEntry[]> {
  const response = await fetch("/api/equipment")
  return response.json()
}

// Mock function to simulate saving equipment
async function updateEquipment(equipment: EquipmentEntry) {
  const response = await fetch(`/api/equipment?_id=${equipment._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipment),
  })

  if (!response.ok) {
    throw new Error("Failed to update equipment")
  }

  return response.json()
}

const EquipmentUpdate = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentEntry[]>([])
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentEntry | null>(null)
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
      // Fetch equipment on component mount if the user has access
      const getData = async () => {
        const data = await fetchEquipment()
        setEquipmentList(data)
      }
      getData()
    }
  }, [hasAccess])

  // Handle equipment selection
  const handleEquipmentClick = (equipment: EquipmentEntry) => {
    setSelectedEquipment(equipment)
    setIsModalOpen(true)
  }

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedEquipment) {
      setSelectedEquipment({
        ...selectedEquipment,
        [e.target.name]: e.target.value,
      })
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedEquipment) {
      setSelectedEquipment({
        ...selectedEquipment,
        [e.target.name]: e.target.checked,
      })
    }
  }

  // Handle form submission (saving equipment)
  const handleSave = async () => {
    if (selectedEquipment) {
      try {
        await updateEquipment(selectedEquipment)
        alert("Equipment updated successfully!")
        setIsModalOpen(false)
      } catch (error) {
        console.error("Failed to update equipment", error)
      }
    }
  }

  // Handle closing the modal
  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedEquipment(null)
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
              <h1 className="text-3xl font-bold mb-4">Equipment Update</h1>
              <ul className="mb-8">
                {equipmentList.map((equipment) => (
                  <li
                    key={equipment._id?.toString()} // Convert ObjectId to string
                    className="cursor-pointer text-blue-500 hover:underline mb-2 text-center"
                    onClick={() => handleEquipmentClick(equipment)}
                  >
                    {equipment.name}
                  </li>
                ))}
              </ul>

              {/* Modal for updating equipment */}
              {isModalOpen && selectedEquipment && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
                  <div className="bg-white p-4 rounded shadow-lg w-1/2">
                    <h2 className="text-xl font-bold mb-4">Update Equipment</h2>

                    <EquipmentForm
                      formData={selectedEquipment}
                      handleChange={handleChange}
                      handleCheckboxChange={handleCheckboxChange}
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
              You do not have access to update equipment.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default EquipmentUpdate
