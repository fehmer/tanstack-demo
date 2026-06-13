import { Component } from "solid-js";
import { CollectionIssue } from "./CollectionIssue";
import { Collection } from "./Collection";
import { TableIssue } from "./TableIssue";

export const App: Component = () => {
  return (
    <>
      <CollectionIssue />
      <TableIssue />
    </>
  );
};
