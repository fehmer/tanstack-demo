import { Component } from "solid-js";

import { Collection } from "./Collection";
import { Store } from "./Store";
import { Signal } from "./Signal";

export const App: Component = () => {
  return (
    <>
      <Signal />
      <Store />
      <Collection />
    </>
  );
};
