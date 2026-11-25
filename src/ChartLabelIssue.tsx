import { Chart } from "@tanstack/charts/solid";
import { barY, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { Component } from "solid-js";

const rows = [
  { label: "0 - 9", value: 219, category: 0 },
  { label: "10 - 19", value: 2190, category: 10 },
  { label: "20 - 29", value: 9948, category: 20 },
  { label: "30 - 39", value: 27242, category: 30 },
  { label: "40 - 49", value: 47912, category: 40 },
  { label: "50 - 59", value: 65968, category: 50 },
  { label: "60 - 69", value: 75969, category: 60 },
  { label: "70 - 79", value: 75075, category: 70 },
  { label: "80 - 89", value: 65283, category: 80 },
  { label: "90 - 99", value: 53004, category: 90 },
  { label: "100 - 109", value: 42518, category: 100 },
  { label: "110 - 119", value: 27711, category: 110 },
  { label: "120 - 129", value: 18387, category: 120 },
  { label: "130 - 139", value: 11069, category: 130 },
  { label: "140 - 149", value: 6442, category: 140 },
  { label: "150 - 159", value: 3570, category: 150 },
  { label: "160 - 169", value: 1935, category: 160 },
  { label: "170 - 179", value: 916, category: 170 },
  { label: "180 - 189", value: 429, category: 180 },
  { label: "190 - 199", value: 205, category: 190 },
  { label: "200 - 209", value: 142, category: 200 },
  { label: "210 - 219", value: 42, category: 210 },
  { label: "220 - 229", value: 33, category: 220 },
  { label: "230 - 239", value: 19, category: 230 },
  { label: "240 - 249", value: 9, category: 240 },
  { label: "250 - 259", value: 3, category: 250 },
  { label: "260 - 269", value: 6, category: 260 },
  { label: "280 - 289", value: 3, category: 280 },
];

const ranked = [...rows].sort((a, b) => a.category - b.category);

const ChartLabelIssue: Component<{ thin?: boolean }> = (props) => {
  const chart = defineChart({
    marks: [barY(ranked, { x: "label", y: "value", inset: 2 })],
    scales: {
      x: {
        scale: () => scaleBand<string>().padding(0.16),
        axis: {
          tickLabels: { thin: props.thin, rotate: 360 - 45, anchor: "end" },
        },
      },
      y: { scale: scaleLinear },
    },
  });

  return (
    <Chart
      definition={chart}
      ariaLabel="Data distribution by category"
      style={{ width: "600px", height: "200px" }}
    />
  );
};

export default ChartLabelIssue;
