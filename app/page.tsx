"use client"

import React, { useState } from "react"
import PropertyList from "./components/PropertyList"
import EquipmentList from "./components/EquipmentList"
import MaterialsList from "./components/MaterialsList"

function MainPage() {
  // State to control the "Active" filter, checked by default
  const [isActiveFilter, setIsActiveFilter] = useState(true)

  // State to control visibility of the lists
  const [showPropertyList, setShowPropertyList] = useState(true)
  const [showEquipmentList, setShowEquipmentList] = useState(true)
  const [showMaterialsList, setShowMaterialsList] = useState(true)

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

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center m-4">CPM Inventory</h1>

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

          <label>
            <input
              type="checkbox"
              checked={showMaterialsList}
              onChange={handleShowMaterialsListChange}
              className="mr-2"
            />
            Materials
          </label>
        </div>

        {/* Conditionally render the lists based on the checkboxes */}
        {showPropertyList && <PropertyList isActiveFilter={isActiveFilter} />}
        {showEquipmentList && <EquipmentList isActiveFilter={isActiveFilter} />}
        {showMaterialsList && <MaterialsList isActiveFilter={isActiveFilter} />}
      </div>
    </div>
  )
}

export default MainPage
