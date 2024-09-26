import { EquipmentEntry } from "../models/EntrySchemas"

interface EquipmentFormProps {
  formData: EquipmentEntry
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EquipmentForm = ({
  formData,
  handleChange,
  handleCheckboxChange,
}: EquipmentFormProps) => {
  return (
    <>
      {/* Input Fields */}
      <label className="block mb-2 w-full">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-2 border w-full text-black"
        />
      </label>
      <label className="block mb-2 w-full">
        Image:
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          className="p-2 border w-full text-black"
        />
      </label>

      <label className="block mb-2 w-full">
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border w-full text-black"
        />
      </label>

      <label className="block mb-2 w-full">
        Price:
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border w-full text-black"
        />
      </label>

      <label className="block mb-2 w-full">
        Is Active:
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className="ml-2"
        />
      </label>

      <label className="block mb-2 w-full">
        Listing Websites (comma-separated):
        <input
          type="text"
          name="listingWebsites"
          value={formData.listingWebsites}
          onChange={handleChange}
          placeholder="Listing Websites"
          className="p-2 border w-full text-black"
        />
      </label>

      <label className="block mb-2 w-full">
        URL End:
        <input
          type="text"
          name="urlEnd"
          value={formData.urlEnd}
          onChange={handleChange}
          placeholder="URL End"
          className="p-2 border w-full text-black"
        />
      </label>
    </>
  )
}

export default EquipmentForm
