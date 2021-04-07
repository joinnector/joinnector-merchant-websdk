//from system
import React from "react";
import ReactRipples from "react-ripples";
import prop_types from "prop-types";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../../helper/collection_helper";
import constant_helper from "../../../helper/constant_helper";
import axios_wrapper from "../../../wrapper/axios_wrapper";


import * as MobileView from "./view/mobile";
import * as DesktopView from "./view/desktop";

import * as antd from "antd";
// import * as antd_icons from "@ant-design/icons";

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
		// if (nextProps.lead._id != this.props.lead._id) {
		// 	this.api_merchant_list_tasks({ page: 1, limit: 5, lead_id: nextProps.lead._id });
		// }

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_tasks(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["category", "country", "name", "sku", "sub_category", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 5 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		// const lead_id = values.lead_id || this.props.lead._id;

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
				delegate_attributes: {
					method: "fetch_tasks",
					body: {},
					params: {},
					query: {
						page: values.page || 1,
						limit: values.limit || 5,
						sort: values.sort || "updated_at",
						sort_op: values.sort_op || "DESC",
						...list_filters
					},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().fetch({
						page: values.page || 1,
						limit: values.limit || 5,
						sort: values.sort || "updated_at",
						sort_op: values.sort_op || "DESC",
						...list_filters
					}, "task")
				}
			}
		};

		this.set_state({ loading: true });
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
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "task",
				value: {
					...record
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {
			const search_params = collection_helper.process_url_params(this.props.location.search);
			search_params.set("task_id", record._id);
			this.props.history.push(`/nector/taskactivity-list?${search_params.toString()}`);
		});
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

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%" }}>
					<antd.Button onClick={() => this.api_merchant_list_tasks({ page: Number(this.state.page) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<antd.Card className="nector-card" style={{ padding: 0, backgroundColor: default_search_params.toolbar_background_color, backgroundImage: default_search_params.toolbar_background_image }} bordered={false}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<ReactRipples>
							<react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: default_search_params.toolbar_color }} onClick={() => this.props.history.goBack()}></react_material_icons.MdKeyboardBackspace>
						</ReactRipples>
					</antd.PageHeader>

					<antd.Typography.Title style={{ fontSize: "1.5em", color: default_search_params.toolbar_color }}>Campaigns</antd.Typography.Title>
				</antd.Card>

				<div className="nector-position-relative">
					<div className="nector-shape nector-overflow-hidden" style={{ color: "#f2f2f2" }}>
						<svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
						</svg>
					</div>
				</div>

				<antd.Layout>
					<antd.List
						grid={{ gutter: 8, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
						locale={{ emptyText: "We did not find anything at the moment, please try after sometime" }}
						dataSource={data_source}
						loading={this.state.loading}
						bordered={false}
						size="small"
						loadMore={render_load_more()}
						renderItem={(item) => render_list_item(item, { ...this.props, on_task: this.on_task })}
					/>
				</antd.Layout>
			</div>
		);
	}
}

TaskListComponent.propTypes = properties;

export default TaskListComponent;