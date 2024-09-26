import { useEffect, useMemo, useState } from "react"
import { useTable, useSortBy, Column } from "react-table"
import { fetchData } from "../lib/fetchData"
import { formatStringAsNumber } from "../lib/helpers"

// Property type definition
interface PropertyEntry {
  _id?: string
  name: string
  address: string
  squareFootage: string
  price: string
  description: string
  imageUrl: string
  isRental: boolean
  listingWebsites: string
  urlEnd: string
  isActive: boolean
}

interface PropertyListProps {
  isActiveFilter: boolean
}

const PropertyList = ({ isActiveFilter }: PropertyListProps) => {
  const [properties, setProperties] = useState<PropertyEntry[]>([])

  useEffect(() => {
    fetchData("/api/property").then((data) => setProperties(data))
  }, [])

  // Filter the properties based on the isActive filter
  const filteredProperties = useMemo(
    () =>
      properties.filter((property) =>
        isActiveFilter ? property.isActive : true
      ),
    [properties, isActiveFilter]
  )

  const columns: Column<PropertyEntry>[] = useMemo(
    () => [
      {
        Header: "Property Name",
        accessor: "name",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Square Footage",
        accessor: "squareFootage",
        Cell: ({ value }: { value: string }) =>
          `${formatStringAsNumber(value)}`,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ row }) => {
          // Access both the price and isRental values
          const price = row.original.price
          const isRental = row.original.isRental
          return `$${formatStringAsNumber(price)}${isRental ? " /ft" : ""}`
        },
      },
      /*
      {
        Header: "Rent/ Sale",
        accessor: "isRental",
        Cell: ({ value }: { value: boolean }) => (value ? "Rent" : "Sale"),
      },
      */
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredProperties }, useSortBy)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <table
        {...getTableProps()}
        className="min-w-full bg-white text-black shadow-md rounded"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="md:px-4 md:py-2  border border-black"
                  key={column.id}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-gray-700 cursor-pointer"
                key={row.id}
                onClick={() => (window.location.href = row.original.urlEnd)}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="md:px-4 md:py-2 border border-black"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default PropertyList
