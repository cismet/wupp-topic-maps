import Chart from 'chart.js';
import React from 'react';
import ReactChartkick, { PieChart } from 'react-chartkick';

ReactChartkick.addAdapter(Chart);

const ChartComp = ({ filteredObjects, colorizer, groupingFunction, visible = true }) => {
	if (visible) {
		let stats = {};
		let colormodel = {};
		let piechartData = [];
		let piechartColor = [];
		for (let obj of filteredObjects) {
			let group = groupingFunction(obj);
			if (stats[group] === undefined) {
				stats[group] = 1;
				colormodel[group] = colorizer(obj);
			} else {
				stats[group] += 1;
			}
		}

		for (let key in stats) {
			piechartData.push([ key, stats[key] ]);
			piechartColor.push(colormodel[key]);
		}
		return (
			<PieChart
				data={piechartData}
				donut={true}
				title='Verteilung'
				legend={false}
				colors={piechartColor}
			/>
		);
	} else {
		return null;
	}
};

export default ChartComp;
