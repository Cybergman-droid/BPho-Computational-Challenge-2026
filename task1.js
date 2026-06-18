import { colours } from "./colours.js";
const ctx = document.getElementById("randomWalkChart");
let dataSets = randomWalkGenerator(50);
const config = {
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
					stepSize: 1, // smaller squares
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
					stepSize: 1, // smaller squares
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

function randomWalk(N, stepSize) {
	let points = [{ x: 0, y: 0 }];
	for (let i = 1; i <= N; i++) {
		let angleRad = Math.random() * (2 * Math.PI);
		let xcoordRad = Math.cos(angleRad) * stepSize;
		let ycoordRad = Math.sin(angleRad) * stepSize;
		console.log(angleRad);
		console.log(xcoordRad);
		console.log(ycoordRad);
		let x = points[i - 1].x + xcoordRad;
		let y = points[i - 1].y + ycoordRad;

		points.push({ x, y });
	}
	console.log(points);
	return points;
}

function randomWalkGenerator(numOfWalks) {
	let datasets = [];
	for (let i = 0; i <= numOfWalks; i++) {
		let walk = randomWalk(50, 1);
		let dataSet = {
			label: `walk${i}`,
			data: walk,
			borderColor: colours[i % colours.length],
			borderWidth: 0.5,
			showLine: true,
			pointRadius: 0,
		};
		datasets.push(dataSet);
	}
	return datasets;
}

const submitBtn = document.getElementById("reloadBtn");
submitBtn.addEventListener("click", () => {
	dataSets = randomWalkGenerator(50);
	chart.data.datasets = dataSets;
	chart.update();
});
