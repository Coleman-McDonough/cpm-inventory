import { useEffect, useMemo, useState } from "react"
import { useTable, useSortBy, Column } from "react-table"
import { fetchData } from "../lib/fetchData"
import { MaterialsEntry, TypesAndPrices } from "../models/EntrySchemas"

import { UseSortByColumnOptions, UseSortByColumnProps } from "react-table"
import { isNumeric } from "../lib/helpers"

// Extend react-table for TypeScript support
declare module "react-table" {
  export interface ColumnInstance<D extends object = {}>
    extends UseSortByColumnProps<D> {}
  export interface ColumnInterface<D extends object = {}>
    extends UseSortByColumnOptions<D> {}
}

interface MaterialsListProps {
  isActiveFilter: boolean
}

const MaterialsList = ({ isActiveFilter }: MaterialsListProps) => {
  const [materials, setMaterials] = useState<MaterialsEntry[]>([])

  useEffect(() => {
    fetchData("/api/materials").then((data) => setMaterials(data))
  }, [])

  // Filter materials based on the isActive filter
  const filteredMaterials = useMemo(
    () =>
      materials.filter((material) =>
        isActiveFilter ? material.isActive : true
      ),
    [materials, isActiveFilter]
  )

  // Define columns for the table
  const columns: Column<MaterialsEntry>[] = useMemo(
    () => [
      {
        Header: "Material Name",
        accessor: "name",
      },
      /*
      {
        Header: "Description",
        accessor: "description",
      },
      */
      {
        Header: "Types and Prices",
        accessor: "typesAndPrices",
        Cell: ({ value }: { value: TypesAndPrices[] | undefined }) => {
          if (!value || value.length === 0)
            return <span>No data available</span>
          return (
            <ul>
              {value.map((entry) => (
                <li
                  className="border border-gray-300 rounded-lg p-2 shadow-sm"
                  key={entry.type}
                >
                  <strong>
                    {entry.type}
                    {`${entry.type === "" ? "" : ":"}`}
                  </strong>{" "}
                  Delivery - {`${isNumeric(entry.deliveryPrice) ? "$" : ""}`}
                  {entry.deliveryPrice}, Pickup -{" "}
                  {`${isNumeric(entry.deliveryPrice) ? "$" : ""}`}
                  {entry.pickupPrice}
                </li>
              ))}
            </ul>
          )
        },
      },
      {
        Header: "Active",
        accessor: "isActive",
        Cell: ({ value }: { value: boolean }) => (value ? "Yes" : "No"),
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: filteredMaterials }, useSortBy)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Materials</h1>
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
                  className="md:px-4 md:py-2 border border-black"
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
                className="hover:bg-gray-200 cursor-pointer"
                key={row.id}
                onClick={() =>
                  row.original.urlEnd
                    ? (window.location.href = row.original.urlEnd)
                    : alert("No URL available for this material.")
                }
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

export default MaterialsList
