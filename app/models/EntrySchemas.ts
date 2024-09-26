// models/ToyLockerUnit.ts

import { ObjectId } from "mongodb"

export interface PropertyEntry {
  _id?: string | ObjectId
  name: string
  address: string
  squareFootage: string
  price: string
  description: string
  imageUrl: string
  isRental: boolean
  listingWebsites: string
  urlEnd: string
  isActive: boolean

  // Define other fields as necessary
}

export interface UpdatePropertyEntry {
  name?: string
  address?: string
  squareFootage?: string
  price?: string
  description?: string
  imageUrl?: string
  isRental?: boolean
  listingWebsites?: string
  urlEnd?: string
  isActive?: boolean
}

export interface EquipmentEntry {
  _id?: string | ObjectId
  name: string
  description: string
  imageUrl: string
  price: string
  listingWebsites: string
  urlEnd: string // Add URL field for equipment page
  isActive: boolean

  // Define other fields as necessary
}

export interface UpdateEquipmentEntry {
  name?: string
  description?: string
  imageUrl?: string
  price?: string
  listingWebsites?: string
  urlEnd?: string
  isActive?: boolean
}

export interface MaterialsEntry {
  _id?: string | ObjectId
  name: string
  description: string
  imageUrl: string
  deliveryPrice: string
  pickupPrice: string
  listingWebsites: string
  urlEnd: string // Add URL field for material page
  isActive: boolean

  // Define other fields as necessary
}

export interface UpdateMaterialsEntry {
  name?: string
  description?: string
  imageUrl?: string
  deliveryPrice?: string
  pickupPrice?: string
  listingWebsites?: string
  urlEnd?: string
  isActive?: boolean
}
