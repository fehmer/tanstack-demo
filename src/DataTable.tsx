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
} & (
  | {
      data: TData[];
      query?: never;
    }
  | { data?: never; query: Accessor<TData[]> }
);

export function DataTable<TData>(
  // oxlint-disable-next-line typescript/no-explicit-any
  props: DataTableProps<TData, any>,
): JSXElement {
  const data = createMemo(() =>
    props.query !== undefined ? [...props.query()] : [...props.data],
  );

  const columns = createMemo(() => props.columns);
  const headers = columns().map((it) => it.header as string);

  const table = createSolidTable<TData>({
    get data() {
      return data();
    },
    get columns() {
      return columns();
    },
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
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
          <For each={table.getRowModel().rows}>
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
