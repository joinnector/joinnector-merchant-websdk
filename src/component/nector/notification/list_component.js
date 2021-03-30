//from system
import React from "react";
import prop_types from "prop-types";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";

import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";


import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	notifications: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class NotificationListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 20,
		};

		this.api_merchant_list_notifications = this.api_merchant_list_notifications.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.api_merchant_list_notifications({ page: 1, limit: 20 });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_notifications({ page: 1, limit: 20, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_notifications(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 20 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_NOTIFICATION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			attributes: {
				method: "fetch_notifications",
				body: {},
				params: {},
				query: {
					...collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["event"]),
					lead_id: lead_id,
					page: values.page || 1,
					limit: values.limit || 20,
					sort: values.sort || "updated_at",
					sort_op: values.sort_op || "DESC",
				},
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {

		});
	}

	process_list_data() {
		return (this.props.notifications && this.props.notifications.items || []).map(item => ({ ...item, key: item._id }));
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
		const count = (this.props.notifications && this.props.notifications.count || 0);

		const grid_style = default_search_params.view === "desktop" ? { column: 2 } : {column: 1};
		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;

		return (
			<antd.Layout>
				<antd.List
					grid={grid_style}
					dataSource={data_source}
					size="small"
					bordered={false}
					pagination={{
						onChange: (page) => {
							if (!this.state.loading) this.api_merchant_list_notifications({ page: page });
						},
						current: this.state.page,
						total: count,
						pageSize: 20,
					}}
					renderItem={(item) => render_list_item(item)}
				/>
			</antd.Layout>
		);
	}
}

NotificationListComponent.propTypes = properties;

export default NotificationListComponent;