//from system
import React from "react";

import prop_types from "prop-types";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as ViewForm from "../../component_form/nector/activity/view_form";
import Button from "./common/button";
import BackButton from "./common/back_button";

import * as analytics from "../../analytics";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,
	activities: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ActivityListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_activities = this.api_merchant_list_activities.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef

		this.on_refresh();
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_activities({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_activities(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 10 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_ACTIVITY_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/activities",
			append_data: values.append_data || false,
			params: {
				lead_id: lead_id,
				page: values.page || 1,
				limit: values.limit || 10,
				sort: values.sort || "created_at",
				sort_op: values.sort_op || "DESC",
				event: "referral_create",
			},
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.activities && this.props.activities.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_activities({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.activities) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.activities.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.activities.items) === true && this.props.activities.items.length < 1)) {
			this.api_merchant_list_activities({ page: 1, limit: 10 });
		}
	}

	set_state(values) {
		// eslint-disable-next-line no-unused-vars
		this.setState((state, props) => ({
			...state,
			...values
		}));
	}

	render() {
		// eslint-disable-next-line no-unused-vars
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const data_source = this.process_list_data();
		const count = (this.props.activities && this.props.activities.count || 0);

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<Button type="primary" onClick={() => this.api_merchant_list_activities({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load More</Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false} bodyStyle={{ padding: 20 }}>
						<BackButton />

						<div style={{ display: "flex", flex: 1, alignItems: "center", marginBottom: 20 }}>
							<div style={{ display: "flex", flex: 1 }}>
								<b className="nector-title" style={{ color: "#000" }}>Referral History</b>
							</div>
						</div>

						<antd.List
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item, index) => ViewForm.MobileRenderListItem(item, this.props, index === data_source?.length - 1)}
						/>
					</antd.Card>
				</div>
				{/* </ReactPullToRefresh> */}
			</div>

		);
	}
}

ActivityListComponent.propTypes = properties;

export default ActivityListComponent;