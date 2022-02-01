import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const options = {
	responsive: true,

	plugins: {
		legend: {
			position: 'top' as const,
		},
		title: {
			display: true,
			text: 'DAI Borrow Rate %',
		},
	},
};

const buildData = (chartData) => {
	return chartData.reverse();
};

const App: FC = () => {
	const [cDaiData, setcDaiData] = useState<number[]>([]);
	const [aaveDAIData, setAaveData] = useState<number[]>([]);
	const [cDaiChart, setcDaiChart] = useState<number[]>([]);
	const [aaveDAIChart, setAaveChart] = useState<number[]>([]);

	const [renderedGraph, setRenderedGraph] = useState();
	const [count, setCount] = useState();

	useEffect(() => {
		window.setInterval(() => {
			setCount(() => new Date().toLocaleTimeString());
			axios.get('http://localhost:3001/api/rates').then((response) => {
				const { cDAI, aaveDAI } = response.data;
				if (cDAI) {
					setcDaiData(cDAI);
				}
				if (aaveDAI) {
					setAaveData(aaveDAI);
				}
			});
		}, 1000);
	}, []);

	useEffect(() => {
		if (!!cDaiData && !!aaveDAIData) {
			if (JSON.stringify(cDaiData) !== JSON.stringify(cDaiChart)) {
				setcDaiChart(cDaiData);
			}

			if (JSON.stringify(aaveDAIData) !== JSON.stringify(aaveDAIChart)) {
				setAaveChart(aaveDAIData);
			}
		}
	}, [cDaiData, aaveDAIData]);

	useEffect(() => {
		const now = Date.now();
		let timeAnchor = now;
		const timeLabelChart = [];

		for (let i = aaveDAIChart.length || 1; i > 0; i--) {
			timeAnchor = timeAnchor - 30 * 1000;
			timeLabelChart.push(new Date(timeAnchor).toLocaleTimeString());
		}
    console.log('cDAI', cDaiChart)
    console.log('aaveDAIChart', aaveDAIChart)
		const updatedGraph = renderGraph(timeLabelChart, cDaiChart, aaveDAIChart);
		setRenderedGraph(updatedGraph);
	}, [aaveDAIChart, cDaiChart]);

	const renderGraph = (chartTimeLabel, cDai, aaaveChart) => {
		return (
			<>
				<Line
					options={options}
					data={{
						labels: chartTimeLabel,
						datasets: [
							{
								label: 'cDAI',
								backgroundColor: 'rgb(255,215,0)',
								borderColor: 'rgb(255,215,0)',
								data: cDai,
							},
							{
								label: 'aaveDAI',
								backgroundColor: 'rgb(47, 123, 194)',
								borderColor: 'rgb(47, 123, 194)',
								data: aaaveChart,
							},
						],
					}}
				></Line>
			</>
		);
	};

	return (
		<div>
			{count}
			{renderedGraph}
		</div>
	);
};

export default App;
