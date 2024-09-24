// app/page.tsx
"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"
import axios from "axios"
import {
  EquipmentEntry,
  MaterialEntry,
  PropertyEntry,
} from "./models/EntrySchemas"

import PropertyList from "./components/PropertyList"
//import EquipmentList from "./components/EquipmentList"
//import MaterialList from "./components/MaterialList"

function Login() {
  const { data: session } = useSession()

  const [properties, setProperties] = React.useState<PropertyEntry[]>([])
  const [equipment, setEquipment] = React.useState<EquipmentEntry[]>([])
  const [materials, setMaterials] = React.useState<MaterialEntry[]>([])

  async function fetchPropertyData() {
    try {
      const response = await axios.get("/api/property")
      console.log(response.data) // Log the data to see what you get
      return response.data // Return the data for further use
    } catch (error) {
      console.error("Error fetching unit data:", error)
      throw error // Rethrow the error if needed
    }
  }
  /*
  async function fetchEquipmentData() {
    try {
      const response = await axios.get("/api/equipment")
      console.log(response.data) // Log the data to see what you get
      return response.data // Return the data for further use
    } catch (error) {
      console.error("Error fetching equipment data:", error)
      throw error // Rethrow the error if needed
    }
  }

  async function fetchMaterialData() {
    try {
      const response = await axios.get("/api/materials")
      console.log(response.data) // Log the data to see what you get
      return response.data // Return the data for further use
    } catch (error) {
      console.error("Error fetching material data:", error)
      throw error // Rethrow the error if needed
    }
  }
*/
  React.useEffect(() => {
    async function fetchData() {
      const propertyData = await fetchPropertyData()
      //const equipmentData = await fetchEquipmentData()
      //const materialData = await fetchMaterialData()
      setProperties(propertyData)
      //setEquipment(equipmentData)
      //setMaterials(materialData)
    }

    fetchData()
  }, [])
  // Check if the user is logged in and if their email matches the allowed email
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

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black">
      <div className="container mx-auto p-1">
        <h1 className="text-3xl font-bold text-center m-4">CPM Inventory</h1>
        <PropertyList />
        {/*
                <EquipmentList />
                <MaterialList />
                */}
      </div>
    </div>
  )
}

export default Login
