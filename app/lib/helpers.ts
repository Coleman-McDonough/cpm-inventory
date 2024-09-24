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
