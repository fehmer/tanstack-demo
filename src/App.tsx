import { createColumnHelper } from "@tanstack/solid-table";
import { Component, createSignal } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import { DataTable } from "./DataTable";

import { createCollection } from "@tanstack/db";
import { QueryClient } from "@tanstack/query-core";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { useLiveQuery } from "@tanstack/solid-db";

type User = {
  uid: string;
  name: string;
  lastModified: number;
};

const queryClient = new QueryClient();

const initialData: User[] = [
  { uid: "1", name: "Bob", lastModified: Date.now() },
  { uid: "2", name: "Kevin", lastModified: Date.now() },
  { uid: "3", name: "Stuart", lastModified: Date.now() },
];

export const App: Component = () => {
  const [getName, setName] = createSignal("King Bob");
  // store
  const [usersStore, setUsersStore] = createStore<{
    available: boolean;
    value: User[];
  }>({
    available: true,
    value: structuredClone(initialData),
  });

  //collection. All write operations will be reverted after the delay time to test optimistic updates
  const delay = 2000;
  const usersCollection = createCollection(
    queryCollectionOptions({
      syncMode: "eager",
      startSync: true,
      queryClient,
      queryKey: ["users"],
      getKey: (item) => item.uid,
      queryFn: async () => {
        console.log("remote fetch data");
        return structuredClone(initialData).map((it) => ({
          ...it,
          lastModified: Date.now(),
        }));
      },
      onUpdate: async ({ transaction }) => {
        for (const update of transaction.mutations) {
          console.log("update", update);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log("remote update done");
      },
      onInsert: async ({ transaction }) => {
        for (const insert of transaction.mutations) {
          console.log("insert", insert);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log("remote insert done");
      },
      onDelete: async ({ transaction }) => {
        for (const insert of transaction.mutations) {
          console.log("delete", insert);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log("remote delete done");
      },
    }),
  );

  const usersQuery = useLiveQuery((q) => q.from({ users: usersCollection }));

  const defineColumn = createColumnHelper<User>().accessor;
  const columns = [
    defineColumn("uid", { header: "ID" }),
    defineColumn("name", { header: "Name" }),
    defineColumn("lastModified", {
      header: "last modified",
      cell: ({ getValue }) => new Date(getValue()).toUTCString(),
    }),
  ];

  const updateUserName = async () => {
    console.log("Update user name");
    const items = usersStore.value;

    const name = getName();

    setUsersStore("value", 0, {
      ...items[0],
      ...{ name, lastModified: Date.now() },
    });

    const tx = usersCollection.update(items[0].uid, (draft) => {
      draft.name = name;
      draft.lastModified = Date.now();
    });
    await tx.isPersisted.promise;
  };

  const addUser = async () => {
    const newUser = {
      uid: Date.now().toString(),
      name: getName(),
      lastModified: Date.now(),
    };

    setUsersStore(
      "value",
      produce((items) => {
        items?.push(structuredClone(newUser));
      }),
    );
    const tx = usersCollection.insert(structuredClone(newUser));
    await tx.isPersisted.promise;
  };

  const removeUser = async () => {
    const toBeDeleted = usersStore.value.find(
      (item) => item.name === getName(),
    );
    console.log("delete ", toBeDeleted);
    if (toBeDeleted === undefined) return;

    const uid = toBeDeleted.uid;
    console.log("remove uid", uid);

    setUsersStore(
      reconcile({
        available: true,
        value: usersStore.value.filter((item) => item.uid !== uid),
      }),
    );

    const tx = usersCollection.delete(uid);
    await tx.isPersisted.promise;
  };

  window.uc = usersCollection;
  window.us = usersStore;
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          name="name"
          type="name"
          placeholder="new name"
          required
          value={getName()}
          onInput={(e) => setName(e.target.value)}
        />
        <button onClick={() => updateUserName()}>Update user name</button>{" "}
        <button onClick={() => addUser()}>Add user</button>
        <button onClick={() => removeUser()}>Remove user</button>
      </form>

      <h1>Table from store </h1>
      <DataTable columns={columns} data={usersStore.value} />
      <h1>Table from collection </h1>
      <DataTable columns={columns} query={usersQuery} />
    </>
  );
};
