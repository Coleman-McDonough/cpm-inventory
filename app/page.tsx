"use client"

import React, { useState, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import PropertyList from "./components/PropertyList"
import EquipmentList from "./components/EquipmentList"
import MaterialsList from "./components/MaterialsList"
import HaulingList from "./components/HaulingList"
import AddEntryModal from "./components/AddEntryModal"

// Define your access control emails
const ACCESS_EMAILS = [
  "cpmcdonoughconstructioncorp@gmail.com",
  "colemanpmcdonough@gmail.com",
  "rickmcfarley@gmail.com",
  "patdawagon@gmail.com",
]

function MainPage() {
  const [isActiveFilter, setIsActiveFilter] = useState(false)
  const [showPropertyList, setShowPropertyList] = useState(false)
  const [showEquipmentList, setShowEquipmentList] = useState(false)
  const [showMaterialsList, setShowMaterialsList] = useState(false)
  const [showHaulingList, setShowHaulingList] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { data: session } = useSession()

  // Determine if the user has access based on their email
  const hasAccess = session && ACCESS_EMAILS.includes(session.user?.email || "")

  // Toggle the isActive filter
  const handleIsActiveCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsActiveFilter(e.target.checked)
  }

  // Toggle visibility of each list
  const handleShowPropertyListChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowPropertyList(e.target.checked)
  }

  const handleShowEquipmentListChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowEquipmentList(e.target.checked)
  }

  const handleShowMaterialsListChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowMaterialsList(e.target.checked)
  }

  const handleShowHaulingListChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowHaulingList(e.target.checked)
  }

  // Handle the "Add" button click
  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  // Determine if all checkboxes are unchecked
  const allUnchecked =
    !showPropertyList &&
    !showEquipmentList &&
    !showMaterialsList &&
    !showHaulingList

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center m-4">CPM Inventory</h1>

        {/* Conditional login/logout/add buttons */}
        {!session ? (
          <div className="flex justify-center">
            <button
              onClick={() => signIn()}
              className="p-2 m-2 font-bold bg-slate-500"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => signOut()}
              className="p-2 m-2 font-bold bg-slate-500"
            >
              Logout
            </button>
            {hasAccess && (
              <button
                onClick={handleAddClick}
                className="p-2 m-2 font-bold bg-slate-500"
              >
                Add
              </button>
            )}
          </div>
        )}

        {/* Checkbox to toggle "Active" filter */}
        <div className="flex items-center justify-center mb-4">
          <label className="mr-2">
            <input
              type="checkbox"
              checked={isActiveFilter}
              onChange={handleIsActiveCheckboxChange}
              className="mr-2"
            />
            Active
          </label>
        </div>

        {/* Checkboxes to show/hide the lists */}
        <div className="flex items-center justify-center mb-4">
          <label className="mr-4">
            <input
              type="checkbox"
              checked={showPropertyList}
              onChange={handleShowPropertyListChange}
              className="mr-2"
            />
            Properties
          </label>

          <label className="mr-4">
            <input
              type="checkbox"
              checked={showEquipmentList}
              onChange={handleShowEquipmentListChange}
              className="mr-2"
            />
            Equipment
          </label>

          <label className="mr-4">
            <input
              type="checkbox"
              checked={showMaterialsList}
              onChange={handleShowMaterialsListChange}
              className="mr-2"
            />
            Materials
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              checked={showHaulingList}
              onChange={handleShowHaulingListChange}
              className="mr-2"
            />
            Hauling
          </label>
        </div>

        {/* Conditionally render the lists based on the checkboxes */}
        {(allUnchecked || showPropertyList) && (
          <PropertyList isActiveFilter={isActiveFilter} />
        )}
        {(allUnchecked || showEquipmentList) && (
          <EquipmentList isActiveFilter={isActiveFilter} />
        )}
        {(allUnchecked || showMaterialsList) && (
          <MaterialsList isActiveFilter={isActiveFilter} />
        )}
        {(allUnchecked || showHaulingList) && (
          <HaulingList isActiveFilter={isActiveFilter} />
        )}

        {/* Add Entry Modal */}
        {hasAccess && (
          <AddEntryModal
            hasAccess={hasAccess}
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false)
              window.location.href = "/"
            }}
          />
        )}
      </div>
    </div>
  )
}

export default MainPage
