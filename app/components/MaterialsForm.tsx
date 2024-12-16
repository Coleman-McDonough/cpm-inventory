import { TypesAndPrices, MaterialsEntry } from "../models/EntrySchemas"

interface MaterialsFormProps {
  formData: MaterialsEntry
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleTypesAndPricesChange: (
    index: number,
    field: keyof TypesAndPrices,
    value: string
  ) => void
  addTypeAndPrice: () => void
  removeTypeAndPrice: (index: number) => void
}

const MaterialsForm = ({
  formData,
  handleChange,
  handleCheckboxChange,
  handleTypesAndPricesChange,
  addTypeAndPrice,
  removeTypeAndPrice,
}: MaterialsFormProps) => {
  return (
    <form className="p-4 bg-white rounded shadow-md">
      {/* Name */}
      <label className="block mb-4">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          className="p-2 border w-full text-black"
        />
      </label>

      {/* Description */}
      <label className="block mb-4">
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          className="p-2 border w-full text-black"
        />
      </label>

      {/* Image URL */}
      <label className="block mb-4">
        Image URL:
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
          className="p-2 border w-full text-black"
        />
      </label>

      {/* Types and Prices */}
      <div className="block mb-4">
        <h4 className="mb-2 font-bold">Types and Prices:</h4>
        {(formData.typesAndPrices || []).map((entry, index) => (
          <div key={index} className="flex space-x-2 mb-2 items-center">
            <input
              type="text"
              value={entry.type}
              onChange={(e) =>
                handleTypesAndPricesChange(index, "type", e.target.value)
              }
              placeholder="Type"
              className="p-2 border w-1/4 text-black"
            />
            <input
              type="text"
              value={entry.deliveryPrice}
              onChange={(e) =>
                handleTypesAndPricesChange(
                  index,
                  "deliveryPrice",
                  e.target.value
                )
              }
              placeholder="Delivery Price"
              className="p-2 border w-1/4 text-black"
            />
            <input
              type="text"
              value={entry.pickupPrice}
              onChange={(e) =>
                handleTypesAndPricesChange(index, "pickupPrice", e.target.value)
              }
              placeholder="Pickup Price"
              className="p-2 border w-1/4 text-black"
            />
            <button
              type="button"
              onClick={() => removeTypeAndPrice(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTypeAndPrice}
          className="p-2 border bg-blue-500 text-white rounded"
        >
          Add Type
        </button>
      </div>

      {/* Listing Websites */}
      <label className="block mb-4">
        Listing Websites:
        <input
          type="text"
          name="listingWebsites"
          value={formData.listingWebsites}
          onChange={handleChange}
          placeholder="Enter listing websites"
          className="p-2 border w-full text-black"
        />
      </label>

      {/* URL End */}
      <label className="block mb-4">
        URL End:
        <input
          type="text"
          name="urlEnd"
          value={formData.urlEnd}
          onChange={handleChange}
          placeholder="Enter URL end"
          className="p-2 border w-full text-black"
        />
      </label>

      {/* Is Active */}
      <label className="block mb-4">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        Is Active
      </label>
    </form>
  )
}

export default MaterialsForm
