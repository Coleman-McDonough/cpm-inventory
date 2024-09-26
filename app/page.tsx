"use client"

import React, { useState } from "react"
import PropertyList from "./components/PropertyList"
import EquipmentList from "./components/EquipmentList"
import MaterialsList from "./components/MaterialsList"

function MainPage() {
  // State to control the "Active" filter
  const [isActiveFilter, setIsActiveFilter] = useState(false)

  // Toggle the isActive filter
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsActiveFilter(e.target.checked)
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
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Show only active entries
          </label>
        </div>

        {/* Pass isActiveFilter to the list components */}
        <PropertyList isActiveFilter={isActiveFilter} />
        <EquipmentList isActiveFilter={isActiveFilter} />
        <MaterialsList isActiveFilter={isActiveFilter} />
      </div>
    </div>
  )
}

export default MainPage
