/* eslint-disable react/prop-types */
import React, { useCallback } from "react";

function PreventScroll(props) {
	const disabled = props.disabled || false;

	const preventDefault = useCallback((e) => {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	}, []);

	const enableScroll = useCallback(() => {
		document.removeEventListener("wheel", preventDefault, false);
	}, []);

	const disableScroll = useCallback(() => {
		if (disabled) return;

		document.addEventListener("wheel", preventDefault, {
			passive: false,
		});
	}, []);

	return (
		<div
			onMouseEnter={disableScroll}
			onMouseLeave={enableScroll}
		>
			{props.children}
		</div>
	);
}

export default PreventScroll;