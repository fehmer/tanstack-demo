import { Component } from "solid-js";

import { Collection } from "./Collection";
import { Store } from "./Store";
import { Signal } from "./Signal";

export const TableIssue: Component = () => {
  return (
    <>
      <Signal />
      <Store />
      <Collection />
    </>
  );
};
