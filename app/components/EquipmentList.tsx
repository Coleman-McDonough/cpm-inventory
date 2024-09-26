import { useEffect, useMemo, useState } from "react"
import { useTable, useSortBy, Column } from "react-table"
import { fetchData } from "../lib/fetchData"
import { formatStringAsNumber } from "../lib/helpers"
import { EquipmentEntry } from "../models/EntrySchemas"

// Correct module augmentation to add sorting props
import { UseSortByColumnOptions, UseSortByColumnProps } from "react-table"

declare module "react-table" {
  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D> {}

  export interface ColumnInterface<D extends object = {}>
    extends UseSortByColumnOptions<D> {}
}

interface EquipmentListProps {
  isActiveFilter: boolean
}

const EquipmentList = ({ isActiveFilter }: EquipmentListProps) => {
  const [equipment, setEquipment] = useState<EquipmentEntry[]>([])

  useEffect(() => {
    fetchData("/api/equipment").then((data) => setEquipment(data))
  }, [])

  // Filter the equipment based on the isActive filter
  const filteredEquipment = useMemo(
    () =>
      equipment.filter((equipmentPiece) =>
        isActiveFilter ? equipmentPiece.isActive : true
      ),
    [equipment, isActiveFilter]
  )

  // Memoized columns to prevent re-creation on each render
  const columns: Column<EquipmentEntry>[] = useMemo(
    () => [
      {
        Header: "Equipment Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }: { value: string }) =>
          value.length > 50 ? `${value.substring(0, 50)}...` : value, // Truncate long descriptions
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }: { value: string }) =>
          `$${formatStringAsNumber(value)}`, // Correctly type Cell for number
      },
      /*
      {
        Header: "Is Active",
        accessor: "isActive",
        Cell: ({ value }: { value: boolean }) => (value ? "Yes" : "No"), // Correctly type Cell for boolean
      },
      {
        Header: "Listing Websites",
        accessor: "listingWebsites", // Render listingWebsites as plain text
      },
      */
    ],
    []
  )

  // Create table instance using useTable and useSortBy hooks
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredEquipment }, useSortBy) // Apply useSortBy

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment</h1>
      <table
        {...getTableProps()}
        className="min-w-full bg-white text-black shadow-md rounded"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())} // Sorting props at the column level
                  className="md:px-4 md:py-2 border border-black"
                  key={column.id}
                >
                  {column.render("Header")}
                  {/* Sorting indicators */}
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
                onClick={() => (window.location.href = row.original.urlEnd)} // Redirect to urlEnd when row is clicked
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

export default EquipmentList
