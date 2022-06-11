import React from "react";
import PropTypes from "prop-types";

function Timeline(props) {
	return (
		<div className="nector-timeline">
			{props.children}
		</div>
	);
}

Timeline.propTypes = {
	children: PropTypes.any
};

function Content(props) {
	return (
		<div className="step">
			<div className="circle" style={{ backgroundColor: props.last ? "transparent" : (props.circleBackgroundColor || "white") }}></div>
			<div style={{ marginLeft: 10, lineHeight: 1 }}>
				{props.children}
			</div>
		</div>
	);
}

Content.propTypes = {
	children: PropTypes.any,
	last: PropTypes.bool,
	circleBackgroundColor: PropTypes.string
};

Timeline.Content = Content;
export default Timeline;