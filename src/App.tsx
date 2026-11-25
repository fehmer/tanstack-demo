import { Component } from "solid-js";
import ChartLabelIssue from "./ChartLabelIssue";

export const App: Component = () => {
  return (
    <>
      <h1>Chart with thin x-axis</h1>
      <ChartLabelIssue thin={true} />
      <h1>Chart without thin x-axis</h1>
      <ChartLabelIssue thin={false} />
    </>
  );
};
