import React from 'react';
import { constants as kitasConstants } from '../../redux/modules/kitas';

import ReactChartkick, { PieChart } from 'react-chartkick';
import Chart from 'chart.js';

ReactChartkick.addAdapter(Chart);

const ChartComp = ({ filteredObjects, colorizer, groupingFunction, visible = true }) => {
	if (visible) {
		let stats = {};
		let colormodel = {};
		let piechartData = [];
		let piechartColor = [];
		stats['P+R'] = 0;
		stats['B+R'] = 0;
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
