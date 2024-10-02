import { Db } from "mongodb"
import {
  EquipmentEntry,
  MaterialsEntry,
  PropertyEntry,
} from "../models/EntrySchemas"

// Helper function to generate a unique urlEnd by adding a suffix if needed
export async function generateUniqueUrlEnd(
  pdb: Db,
  edb: Db,
  mdb: Db,
  baseUrlEnd: string
): Promise<string> {
  let uniqueUrlEnd = baseUrlEnd
  let counter = 1

  // Keep checking if a document with the same urlEnd already exists making sure to check the collections equipment and materials as well as properties
  while (
    (await pdb
      .collection<PropertyEntry>("properties")
      .findOne({ urlEnd: uniqueUrlEnd })) ||
    (await edb
      .collection<EquipmentEntry>("equipment")
      .findOne({ urlEnd: uniqueUrlEnd })) ||
    (await mdb
      .collection<MaterialsEntry>("materials")
      .findOne({ urlEnd: uniqueUrlEnd }))
  ) {
    uniqueUrlEnd = `${baseUrlEnd}-${counter}`
    counter += 1
  }

  return uniqueUrlEnd
}

export function formatStringAsNumber(input: string): string {
  // Try to convert the string to a number
  const numberValue = parseFloat(input)

  // Check if the conversion is valid (not NaN)
  if (!isNaN(numberValue)) {
    // Return the number formatted with commas
    return numberValue.toLocaleString() // Adds commas appropriately
  } else {
    // If it's not a valid number, return the original input
    return input
  }
}
