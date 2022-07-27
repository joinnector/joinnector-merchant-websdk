import PropTypes from "prop-types";
import React from "react";
import * as react_material_icons from "react-icons/md";
import { useHistory } from "react-router-dom";
import collection_helper from "../../../helper/collection_helper";

const BackButton = ({ iconStyles = {}, onClickAction = null }) => {
	const history = useHistory();
	const onClick = () => typeof onClickAction === "function" ? onClickAction() : collection_helper.check_and_go_back(history);
	return (
		<div style={{ display: "flex", marginBottom: 10 }}>
			<h1
				className="nector-cursor-pointer"
				style={{ paddingRight: "24px" }}
				onClick={onClick}
			>
				<react_material_icons.MdKeyboardBackspace
					className="nector-icon"
					style={{
						background: "#eee",
						color: "#000",
						borderRadius: 6,
						...iconStyles
					}}
				></react_material_icons.MdKeyboardBackspace>
			</h1>
		</div>
	);
};

BackButton.propTypes = {
	iconStyles: PropTypes.object,
	onClickAction: PropTypes.func
};

export default BackButton;
