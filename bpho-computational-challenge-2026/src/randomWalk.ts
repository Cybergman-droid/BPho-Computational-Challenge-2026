declare const Chart: any;
import { colours } from "../colours.ts";
type Point = { x: number; y: number };

type Dataset = {
	label: string;
	data: Point[];
	borderColor: string;
	borderWidth: number;
	showLine: boolean;
	pointRadius: number;
};

const ctx = document.getElementById(
	"randomWalkChart",
) as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error("Canvas element with id 'randomWalkChart' not found");
}

let dataSets: Dataset[] = randomWalkGenerator(50);

const config: any = {
	type: "scatter",
	data: {
		datasets: dataSets,
	},
	options: {
		responsive: true,
		aspectRatio: 1,
		scales: {
			x: {
				type: "linear",
				min: -20,
				max: 20,
				grid: { color: "rgba(0,0,0,0.2)" },
				ticks: {
					stepSize: 1,
				},
				title: {
					display: true,
					text: "x",
				},
			},
			y: {
				type: "linear",
				min: -20,
				max: 20,
				grid: { color: "rgba(0,0,0,0.2)" },
				ticks: {
					stepSize: 1,
				},
				title: {
					display: true,
					text: "y",
				},
			},
		},
	},
};

const chart = new Chart(ctx, config);

function randomWalk(N: number, stepSize: number): Point[] {
	const points: Point[] = [{ x: 0, y: 0 }];
	for (let i = 1; i <= N; i++) {
		const angleRad = Math.random() * (2 * Math.PI);
		const xcoordRad = Math.cos(angleRad) * stepSize;
		const ycoordRad = Math.sin(angleRad) * stepSize;
		const x = points[i - 1].x + xcoordRad;
		const y = points[i - 1].y + ycoordRad;

		points.push({ x, y });
	}
	return points;
}

function randomWalkGenerator(numOfWalks: number): Dataset[] {
	const datasets: Dataset[] = [];
	for (let i = 1; i <= numOfWalks; i++) {
		const walk = randomWalk(50, 1);
		datasets.push({
			label: `walk${i}`,
			data: walk,
			borderColor: colours[i % colours.length],
			borderWidth: 0.5,
			showLine: true,
			pointRadius: 0,
		});
	}
	return datasets;
}

const submitBtn = document.getElementById(
	"reloadBtn",
) as HTMLButtonElement | null;
if (!submitBtn) {
	throw new Error("Button element with id 'reloadBtn' not found");
}

submitBtn.addEventListener("click", () => {
	dataSets = randomWalkGenerator(50);
	chart.data.datasets = dataSets;
	chart.update();
});
