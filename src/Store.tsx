import { Component, createMemo } from "solid-js";
import { getColumns, initialData, User } from "./common";
import { createStore, produce, reconcile } from "solid-js/store";
import { DataTable } from "./DataTable";

export const Store: Component = () => {
  // store
  const [store, setStore] = createStore<{
    available: boolean;
    value: User[];
  }>({
    available: true,
    value: structuredClone(initialData),
  });
  window.us = store;

  const rename = async (uid: string) => {
    console.log("Update user name");
    const items = store.value;
    const index = items.findIndex((it) => it.uid === uid);

    const name = prompt("new name", items[index].name);
    if (name === undefined) return;

    setStore("value", index, {
      ...items[index],
      ...{ name: name!, lastModified: Date.now() },
    });
  };

  const remove = async (uid: string) => {
    setStore(
      reconcile({
        available: true,
        value: store.value.filter((item) => item.uid !== uid),
      }),
    );
  };

  const addUser = async () => {
    const newUser = {
      uid: Date.now().toString(),
      name: prompt("new user name") ?? "undefined",
      lastModified: Date.now(),
    };

    setStore(
      "value",
      produce((items) => {
        items?.push(newUser);
      }),
    );
  };

  const columns = createMemo(() => getColumns({ rename, remove }));

  return (
    <>
      <h2>Table from store</h2>
      <p>on rename table is not updated, raw is updated.</p>
      <button onClick={() => addUser()}>add user</button>
      <DataTable columns={columns()} data={store.value} />
    </>
  );
};
