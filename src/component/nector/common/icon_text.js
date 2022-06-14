import React from "react";
import PropTypes from "prop-types";

function IconText(props) {
	return (
		<div style={{ display: "flex", borderRadius: "50px", backgroundColor: "white", overflow: "hidden", cursor: "pointer" }} onClick={props.onClick} title={props.title || undefined}>
			<div style={{ borderRadius: "50px", backgroundColor: "rgb(235, 235, 235)", padding: "5px 8px", display: "flex", justifyContent: "center", alignItems: "center", ...(props.iconContainerStyles || {}) }}>{props.icon}</div>
			<p style={{ backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: props.fontSize || "75%", marginBottom: 0, padding: "5px 10px 5px 6px", ...(props.textStyles || {}) }}>{props.text}</p>
		</div>
	);
}

IconText.propTypes = {
	icon: PropTypes.element.isRequired,
	text: PropTypes.any.isRequired,
	fontSize: PropTypes.number,
	iconContainerStyles: PropTypes.any,
	textStyles: PropTypes.any,
	onClick: PropTypes.func,
	title: PropTypes.string
};

export default IconText;