import { NextRequest, NextResponse } from "next/server"
import { connectToMongodbMaterials } from "../../lib/mongodb"
import { MaterialEntry } from "@/app/models/EntrySchemas"

// Handles GET requests to /api
export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Connect to MongoDB
    const { db } = await connectToMongodbMaterials()

    // Fetch data from the toy_locker collection
    const cursor = db.collection<MaterialEntry>("materials").find({})
    const allDocuments: MaterialEntry[] = await cursor.toArray() // Type the array of documents

    // Map over the array of documents to select only the unitNumber and renterName fields
    const selectedFields = allDocuments.map((doc) => ({
      name: doc.name,
      description: doc.description,
      imageUrl: doc.imageUrl,
      deliveryPrice: doc.deliveryPrice,
      pickupPrice: doc.pickupPrice,
      listingWebsites: doc.listingWebsites,
      urlEnd: doc.urlEnd,
    }))

    // Return the selected fields as JSON
    return NextResponse.json(selectedFields)
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error)

    // Return an error response
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    )
  }
}
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

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const corsHeaders = getCorsHeaders(request)
  try {
    const requestBody = await request.json()
    const { _id, ...updateData } = requestBody

    if (!_id) {
      return NextResponse.json(
        { message: "_id is required" },
        { status: 400, headers: corsHeaders }
      ) // Use 400 for bad request
    }

    const { db } = await connectToMongodbMaterials()

    // Manually set default values for fields that should have them
    const updateObject = {
      $set: {
        ...updateData, // Spread updateData to include all fields to be updated
        name: updateData.name || "",
        price: updateData.price || 0,
        description: updateData.description || "",
        imageUrl: updateData.imageUrl || "",
        listingWebsites: updateData.listingWebsites || "",
        urlEnd: updateData.urlEnd || "",
      },
    }

    const result = await db
      .collection<MaterialEntry>("materials")
      .updateOne({ _id }, updateObject, { upsert: true })

    if (result.matchedCount === 0 && result.upsertedCount > 0) {
      return NextResponse.json(
        { message: "New material added" },
        { status: 201 }
      ) // Use 201 for Created
    } else if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Material updated successfully" },
        { status: 200, headers: corsHeaders }
      ) // Use 200 for OK
    } else if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Material updated successfully" },
        { status: 200, headers: corsHeaders }
      )
    } else {
      // If the update didn't change anything, it's unusual but not necessarily an error.
      // You might want to log this situation or handle it differently.
      console.log("Update did not change anything")
      return NextResponse.json({ message: "No changes made" }, { status: 200 }) // Use 200 OK for consistency
    }
  } catch (error: any) {
    console.error("Error handling PUT request:", error)
    return NextResponse.json(
      { message: `Failed to update or create unit: ${error.message}` },
      { status: 500, headers: corsHeaders }
    ) // Use 500 for Internal Server Error
  }
}
