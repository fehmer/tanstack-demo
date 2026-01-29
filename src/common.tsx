import { createColumnHelper } from "@tanstack/solid-table";

export type User = {
  uid: string;
  name: string;
  lastModified: number;
};

export const initialData: User[] = [
  { uid: "1", name: "Bob", lastModified: Date.now() },
  { uid: "2", name: "Kevin", lastModified: Date.now() },
  { uid: "3", name: "Stuart", lastModified: Date.now() },
];

const defineColumn = createColumnHelper<User>().accessor;
export const getColumns = (actions: {
  rename: (uid: string) => void;
  remove: (uid: string) => void;
}) => [
  defineColumn("uid", { header: "ID" }),
  defineColumn("name", { header: "Name" }),
  defineColumn("lastModified", {
    header: "last modified",
    cell: ({ getValue }) => new Date(getValue()).toUTCString(),
  }),
  defineColumn("uid", {
    header: "",
    cell: ({ getValue }) => (
      <>
        <button onClick={() => actions.remove(getValue())}>remove</button>
        <button onClick={() => actions.rename(getValue())}>rename</button>
      </>
    ),
  }),
];
