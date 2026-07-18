// import { colours } from "../colours";

declare const Chart: any;
// import { colours } from "../colours.ts";

type Point = { x: number; y: number };

const ctx = document.getElementById("testChart") as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error("Canvas element with id 'testChart' not found");
}

const h = 6.62607015e-34;
const kB = 1.380649e-23;
const R = 8.314462618; // J/mol/K
const e = Math.E;

let config = {};

const chart = new Chart(ctx, config);

const reloadBtn = document.getElementById(
	"reloadBtn",
) as HTMLButtonElement | null;
if (!reloadBtn) {
	throw new Error("Button element with id 'reloadBtn' not found");
}

reloadBtn.addEventListener("click", () => {
	chart.data.datasets;
	chart.update();
});
