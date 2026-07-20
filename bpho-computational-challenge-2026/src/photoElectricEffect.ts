// import { colours } from "../colours";

import { colours } from "../colours";

declare const Chart: any;
const visibleLines = [
	{ f: 7.5e14, colour: "purple" }, // violet
	{ f: 6.8e14, colour: "blue" },
	{ f: 5.5e14, colour: "green" },
	{ f: 5.0e14, colour: "yellow" },
	{ f: 4.8e14, colour: "orange" },
	{ f: 4.3e14, colour: "red" },
];

// import { colours } from "../colours.ts";

type Point = { x: number; y: number };
type workFunctionData = {
	material: string;
	workFuncEV: number;
	workFuncJ: number;
};

const ctx = document.getElementById(
	"PhotoElectricEffectChart",
) as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error(
		"Canvas element with id 'PhotoElectricEffectChart' not found",
	);
}

const h = 6.62607015e-34;
const eVtoJ = 1.602e-19;
const charge = 1.602e-19;

const workFunctionDataObj: Record<string, workFunctionData> = {
	Ag: { material: "Ag", workFuncEV: 4.3, workFuncJ: 4.3 * eVtoJ },
	Al: { material: "Al", workFuncEV: 4.3, workFuncJ: 4.3 * eVtoJ },
	Au: { material: "Au", workFuncEV: 5.1, workFuncJ: 5.1 * eVtoJ },
	Cu: { material: "Cu", workFuncEV: 4.7, workFuncJ: 4.7 * eVtoJ },
	Sn: { material: "Sn", workFuncEV: 4.4, workFuncJ: 4.4 * eVtoJ },
	Pb: { material: "Pb", workFuncEV: 4.3, workFuncJ: 4.3 * eVtoJ },
	W: { material: "W", workFuncEV: 4.5, workFuncJ: 4.5 * eVtoJ },
	Ni: { material: "Ni", workFuncEV: 4.6, workFuncJ: 4.6 * eVtoJ },
	Na: { material: "Na", workFuncEV: 2.4, workFuncJ: 2.4 * eVtoJ },
};

function photoElectricEffect(workFuncJ: number, freq: number) {
	let photonEnergyPerCharge = (h * freq) / charge;
	let workFuncPercharge = workFuncJ / charge;
	let stoppingVoltage = photonEnergyPerCharge - workFuncPercharge;
	return stoppingVoltage;
}

function photoElectricEffectDatasetGenerator(
	materialObj: workFunctionData,
	colour: string,
) {
	let points: Point[] = [];
	for (let i = 0; i <= 3e15; i += 3e13) {
		let stoppingVoltage = photoElectricEffect(materialObj.workFuncJ, i);
		let newPoint: Point = { x: i, y: stoppingVoltage };
		points.push(newPoint);
	}
	return {
		label: materialObj.material,
		data: points,
		borderColor: colour,
		borderWidth: 2,
		tension: 0,
		pointRadius: 0,
	};
}

let photoElectricEffectDatasets = [];
let i = 0;
for (let value of Object.values(workFunctionDataObj)) {
	photoElectricEffectDatasets.push(
		photoElectricEffectDatasetGenerator(value, colours[i]),
	);
	i++;
}

let config = {
	type: "line",
	data: {
		datasets: photoElectricEffectDatasets,
	},
	options: {
		plugins: {
			title: {
				display: true,
				text: "Photoelectric Effect — Stopping Voltage vs Frequency",
				font: { size: 15 },
			},
		},
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
				// min: 0,
				max: 2.5e15,
				ticks: {
					callback: (value: number) => value / 1e15 + " ×10¹⁵",
				},

				title: {
					display: true,
					text: "Frequency / Hz",
				},
			},
			y: {
				type: "linear",
				min: -5,
				max: 5,
				title: {
					display: true,
					text: "Stopping Voltage / V",
				},
			},
		},
	},
};

const chart = new Chart(ctx, config);

const yMin = chart.scales.y.min;
const yMax = chart.scales.y.max;

for (const v of visibleLines) {
	chart.data.datasets.push({
		label: "",
		// hidden: true,
		showInLegend: false,
		data: [
			{ x: v.f, y: yMin },
			{ x: v.f, y: yMax },
		],
		borderColor: v.colour,
		borderWidth: 2,
		pointRadius: 0,
		borderDash: [4, 4],
	});
}

const materialSelect = document.getElementById(
	"materialSelect",
) as HTMLSelectElement;

materialSelect.appendChild(new Option("All", "All"));

for (const key of Object.keys(workFunctionDataObj)) {
	const option = document.createElement("option");
	option.value = key;
	option.textContent = key; // shows Au, Cu, Ti, etc.
	materialSelect.appendChild(option);
}

materialSelect.addEventListener("change", () => {
	let newDataset = [];
	const selected = materialSelect.value as
		| keyof typeof workFunctionDataObj
		| "All";

	// 1. Build the main dataset(s)
	if (selected === "All") {
		let i = 0;
		for (let value of Object.values(workFunctionDataObj)) {
			newDataset.push(photoElectricEffectDatasetGenerator(value, colours[i]));
			i++;
		}
	} else {
		const index = Object.keys(workFunctionDataObj).indexOf(selected);
		const colour = colours[index];

		newDataset.push(
			photoElectricEffectDatasetGenerator(
				workFunctionDataObj[selected],
				colour,
			),
		);
	}

	// 2. Add visible-light vertical lines (for BOTH modes)
	const yMin = chart.scales.y.min;
	const yMax = chart.scales.y.max;

	for (const v of visibleLines) {
		newDataset.push({
			label: "",
			// hidden: true,
			showInLegend: false,

			data: [
				{ x: v.f, y: yMin },
				{ x: v.f, y: yMax },
			],
			borderColor: v.colour,
			borderWidth: 2,
			pointRadius: 0,
			borderDash: [4, 4],
		});
	}

	// 3. Update chart
	chart.data.datasets = newDataset;
	chart.update();
});

const yaxisToggle = document.getElementById("yAxisToggle") as HTMLInputElement;

yaxisToggle.addEventListener("click", () => {
	if (yaxisToggle.checked) {
		chart.options.scales.y.min = 0;
	} else {
		chart.options.scales.y.min = -5;
	}
	chart.update();
});
