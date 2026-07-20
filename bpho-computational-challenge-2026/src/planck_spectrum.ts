declare const Chart: any;
// import { colours } from "../colours.ts";

type Point = { x: number; y: number };

const ctx = document.getElementById(
	"planckSpecChart",
) as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error("Canvas element with id 'planckSpecChart' not found");
}

const planckSpecDataset = [
	...PlanckSpecDatasetGenerator(4000, "#0077ff"),
	...PlanckSpecDatasetGenerator(5000, "#ff3333"),
	...PlanckSpecDatasetGenerator(6000, "#ffcc00"),
];

const config: any = {
	type: "line",
	data: {
		datasets: planckSpecDataset,
	},
	options: {
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: "Planck Spectrum",
				font: { size: 15 },
			},
		},
		responsive: true,
		aspectRatio: 1,
		scales: {
			x: {
				type: "linear",
				grid: { color: "rgba(0,0,0,0.2)" },
				ticks: {
					stepSize: 1,
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
					callback: (value: number) => value.toExponential(1),
					// callback: (value: number) => value / 1e13 + " ×10¹3",
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

function PlanckSpec(lambda_nm: number, T: number): number {
	const lambda_m = lambda_nm * 1e-9;
	const numerator = 2 * 6.62607015e-34 * 299792458 ** 2;
	const exponent = (6.62607015e-34 * 299792458) / (lambda_m * 1.380649e-23 * T);
	const denominator = lambda_m ** 5 * (Math.E ** exponent - 1);
	return numerator / denominator;
}

function PlanckSpecDatasetGenerator(T: number, color: string): any[] {
	const points: Point[] = [];
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

const reloadBtn = document.getElementById(
	"reloadBtn",
) as HTMLButtonElement | null;
if (!reloadBtn) {
	throw new Error("Button element with id 'reloadBtn' not found");
}

reloadBtn.addEventListener("click", () => {
	const newDataset = [
		...PlanckSpecDatasetGenerator(4000, "#0077ff"),
		...PlanckSpecDatasetGenerator(5000, "#ff3333"),
		...PlanckSpecDatasetGenerator(6000, "#ffcc00"),
	];

	chart.data.datasets = newDataset;
	chart.update();
});
