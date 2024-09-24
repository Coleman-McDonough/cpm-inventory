// components/UnitModal.tsx
"use client"
import React, { useEffect, useRef, useState } from "react"
import axios from "axios"

interface UnitFormData {
  unitNumber: string
  renterName: string
  unitStatus: string
  color: string
  isRented: boolean
  needsCleaning: boolean
  isVip: boolean
  dimensions: string
  leaseEndDate: string
  hasSigned: boolean
  hasPaid: boolean
  givenThirtyDays: boolean
  lockCode: string
  isReserved: boolean
  moveInDate: string
  phoneNumber: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  unitNumber: string
  viewOnly: boolean
}

const UnitModal: React.FC<Props> = ({
  isOpen,
  onClose,
  unitNumber,
  viewOnly,
}) => {
  const [formData, setFormData] = useState<UnitFormData>({
    unitNumber: unitNumber, // Ensure this is never undefined or null
    renterName: "Vacant", // Default value
    unitStatus: "", // Default value
    color: "", // Default value
    isRented: false, // Default value
    needsCleaning: false, // Default value
    isVip: false, // Default value
    dimensions: "0x0x0", // Default value
    leaseEndDate: "1/1/75", // Default value
    hasSigned: false, // Default value
    hasPaid: false, // Default value
    givenThirtyDays: false, // Default
    lockCode: "0000", // Default value
    isReserved: false, // Default value
    moveInDate: "----", // Default value
    phoneNumber: "--", // Default value
  })

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const response = await axios.get(`/api/units`)
        const units = response.data
        const unitData = units.find(
          (unit: UnitFormData) => unit.unitNumber === unitNumber
        )

        if (unitData) {
          setFormData(unitData)
        } else {
          console.log(`Unit ${unitNumber} not found. Setting defaults.`)
          // Ensure formData is always controlled by providing default values
          setFormData({
            unitNumber: unitNumber, // Use the passed unitNumber or a default value if necessary
            renterName: "Vacant", // Default value
            unitStatus: "", // Default value
            color: "", // Default value
            isRented: false, // Default value
            needsCleaning: false, // Default value
            isVip: false, // Default value
            dimensions: "0x0x0", // Default value
            leaseEndDate: "1/1/75", // Default value
            hasSigned: false, // Default value
            hasPaid: false, // Default value
            givenThirtyDays: false, // Default value
            lockCode: "0000", // Default value
            isReserved: false, // Default value
            moveInDate: "----", // Default value
            phoneNumber: "--", // Default value
          })
        }
      } catch (error) {
        console.error("Error fetching unit details:", error)
        // Ensure formData is always controlled by providing default values
        setFormData({
          unitNumber: unitNumber, // Use the passed unitNumber or a default value if necessary
          renterName: "Vacant", // Default value
          unitStatus: "", // Default value
          color: "", // Default value
          isRented: false, // Default value
          needsCleaning: false, // Default value
          isVip: false, // Default value
          dimensions: "0x0x0", // Default value
          leaseEndDate: "1/1/75", // Default value
          hasSigned: false, // Default value
          hasPaid: false, // Default value
          givenThirtyDays: false, // Default value
          lockCode: "0000", // Default value
          isReserved: false, // Default value
          moveInDate: "----", // Default value
          phoneNumber: "--", // Default value
        })
      }
    }

    if (isOpen) {
      fetchUnitDetails().then(() => {
        if (formRef.current) {
          formRef.current.focus() // Focus the form
        }
      })
    }
  }, [isOpen, unitNumber])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement

    const { name, value } = target

    setFormData((prevState) => ({
      ...prevState,
      [name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      /*
      await axios.put(`/api/units`, {
        unitNumber: formData.unitNumber,
        renterName: formData.renterName,
        isRented: formData.isRented,
        needsCleaning: formData.needsCleaning,
        isVip: formData.isVip,
        dimensions: formData.dimensions,
        leaseEndDate: formData.leaseEndDate,
        hasSigned: formData.hasSigned,
        hasPaid: formData.hasPaid,
        givenThirtyDays: formData.givenThirtyDays,
        lockCode: formData.lockCode,
        isReserved: formData.isReserved,
        moveInDate: formData.moveInDate,
        phoneNumber: formData.phoneNumber,
      })
        */
      await fetch("api/units", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitNumber: formData.unitNumber,
          renterName: formData.renterName,
          unitStatus: formData.unitStatus,
          color: formData.color,
          isRented: formData.isRented,
          needsCleaning: formData.needsCleaning,
          isVip: formData.isVip,
          dimensions: formData.dimensions,
          leaseEndDate: formData.leaseEndDate,
          hasSigned: formData.hasSigned,
          hasPaid: formData.hasPaid,
          givenThirtyDays: formData.givenThirtyDays,
          lockCode: formData.lockCode,
          isReserved: formData.isReserved,
          moveInDate: formData.moveInDate,
          phoneNumber: formData.phoneNumber,
        }),
      })
      location.reload()
      onClose() // Close the modal after saving
    } catch (error) {
      console.error("Error updating unit:", error)
      alert("Failed to update unit.")
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <form
        ref={formRef}
        className="flex flex-col bg-slate-500 p-4 rounded-lg justify-evenly"
        onSubmit={handleSubmit}
        style={{
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <label className="m-1 lg:m-2">
          Unit Number:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="unitNumber"
            value={formData.unitNumber}
            readOnly
          />
        </label>
        <label className="m-1 lg:m-2">
          Renter Name:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="renterName"
            value={formData.renterName}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Unit Status:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="unitStatus"
            value={formData.unitStatus}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Color:
          <select
            className={`m-1 lg:m-2 text-black ${
              formData.color === "blue"
                ? "bg-blue-500"
                : formData.color === "pink"
                ? "bg-red-200" // Tailwind's light red, which is pinkish
                : formData.color === "gray"
                ? "bg-gray-400"
                : formData.color === "purple"
                ? "bg-purple-500"
                : formData.color === "yellow"
                ? "bg-yellow-300"
                : formData.color === "red"
                ? "bg-red-500" // Tailwind's dark red
                : "bg-green-500"
            }`}
            name="color"
            value={formData.color}
            onChange={handleChange}
          >
            <option className="bg-blue-500" value="blue">
              VIP
            </option>
            <option className="bg-gray-400" value="gray">
              Reserved
            </option>
            <option className="bg-purple-500" value="purple">
              Rented
            </option>
            <option className="bg-yellow-300" value="yellow">
              30 Days Notice
            </option>
            <option className="bg-red-500" value="red">
              Needs Attention
            </option>
            <option className="bg-green-500" value="green">
              Vacant
            </option>
          </select>
        </label>

        <label className="m-1 lg:m-2">
          Phone #:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Dimensions:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Move In Date:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="moveInDate"
            value={formData.moveInDate}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Lease End:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="leaseEndDate"
            value={formData.leaseEndDate}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Lock Code:
          <input
            className="m-1 lg:m-2 text-black"
            type="text"
            name="lockCode"
            value={formData.lockCode}
            onChange={handleChange}
          />
        </label>
        {/* 
        <label className="m-1 lg:m-2">
          Has Signed:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="hasSigned"
            checked={formData.hasSigned}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Has Paid:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="hasPaid"
            checked={formData.hasPaid}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Is Reserved:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="isReserved"
            checked={formData.isReserved}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Given 30 Days:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="givenThirtyDays"
            checked={formData.givenThirtyDays}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Needs Cleaning:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="needsCleaning"
            checked={formData.needsCleaning}
            onChange={handleChange}
          />
        </label>
        <label className="m-1 lg:m-2">
          Is VIP:
          <input
            className="m-1 lg:m-2"
            type="checkbox"
            name="isVip"
            checked={formData.isVip}
            onChange={handleChange}
          />
        </label>
        */}
        <div className={` m-1 lg:m-2 flex self-center`}>
          <button
            className={`${
              viewOnly ? "hidden" : "block"
            } m-1 lg:m-2 px-2 py-1 bg-slate-200 text-black`}
            type="submit"
            tabIndex={-1}
          >
            Save
          </button>
          <button
            className="m-1 lg:m-2 px-2 py-1 bg-slate-200 text-black"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  )
}

export default UnitModal
