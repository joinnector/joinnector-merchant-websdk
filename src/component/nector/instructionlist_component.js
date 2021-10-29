/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import ReactPullToRefresh from "react-simple-pull-to-refresh";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/instruction/view_form";

import * as antd from "antd";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	lead: prop_types.object.isRequired,
	instructions: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class InstructionListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_instructions = this.api_merchant_list_instructions.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.on_instruction = this.on_instruction.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.on_refresh();

	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_instructions({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_instructions(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["deal_id", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_INSTRUCTION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
					...list_filters,
				}, "instruction")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.instructions && this.props.instructions.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			// to load the partial component
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_instructions({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.instructions) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.instructions.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.instructions.items) === true && this.props.instructions.items.length < 1)) {
			this.api_merchant_list_instructions({ page: 1, limit: 10 });
		}
	}

	// eslint-disable-next-line no-unused-vars
	on_instruction(record) {
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "instruction",
				value: {
					...record
				}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {
			const search_params = collection_helper.process_url_params(this.props.location.search);
			search_params.set("instruction_id", record._id);
			this.props.history.push(`/nector/instruction?${search_params.toString()}`);
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
		const count = (this.props.instructions && this.props.instructions.count || 0);

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<antd.Button type="primary" style={{ fontSize: "1em", }} onClick={() => this.api_merchant_list_instructions({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<ReactPullToRefresh onRefresh={() => this.on_refresh(true)} pullingContent={""} refreshingContent={""}>
					<div>
						<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
							<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
								<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
									<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
								</div>
							</antd.PageHeader>

							<h3><b>Ways to Earn Rewards</b></h3>
						</antd.Card>

						<antd.Layout>
							{/* <div style={{ textAlign: "center" }}>
								<antd.Typography.Text style={{ fontSize: "0.7em" }}>* Pull down to refresh</antd.Typography.Text>
							</div> */}

							<antd.List
								locale={{ emptyText: "We did not find anything at the moment, please try after sometime in case experiencing any issues." }}
								dataSource={data_source}
								loading={this.state.loading}
								bordered={false}
								size="small"
								loadMore={render_load_more()}
								renderItem={(item) => ViewForm.MobileRenderListItem(item, { ...this.props, on_instruction: this.on_instruction })}
							/>
						</antd.Layout>
					</div>
				</ReactPullToRefresh>
			</div>
		);
	}
}

InstructionListComponent.propTypes = properties;

export default InstructionListComponent;