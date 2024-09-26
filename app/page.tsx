// app/page.tsx
"use client"

import React from "react"
import PropertyList from "./components/PropertyList"
import EquipmentList from "./components/EquipmentList"
import MaterialsList from "./components/MaterialsList"

function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white text-black">
      <div className="container mx-auto p-1">
        <h1 className="text-3xl font-bold text-center m-4">CPM Inventory</h1>
        <PropertyList />
        <EquipmentList />
        <MaterialsList />
      </div>
    </div>
  )
}

export default MainPage
