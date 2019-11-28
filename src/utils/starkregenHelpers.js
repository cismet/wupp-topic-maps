export const getRoundedValueStringForValue = (featureValue) => {
	if (featureValue > 1.5) {
		return `> 150 cm`;
	} else {
		return `ca. ${Math.round(featureValue * 10.0) * 10.0} cm`;
	}
};
