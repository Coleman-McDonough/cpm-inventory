import { NextRequest, NextResponse } from "next/server"
import {
  connectToMongodbEquipment,
  connectToMongodbMaterials,
  connectToMongodbProperties,
} from "../../lib/mongodb" // Update the MongoDB connection to handle equipment
import { EquipmentEntry } from "@/app/models/EntrySchemas"
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

// GET: Retrieve all equipment entries or a specific one by _id or urlEnd
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("_id")
    const urlEnd = searchParams.get("urlEnd") // Capture the `urlEnd` parameter

    const { db } = await connectToMongodbEquipment() // Connect to equipment collection

    if (id) {
      // Fetch a single equipment item by _id
      const objectId = new ObjectId(id)
      const equipment = await db
        .collection<EquipmentEntry>("equipment")
        .findOne({ _id: objectId })

      if (equipment) {
        return NextResponse.json(equipment)
      } else {
        return NextResponse.json(
          { message: "Equipment not found" },
          { status: 404 }
        )
      }
    } else if (urlEnd) {
      // Fetch a single equipment item by `urlEnd`
      const equipment = await db
        .collection<EquipmentEntry>("equipment")
        .findOne({ urlEnd })

      if (equipment) {
        return NextResponse.json(equipment)
      } else {
        return NextResponse.json(
          { message: "Equipment not found" },
          { status: 404 }
        )
      }
    } else {
      // Fetch all equipment if no specific id or urlEnd is provided
      const equipmentList = await db
        .collection<EquipmentEntry>("equipment")
        .find({})
        .toArray()
      return NextResponse.json(equipmentList)
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

// POST: Create a new equipment entry
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await request.json()
    const {
      name,
      description,
      price,
      listingWebsites,
      urlEnd,
      isActive,
      imageUrl, // Added imageUrl field
    } = requestBody

    const { db } = await connectToMongodbEquipment() // Connect to equipment collection
    const { db: dbMaterials } = await connectToMongodbMaterials()
    const { db: dbProperties } = await connectToMongodbProperties()

    const uniqueUrlEnd = await generateUniqueUrlEnd(
      dbProperties,
      db,
      dbMaterials,
      urlEnd
    )

    // Insert the new equipment
    const newEquipment: EquipmentEntry = {
      name,
      description,
      price,
      listingWebsites,
      urlEnd: uniqueUrlEnd, // Use uniqueUrlEnd instead of urlEnd
      isActive,
      imageUrl, // Handle imageUrl
    }

    const result = await db
      .collection<EquipmentEntry>("equipment")
      .insertOne(newEquipment)

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "Equipment added successfully", _id: result.insertedId },
        { status: 201 }
      )
    } else {
      return NextResponse.json(
        { message: "Failed to add equipment" },
        { status: 500 }
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling POST request:", error.message)
      return NextResponse.json(
        { message: `Failed to create equipment: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}

// PUT: Update an equipment entry by _id
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const requestBody = await request.json()
    const { _id, ...updateData } = requestBody

    if (!_id) {
      return NextResponse.json({ message: "_id is required" }, { status: 400 }) // Use 400 for bad request
    }

    const { db } = await connectToMongodbEquipment() // Connect to equipment collection
    const { db: dbMaterials } = await connectToMongodbMaterials()
    const { db: dbProperties } = await connectToMongodbProperties()

    const objectId = typeof _id === "string" ? new ObjectId(_id) : _id

    const existingProperty = await db
      .collection<EquipmentEntry>("equipment")
      .findOne({ _id: objectId })

    let uniqueUrlEnd = updateData.urlEnd

    if (
      existingProperty &&
      updateData.urlEnd &&
      existingProperty.urlEnd !== updateData.urlEnd
    ) {
      uniqueUrlEnd = await generateUniqueUrlEnd(
        dbProperties,
        db,
        dbMaterials,
        updateData.urlEnd
      )
    }

    // Manually set default values for fields that should have them
    const updateObject = {
      $set: {
        ...updateData, // Spread updateData to include all fields to be updated
        name: updateData.name || "",
        description: updateData.description || "",
        price: updateData.price || 0,
        listingWebsites: updateData.listingWebsites || "",
        urlEnd: uniqueUrlEnd || "",
        isActive: updateData.isActive || false,
        imageUrl: updateData.imageUrl || "", // Handle imageUrl update
      },
    }

    // Update the equipment using _id
    const result = await db
      .collection<EquipmentEntry>("equipment")
      .updateOne({ _id: objectId }, updateObject, { upsert: true })

    if (result.matchedCount === 0 && result.upsertedCount > 0) {
      return NextResponse.json(
        { message: "New equipment added", _id: objectId },
        { status: 201 }
      ) // Use 201 for Created
    } else if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Equipment updated successfully", _id: objectId },
        { status: 200 }
      ) // Use 200 for OK
    } else {
      return NextResponse.json({ message: "No changes made" }, { status: 200 }) // Use 200 OK for consistency
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling PUT request:", error.message)
      return NextResponse.json(
        { message: `Failed to update equipment: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}

// DELETE: Delete an equipment entry by _id
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("_id")

    if (!id) {
      return NextResponse.json({ message: "_id is required" }, { status: 400 }) // Use 400 for bad request
    }

    const { db } = await connectToMongodbEquipment() // Connect to equipment collection

    // Cast _id to ObjectId
    const objectId = new ObjectId(id)

    // Delete the equipment using _id
    const result = await db
      .collection<EquipmentEntry>("equipment")
      .deleteOne({ _id: objectId })

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Equipment deleted successfully" },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: "Equipment not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error handling DELETE request:", error.message)
      return NextResponse.json(
        { message: `Failed to delete equipment: ${error.message}` },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}
