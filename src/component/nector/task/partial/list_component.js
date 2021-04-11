//from system
import React from "react";

import prop_types from "prop-types";
// import random_gradient from "random-gradient";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../../../helper/collection_helper";
import constant_helper from "../../../../helper/constant_helper";
import axios_wrapper from "../../../../wrapper/axios_wrapper";


import * as MobileView from "../view/mobile";
import * as DesktopView from "../view/desktop";

import * as antd from "antd";
// import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	tasks: prop_types.object.isRequired,

	force_load_partial_component: prop_types.bool,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class TaskListPartialComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_tasks = this.api_merchant_list_tasks.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.on_task = this.on_task.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.on_refresh();
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.force_load_partial_component !== this.props.force_load_partial_component
			&& nextProps.force_load_partial_component === true) {
			this.on_refresh(true);
		}
		
		// if (nextProps.lead._id != this.props.lead._id) {
		// 	this.api_merchant_list_tasks({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		// }

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_tasks(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["category", "country", "name", "sku", "sub_category", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

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
						limit: values.limit || 10,
						sort: values.sort || "updated_at",
						sort_op: values.sort_op || "DESC",
						...list_filters
					},
				},
				regular_attributes: {
					...axios_wrapper.get_wrapper().fetch({
						page: values.page || 1,
						limit: values.limit || 10,
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

	on_refresh(force = false) {
		if (force === true) return this.api_merchant_list_tasks({ page: 1, limit: 10 });

		if (collection_helper.validate_is_null_or_undefined(this.props.tasks) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.tasks.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.tasks.items) === true && this.props.tasks.items.length < 1)) {
			this.api_merchant_list_tasks({ page: 1, limit: 10 });
		}
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

		const render_load_more_horizontal = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div>
					<react_material_icons.MdArrowForward className="nector-icon" style={{ color: "#000000" }} onClick={() => this.api_merchant_list_tasks({ page: Number(this.state.page) + 1, append_data: true })}></react_material_icons.MdArrowForward>
					{/* <antd.Avatar onClick={() => this.api_merchant_list_tasks({ page: Number(this.state.page) + 1, append_data: true })}>
					</antd.Avatar> */}
				</div>);
			} else {
				return <div />;
			}
		};

		return (<div>
			{
				data_source.length > 0 ? (<div style={{ marginBottom: 14 }}>
					<div style={{ display: "flex", flex: 1 }}>
						<div style={{ flex: 1 }}>
							<antd.Typography.Text style={{ color: "#000000", fontWeight: "bold", fontSize: "1em", display: "block", marginBottom: 14 }}> CAMPAIGNS </antd.Typography.Text>
						</div>
						{render_load_more_horizontal()}
					</div>
					<div className="nector-horizontal-list">
						<antd.List
							// grid={{ gutter: 8, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
							locale={{ emptyText: "We did not find anything at the moment, please try after sometime" }}
							dataSource={data_source}
							loading={this.state.loading}
							bordered={false}
							size="small"
							// loadMore={render_load_more()}
							renderItem={(item) => render_list_item(item, { ...this.props, on_task: this.on_task })}
						/>
					</div>
				</div>) : <div />
			}
		</div>);
	}
}

TaskListPartialComponent.propTypes = properties;

export default TaskListPartialComponent;