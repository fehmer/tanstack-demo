import {
  AccessorKeyColumnDef,
  ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { Accessor, createMemo, For, JSXElement } from "solid-js";

export type AnyColumnDef<TData, TValue> =
  | ColumnDef<TData, TValue>
  //  | AccessorFnColumnDef<TData, TValue>
  | AccessorKeyColumnDef<TData, TValue>;

type DataTableProps<TData, TValue> = {
  columns: AnyColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData>(props: DataTableProps<TData, any>) {
  // Ensure reactivity: always produce a fresh array reference
  const data = createMemo(() => props.data.map((r) => ({ ...r })));

  // Columns are usually static, but memo for safety
  const columns = createMemo(() => props.columns);

  // Recreate the table instance whenever data or columns change
  const table = createMemo(() =>
    createSolidTable({
      data: data(),
      columns: columns(),
      getCoreRowModel: getCoreRowModel(),
    }),
  );

  return (
    <>
      <table>
        <thead>
          <For each={table().getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>

        <tbody>
          <For each={table().getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <p>Raw data</p>
      <table>
        <thead>
          <tr>
            <For each={columns()}>
              {(col) => <th>{col.header as string}</th>}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={data()}>
            {(row) => (
              <tr>
                <For each={Object.values(row as any)}>
                  {(cell) => <td>{cell as string}</td>}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
}
