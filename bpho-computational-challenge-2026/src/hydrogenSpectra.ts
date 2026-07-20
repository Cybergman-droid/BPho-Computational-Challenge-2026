declare const Chart: any;
// import { colours } from "../colours.ts";

type Point = { x: number; y: number };

const ctx = document.getElementById(
	"hydrogenSpectraChart",
) as HTMLCanvasElement | null;
if (!ctx) {
	throw new Error("Canvas element with id 'hydrogenSpectraChart' not found");
}

// TODO add a hydrogen emmision spectra calculator and dataset gentrator

let config = {
	type: "line",
	data: {
		datasets: null, // TODO add hydrogen spectra dataset
	},
	options: {
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: "Bohr model of Hydrogenic atom photon emissions: Z = 1",
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
				title: {
					display: true,
					text: "Wavelength/nm",
				},
			},
			y: {
				type: "linear",
				title: {
					display: true,
					text: "Photon energy/eV",
				},
			},
		},
	},
};

const chart = new Chart(ctx, config);

const materialSelect = document.getElementById(
	"materialSelect",
) as HTMLSelectElement;

materialSelect.appendChild(new Option("All", "All"));

materialSelect.addEventListener("change", () => {
	// TODO add some stuff maybe a balmer or somthing selector
});
