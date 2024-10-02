import { NextRequest, NextResponse } from "next/server"
import {
  connectToMongodbEquipment,
  connectToMongodbMaterials,
  connectToMongodbProperties,
} from "../../lib/mongodb"
import { PropertyEntry } from "@/app/models/EntrySchemas"
import { ObjectId } from "mongodb"
import { generateUniqueUrlEnd } from "@/app/lib/helpers"

// Define allowed origins
const allowedOrigins = ["http://localhost:3000"]

// Function to get CORS headers based on request origin
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin")
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  if (allowedOrigins.includes(origin || "")) {
    corsHeaders["Access-Control-Allow-Origin"] = origin || ""
  }

  return corsHeaders
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const corsHeaders = getCorsHeaders(request)
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// GET: Retrieve all property entries or a specific one by _id or urlEnd
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("_id")
    const urlEnd = searchParams.get("urlEnd") // Capture the `urlEnd` parameter

    const { db } = await connectToMongodbProperties()

    if (id) {
      // Fetch a single property by _id
      const objectId = new ObjectId(id)
      const property = await db
        .collection<PropertyEntry>("properties")
        .findOne({ _id: objectId })

      if (property) {
        return NextResponse.json(property)
      } else {
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        )
      }
    } else if (urlEnd) {
      // Fetch a single property by `urlEnd`
      const property = await db
        .collection<PropertyEntry>("properties")
        .findOne({ urlEnd })

      if (property) {
        return NextResponse.json(property)
      } else {
        return NextResponse.json(
          { message: "Property not found" },
          { status: 404 }
        )
      }
    } else {
      // Fetch all properties if no specific id or urlEnd is provided
      const properties = await db
        .collection<PropertyEntry>("properties")
        .find({})
        .toArray()
      return NextResponse.json(properties)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching data from MongoDB:", error.message)
      return NextResponse.json(
        { message: `Failed to fetch data: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}

// POST: Create a new property
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await request.json()
    const {
      name,
      address,
      squareFootage,
      price,
      description,
      imageUrl,
      isRental,
      listingWebsites,
      urlEnd,
      isActive,
    } = requestBody

    const { db: db } = await connectToMongodbProperties()
    const { db: dbEquipment } = await connectToMongodbEquipment()
    const { db: dbMaterials } = await connectToMongodbMaterials()

    const uniqueUrlEnd = await generateUniqueUrlEnd(
      db,
      dbEquipment,
      dbMaterials,
      urlEnd
    )

    // Insert the new property
    const newProperty: PropertyEntry = {
      name,
      address,
      squareFootage,
      price,
      description,
      imageUrl,
      isRental,
      listingWebsites,
      urlEnd: uniqueUrlEnd,
      isActive,
    }

    const result = await db
      .collection<PropertyEntry>("properties")
      .insertOne(newProperty)

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Property added successfully", _id: result.insertedId },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { message: "Failed to add property" },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling POST request:", error.message)
      return NextResponse.json(
        { message: `Failed to create property: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}

// PUT: Update a property by _id
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await request.json()
    const { _id, ...updateData } = requestBody

    if (!_id) {
      return NextResponse.json({ message: "_id is required" }, { status: 400 }) // Use 400 for bad request
    }

    const { db } = await connectToMongodbProperties()
    const { db: dbEquipment } = await connectToMongodbEquipment()
    const { db: dbMaterials } = await connectToMongodbMaterials()

    // If _id is a string, cast it to ObjectId
    const objectId = typeof _id === "string" ? new ObjectId(_id) : _id

    const existingProperty = await db
      .collection<PropertyEntry>("properties")
      .findOne({ _id: objectId })

    let uniqueUrlEnd = updateData.urlEnd

    // If the urlEnd is different from the existing one, ensure uniqueness
    if (
      existingProperty &&
      updateData.urlEnd &&
      updateData.urlEnd !== existingProperty.urlEnd
    ) {
      // Generate a unique urlEnd
      uniqueUrlEnd = await generateUniqueUrlEnd(
        db,
        dbEquipment,
        dbMaterials,
        updateData.urlEnd
      )
    }

    // Manually set default values for fields that should have them
    const updateObject = {
      $set: {
        ...updateData, // Spread updateData to include all fields to be updated
        name: updateData.name || "",
        address: updateData.address || "",
        squareFootage: updateData.squareFootage || 0,
        price: updateData.price || 0,
        description: updateData.description || "",
        imageUrl: updateData.imageUrl || "",
        isRental: updateData.isRental || false,
        listingWebsites: updateData.listingWebsites || "",
        urlEnd: uniqueUrlEnd || "",
        isActive: updateData.isActive || false,
      },
    }

    // Update the property using _id
    const result = await db
      .collection<PropertyEntry>("properties")
      .updateOne({ _id: objectId }, updateObject, { upsert: true })

    if (result.matchedCount === 0 && result.upsertedCount > 0) {
      return NextResponse.json(
        { message: "New property added", _id: objectId },
        { status: 201 }
      ) // Use 201 for Created
    } else if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Property updated successfully", _id: objectId },
        { status: 200 }
      ) // Use 200 for OK
    } else {
      return NextResponse.json({ message: "No changes made" }, { status: 200 }) // Use 200 OK for consistency
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling PUT request:", error.message)
      return NextResponse.json(
        { message: `Failed to update property: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}

// DELETE: Delete a property by _id
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("_id")

    if (!id) {
      return NextResponse.json({ message: "_id is required" }, { status: 400 }) // Use 400 for bad request
    }

    const { db } = await connectToMongodbProperties()

    // Cast _id to ObjectId
    const objectId = new ObjectId(id)

    // Delete the property using _id
    const result = await db
      .collection<PropertyEntry>("properties")
      .deleteOne({ _id: objectId })

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Property deleted successfully" },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling DELETE request:", error.message)
      return NextResponse.json(
        { message: `Failed to delete property: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}
