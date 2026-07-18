import { colours } from "../colours";

declare const Chart: any;
// import { colours } from "../colours.ts";

type Point = { x: number; y: number };

const ctx = document.getElementById(
	"einsteinHeatCapacityChart",
) as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error("Canvas element with id 'testChart' not found");
}

const materials = {
	Au: { debyeTemp: 170, einsteinFreq: 0.2855e13 },
	Cu: { debyeTemp: 343.5, einsteinFreq: 0.5769e13 },
	Ti: { debyeTemp: 420, einsteinFreq: 0.7054e13 },
	Al: { debyeTemp: 428, einsteinFreq: 0.7188e13 },
	Fe: { debyeTemp: 470, einsteinFreq: 0.7893e13 },
	Si: { debyeTemp: 645, einsteinFreq: 1.0832e13 },
	C: { debyeTemp: 2230, einsteinFreq: 3.7451e13 },
};

function EinsteinHeatCapacity(T: number, einsteinFreq: number) {
	const h = 6.62607015e-34;
	const kB = 1.380649e-23;
	const R = 8.314462618; // J/mol/K
	const e = Math.E;

	let x = (h * einsteinFreq) / (kB * T);
	let expx = e ** x;
	let mult = 3 * R;
	let numerator = x ** 2 * expx;
	let denominator = (expx - 1) ** 2;
	return mult * (numerator / denominator);
}

function EinsteinHeatCapacityDatasetGenerator(
	elementName: string,
	einsteinFreq: number,
	colour: string,
) {
	let points: Point[] = [];
	for (let T = 1; T <= 1000; T += 5) {
		let C = EinsteinHeatCapacity(T, einsteinFreq);
		let newPoint: Point = { x: T, y: C };
		points.push(newPoint);
	}

	return [
		{
			label: elementName,
			data: points,
			borderColor: colour,
			borderWidth: 2,
			tension: 0,
			pointRadius: 0,
		},
	];
}

let einsteinDatasets = [];
let i = 0;
for (let [key, value] of Object.entries(materials)) {
	einsteinDatasets.push(
		...EinsteinHeatCapacityDatasetGenerator(
			key,
			value.einsteinFreq,
			colours[i],
		),
	);
	i++;
}

let config = {
	type: "line",
	data: {
		datasets: einsteinDatasets,
	},
	options: {
		responsive: true,
		interaction: {
			mode: "nearest",
			intersect: false,
		},
		animation: {
			duration: 2000,
			easing: "easeOutQuart",
		},
		scales: {
			x: {
				type: "linear",
				title: {
					display: true,
					text: "Temperature / K",
				},
			},
			y: {
				type: "linear",
				title: {
					display: true,
					text: "Heat Capacity / J·mol⁻¹·K⁻¹",
				},
			},
		},
	},
};

const chart = new Chart(ctx, config);

const reloadBtn = document.getElementById(
	"reloadBtn",
) as HTMLButtonElement | null;
if (!reloadBtn) {
	throw new Error("Button element with id 'reloadBtn' not found");
}

reloadBtn.addEventListener("click", () => {
	chart.data.datasets = einsteinDatasets;
	chart.update();
});
