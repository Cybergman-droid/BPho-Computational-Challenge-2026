import { colours } from "./colours.js";

// Fundamental physical constants (SI units)
const h = 6.62607015e-34; // Planck constant (J·s)
const c = 299792458; // Speed of light in vacuum (m/s)
const kB = 1.380649e-23; // Boltzmann constant (J/K)
const R = 8.314462618; // Molar gas constant (J/mol/K)
const e = Math.E;
const ctx = document.getElementById("testChart");
let dataSets = PlanckSpecDataset(4000);
const config = {
	type: "line",
	data: {
		datasets: dataSets,
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
					stepSize: 1, // smaller squares
				},
				title: {
					display: true,
					text: "Irradiance/W/m",
				},
			},
		},
		borderColor: colours[6],
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

function PlanckSpecDataset(T) {
	let points = [];
	for (let i = 250; i <= 2500; i += 50) {
		let nextPoint = PlanckSpec(i, T);
		let data = { x: i, y: nextPoint };
		let dataPoint = {
			data: data,
			borderColor: colours[6],
			borderWidth: 5,
			showLine: true,
			pointRadius: 0,
			tension: 20,
		};
		points.push(dataPoint);
	}
	return points;
}

console.log(PlanckSpecDataset(4000));

// console.log(PlanckSpec(0, 6000));
const reloadBtn = document.getElementById("reloadBtn");
reloadBtn.addEventListener("click", () => {
	dataSets = PlanckSpecDataset(4000);
	chart.data.datasets = dataSets;
	chart.update();
});
