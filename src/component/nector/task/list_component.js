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
	tasks: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class TaskListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 5,
		};

		this.api_merchant_list_tasks = this.api_merchant_list_tasks.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_task = this.on_task.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.api_merchant_list_tasks({ page: 1, limit: 5 });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_tasks({ page: 1, limit: 5, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_tasks(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 5, loading: true });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
	
		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_TASK_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				method: "fetch_tasks",
				body: {},
				params: {},
				query: {
					...collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["category", "country", "name", "sku", "sub_category"]),
					page: values.page || 1,
					limit: values.limit || 5,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
				},
			}
		};

		if (collection_helper.validate_not_null_or_undefined(lead_id) === true) opts.attributes.query.lead_id = lead_id;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.tasks && this.props.tasks.items || []).map(item => ({ ...item, key: item._id }));
	}

	// eslint-disable-next-line no-unused-vars
	on_task(record) {
		// todo
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
		const count = (this.props.tasks && this.props.tasks.count || 0);

		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;

		const load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center" }}>
					<antd.Button onClick={() => this.api_merchant_list_tasks({ page: Number(this.state.page) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<antd.Layout>
				<antd.List
					grid={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
					dataSource={data_source}
					loading={this.state.loading}
					size="small"
					bordered={false}
					loadMore={load_more()}
					renderItem={(item) => render_list_item(item)}
				/>
			</antd.Layout>
		);
	}
}

TaskListComponent.propTypes = properties;

export default TaskListComponent;