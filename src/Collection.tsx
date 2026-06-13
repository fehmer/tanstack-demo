import { Component, createMemo } from "solid-js";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/solid-db";
import { getColumns, initialData } from "./common";
import { DataTable } from "./DataTable";
import { QueryClient } from "@tanstack/solid-query";

const queryClient = new QueryClient();

export const Collection: Component = () => {
  //collection. All write operations will be reverted after the delay time to test optimistic updates
  const delay = 2000;
  const collection = createCollection(
    queryCollectionOptions({
      syncMode: "on-demand",
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
  window.uc = collection;
  const query = useLiveQuery((q) => q.from({ users: collection }));
  window.uq = query;

  const rename = async (uid: string) => {
    console.log("Update user name");

    const name = prompt("new name");
    if (name === undefined) return;

    const tx = collection.update(uid, (draft) => {
      draft.name = name!;
      draft.lastModified = Date.now();
    });
    await tx.isPersisted.promise;
  };
  const remove = async (uid: string) => {
    const tx = collection.delete(uid);
    await tx.isPersisted.promise;
  };

  const addUser = async () => {
    const newUser = {
      uid: Date.now().toString(),
      name: prompt("new user name") ?? "undefined",
      lastModified: Date.now(),
    };
    const tx = collection.insert(newUser);
    await tx.isPersisted.promise;
  };

  const columns = createMemo(() => getColumns({ rename, remove }));

  return (
    <>
      <h2>Table from collection</h2>
      <button onClick={() => addUser()}>add user</button>
      <DataTable columns={columns()} data={query()} />
    </>
  );
};
