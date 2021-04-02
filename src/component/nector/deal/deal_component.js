/* eslint-disable no-unused-vars */
//from system
import React from "react";
import prop_types from "prop-types";
import random_gradient from "random-gradient";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";

import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	deal: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class DealComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values
		}));
	}

	render() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const deal = this.props.deal && Object.keys(this.props.deal).length > 0 ? this.props.deal : {
			name: "",
			sell_price: "0",
			description: "",
			tnc: "",
			category: "",
			provider: "",
			hits: "0",
			count: "0",
			avg_rating: "0",
			expire: null,
			uploads: [{ link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" }],
		};

		const uploads = deal.uploads || [];
		const picked_upload = uploads.length > 0 ? uploads[0] : { link: "https://res.cloudinary.com/esternetwork/image/upload/v1617280550/nector/images/logowhite.svg" };

		// const render_info_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderInfoItem : MobileView.MobileRenderListItem;

		return (
			<div>
				<antd.Card className="nector-profile-hero-image" style={{ padding: 0, background: random_gradient(collection_helper.get_limited_text(deal.name, 13, "nectormagic")) }}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<antd_icons.ArrowLeftOutlined style={{ fontSize: "1.2em", color: "#ffffff" }} onClick={() => this.props.history.goBack()}></antd_icons.ArrowLeftOutlined>
					</antd.PageHeader>

					<antd.Avatar src={picked_upload.link} />

					<div style={{ marginBottom: 10 }} />

					<antd.Typography.Title style={{ color: "#ffffff", fontSize: "2em" }}>{collection_helper.get_limited_text(deal.name, 100)}</antd.Typography.Title>
					{/* <antd.Typography.Paragraph style={{ color: "#ffffff", fontSize: "0.8em" }}>{expire_text}</antd.Typography.Paragraph> */}
				</antd.Card>
				
				<antd.Layout>

				</antd.Layout>
			</div>
		);
	}
}

DealComponent.propTypes = properties;

export default DealComponent;