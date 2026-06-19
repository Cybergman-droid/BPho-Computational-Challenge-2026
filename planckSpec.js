import { colours } from "./colours.js";

// Fundamental physical constants (SI units)
const h = 6.62607015e-34; // Planck constant (J·s)
const c = 299792458; // Speed of light in vacuum (m/s)
const kB = 1.380649e-23; // Boltzmann constant (J/K)
const R = 8.314462618; // Molar gas constant (J/mol/K)
const e = Math.E;
const ctx = document.getElementById("planckSpecChart");
let planckSpecDataset = [
	...PlanckSpecDatasetGenerator(4000, "#0077ff"),
	...PlanckSpecDatasetGenerator(5000, "#ff3333"),
	...PlanckSpecDatasetGenerator(6000, "#ffcc00"),
];

const config = {
	type: "line",
	data: {
		datasets: planckSpecDataset,
	},
	options: {
		responsive: true,
		aspectRatio: 1,
		scales: {
			x: {
				type: "linear",
				grid: { color: "rgba(0,0,0,0.2)" },
				ticks: {
					stepSize: 1, // smaller squares
				},
				title: {
					display: true,
					text: "Wavelength/nm",
				},
			},
			y: {
				type: "linear",
				grid: { color: "rgba(0,0,0,0.2)" },
				ticks: {
					callback: (value) => value.toExponential(1), // smaller squares
				},
				title: {
					display: true,
					text: "Irradiance/W/m",
				},
			},
		},
	},
};
const chart = new Chart(ctx, config);

function PlanckSpec(lambda_nm, T) {
	let lambda_m = lambda_nm * 1e-9;
	let numerator = 2 * h * c ** 2 * 1;
	let exponent = (h * c) / (lambda_m * kB * T);
	let denominator = lambda_m ** 5 * (e ** exponent - 1);
	let ans = numerator / denominator;
	return ans;
}

function PlanckSpecDatasetGenerator(T, color) {
	let points = [];

	for (let i = 250; i <= 2500; i += 10) {
		points.push({ x: i, y: PlanckSpec(i, T) });
	}

	return [
		{
			label: `T = ${T}K`,
			data: points,
			borderColor: color,
			borderWidth: 1.5,
			pointRadius: 0,
			tension: 0,
		},
	];
}

console.log(PlanckSpecDatasetGenerator(4000));

// console.log(PlanckSpec(0, 6000));
const reloadBtn = document.getElementById("reloadBtn");
reloadBtn.addEventListener("click", () => {
	planckSpecDataset = [
		...PlanckSpecDatasetGenerator(4000, "#0077ff"),
		...PlanckSpecDatasetGenerator(5000, "#ff3333"),
		...PlanckSpecDatasetGenerator(6000, "#ffcc00"),
	];
	chart.data.datasets = planckSpecDataset;
	chart.update();
});
