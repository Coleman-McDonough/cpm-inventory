import { NextRequest, NextResponse } from "next/server"
import { connectToMongodbMaterials } from "../../lib/mongodb"
import { MaterialsEntry } from "@/app/models/EntrySchemas"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("_id")
  const urlEnd = searchParams.get("urlEnd")

  const { db } = await connectToMongodbMaterials()

  if (id) {
    const material = await db
      .collection<MaterialsEntry>("materials")
      .findOne({ _id: new ObjectId(id) })
    return material
      ? NextResponse.json(material)
      : NextResponse.json({ message: "Material not found" }, { status: 404 })
  } else if (urlEnd) {
    const material = await db
      .collection<MaterialsEntry>("materials")
      .findOne({ urlEnd })
    return material
      ? NextResponse.json(material)
      : NextResponse.json({ message: "Material not found" }, { status: 404 })
  } else {
    const materials = await db
      .collection<MaterialsEntry>("materials")
      .find({})
      .toArray()
    return NextResponse.json(materials)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const {
    name,
    imageUrl,
    description,
    deliveryPrice,
    pickupPrice,
    isActive,
    listingWebsites,
    urlEnd,
  } = await request.json()
  const { db } = await connectToMongodbMaterials()

  const newMaterial: MaterialsEntry = {
    name,
    imageUrl,
    description,
    deliveryPrice,
    pickupPrice,
    isActive,
    listingWebsites,
    urlEnd,
  }
  const result = await db
    .collection<MaterialsEntry>("materials")
    .insertOne(newMaterial)

  return result.acknowledged
    ? NextResponse.json({ message: "Material added", _id: result.insertedId })
    : NextResponse.json({ message: "Failed to add material" }, { status: 500 })
}
