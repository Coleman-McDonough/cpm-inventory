// components/PropertyForm.tsx
import { PropertyEntry } from "../models/EntrySchemas"

interface PropertyFormProps {
  formData: PropertyEntry
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleArrayChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PropertyForm = ({
  formData,
  handleChange,
  handleCheckboxChange,
  handleArrayChange,
}: PropertyFormProps) => {
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
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border w-full text-black"
        />
      </label>
      <label className="block mb-2 w-full">
        Square Footage:
        <input
          type="text"
          name="squareFootage"
          value={formData.squareFootage}
          onChange={handleChange}
          placeholder="Square Footage"
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
        Is Rental:
        <input
          type="checkbox"
          name="isRental"
          checked={formData.isRental}
          onChange={handleCheckboxChange}
          className="ml-2"
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

export default PropertyForm
