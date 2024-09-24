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
  urlEnd: string // Add URL field for property page

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
}

export interface EquipmentEntry {
  _id?: string | ObjectId
  name: string
  description: string
  imageUrl: string
  price: string
  listingWebsites: string
  urlEnd: string // Add URL field for equipment page

  // Define other fields as necessary
}

export interface UpdateEquipmentEntry {
  name?: string
  description?: string
  imageUrl?: string
  price?: string
  listingWebsites?: string
  urlEnd?: string
}

export interface MaterialEntry {
  _id?: string | ObjectId
  name: string
  description: string
  imageUrl: string
  deliveryPrice: string
  pickupPrice: string
  listingWebsites: string
  urlEnd: string // Add URL field for material page

  // Define other fields as necessary
}

export interface UpdateMaterialEntry {
  name?: string
  description?: string
  imageUrl?: string
  deliveryPrice?: string
  pickupPrice?: string
  listingWebsites?: string
  urlEnd?: string
}
