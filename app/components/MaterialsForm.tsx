import { MaterialsEntry } from "../models/EntrySchemas"

interface MaterialsFormProps {
  formData: MaterialsEntry
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MaterialsForm = ({
  formData,
  handleChange,
  handleCheckboxChange,
}: MaterialsFormProps) => {
  return (
    <>
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
        Image URL:
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
      <div className="flex flex-row">
        <label className="block mb-2 w-full mr-2">
          Delivery Price:
          <input
            type="text"
            name="deliveryPrice"
            value={formData.deliveryPrice}
            onChange={handleChange}
            placeholder="Delivery Price"
            className="p-2 border w-full text-black"
          />
        </label>

        <label className="block mb-2 w-full">
          Pickup Price:
          <input
            type="text"
            name="pickupPrice"
            value={formData.pickupPrice}
            onChange={handleChange}
            placeholder="Pickup Price"
            className="p-2 border w-full text-black"
          />
        </label>
      </div>
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
        Listing Websites:
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

export default MaterialsForm
