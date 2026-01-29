import { Component, createMemo, createSignal } from "solid-js";
import { getColumns, initialData, User } from "./common";
import { createStore, produce, reconcile } from "solid-js/store";
import { DataTable } from "./DataTable";

export const Signal: Component = () => {
  const [signal, setSignal] = createSignal<User[]>(
    structuredClone(initialData),
  );
  window.s = signal;

  const rename = async (uid: string) => {
    console.log("Update user name");
    const items = signal();
    const index = items.findIndex((it) => it.uid === uid);

    const name = prompt("new name", items[index].name);
    if (name === undefined) return;

    setSignal((prev) => {
      const newList = [...prev];
      newList[index].name = name!;
      return newList;
    });
  };

  const remove = async (uid: string) => {
    setSignal(signal().filter((item) => item.uid !== uid));
  };

  const addUser = async () => {
    const newUser = {
      uid: Date.now().toString(),
      name: prompt("new user name") ?? "undefined",
      lastModified: Date.now(),
    };

    setSignal([...signal(), newUser]);
  };

  const columns = createMemo(() => getColumns({ rename, remove }));

  return (
    <>
      <h2>Table from signal</h2>
      <p>on rename table is updated, raw is not updated.</p>
      <button onClick={() => addUser()}>add user</button>
      <DataTable columns={columns()} query={signal} />
    </>
  );
};
