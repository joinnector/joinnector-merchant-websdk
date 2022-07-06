import React from "react";
import * as antd from "antd";

function FullPageLoader() {
	return (
		<div className="nector-center" style={{ minHeight: "100vh" }}>
			<antd.Spin size="large" />
		</div>
	);
}

export default FullPageLoader;