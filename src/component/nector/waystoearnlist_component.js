/* eslint-disable no-unused-vars */
//from system
import React from "react";

import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";

import * as analytics from "../../analytics";

import * as ViewForm from "../../component_form/nector/trigger/view_form";
import Button from "./common/button";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,
	entity: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class WaysToEarnListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_triggers = this.api_merchant_list_triggers.bind(this);
		this.api_merchant_get_leads = this.api_merchant_get_leads.bind(this);
		this.api_merchant_create_triggeractivities = this.api_merchant_create_triggeractivities.bind(this);

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
			this.api_merchant_list_triggers({ lead_id: nextProps.lead._id, page: 1, limit: 10 });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_triggers(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 10 });

		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = values.lead_id || this.props.lead._id;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_TRIGGERS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/triggers",
			append_data: values.append_data || false,
			params: {
				page: values.page || 1,
				limit: values.limit || 10,
				sort: "created_at",
				sort_op: "DESC",
				content_types: ["earn", "social"],
			},
		};

		if (collection_helper.validate_not_null_or_undefined(lead_id)) opts.params.lead_id = lead_id;

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_get(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_get_leads() {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);
		let lead_id = search_params.get("lead_id") || null;
		let customer_id = search_params.get("customer_id") || null;
		const customer_identifier = default_search_params.identifier || null;

		if (collection_helper.validate_not_null_or_undefined(customer_identifier) === true
			&& collection_helper.validate_not_null_or_undefined(customer_id) === true) {
			customer_id = collection_helper.process_key_join([customer_identifier, customer_id], "-");
		}

		const lead_params = customer_id !== null ? { customer_id: customer_id } : {};

		if (collection_helper.validate_not_null_or_undefined(customer_id)) lead_id = lead_id || collection_helper.process_new_uuid();
		else if (collection_helper.validate_is_null_or_undefined(customer_id)
			&& collection_helper.validate_is_null_or_undefined(lead_id)) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_GET_LEAD,
			url: url,
			endpoint: `api/v2/merchant/leads/${lead_id}`,
			append_data: false,
			params: {
				...lead_params
			},
		};

		this.props.app_action.api_generic_get(opts);
	}

	api_merchant_create_triggeractivities(values) {
		const url = analytics.get_platform_url();
		if (collection_helper.validate_is_null_or_undefined(url) === true) return null;

		const lead_id = this.props.lead._id;
		const trigger_id = values.trigger_id;

		if (collection_helper.validate_is_null_or_undefined(lead_id) === true
			|| collection_helper.validate_is_null_or_undefined(trigger_id) === true) return null;

		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: url,
			endpoint: "api/v2/merchant/activities",
			append_data: false,
			params: {},
			attributes: {
				trigger_id: trigger_id,
				lead_id: lead_id
			}
		};

		this.set_state({ loading: true });
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });

			// fetch user again
			if (result && result.data && result.data.activity) {
				this.api_merchant_get_leads();

				collection_helper.window_post_message(constant_helper.get_app_constant().WINDOW_MESSAGE_EVENTS.REFRESH_WALLET);
			}

			if (result && result.data && result.data.wallet_reward) {
				// clear all the wallettransaction
				const wallettransactionopts = {
					event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
					append_data: false,
					attributes: {
						key: "wallettransactions",
						value: {}
					}
				};

				// eslint-disable-next-line no-unused-vars
				this.props.app_action.internal_generic_dispatch(wallettransactionopts);

			} else if (result && result.data && result.data.offer_reward) {
				// clear all the coupons
				const couponopts = {
					event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
					append_data: false,
					attributes: {
						key: "coupons",
						value: {}
					}
				};

				// eslint-disable-next-line no-unused-vars
				this.props.app_action.internal_generic_dispatch(couponopts);

			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_instruction_follow_request, {
				trigger_id: trigger_id
			});
	}

	process_list_data() {
		return (this.props.triggers && this.props.triggers.items || []).filter(item => item.content_type !== "referral").map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			// to load the partial component
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_triggers({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.triggers) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.triggers.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.triggers.items) === true && this.props.triggers.items.length < 1)) {
			this.api_merchant_list_triggers({ page: 1, limit: 10 });
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
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const data_source = this.process_list_data();
		const count = (this.props.triggers && this.props.triggers.count || 0);

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<Button className="nector-text" type="primary" onClick={() => this.api_merchant_list_triggers({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load more</Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false} bodyStyle={{ padding: 20 }}>
						<div style={{ display: "flex", marginBottom: 10 }} onClick={() => this.props.history.goBack()}>
							<h1><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 6 }}></react_material_icons.MdKeyboardBackspace></h1>
						</div>

						<div style={{ display: "flex", flex: 1, alignItems: "center", marginBottom: 20 }}>
							<div style={{ display: "flex", flex: 1 }}>
								<b className="nector-title" style={{ color: "#000" }}>Ways To Earn</b>
							</div>
						</div>

						<antd.List
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							loadMore={render_load_more()}
							renderItem={(item, index) => ViewForm.MobileRenderListItem(item, { ...this.props, activities: this.props.triggers?.activities || [], api_merchant_create_triggeractivities: this.api_merchant_create_triggeractivities }, index === data_source?.length - 1)}
						/>
					</antd.Card>
				</div>
			</div>
		);
	}
}

WaysToEarnListComponent.propTypes = properties;

export default WaysToEarnListComponent;