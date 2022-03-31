//from system
import React from "react";
// import ReactPullToRefresh from "react-simple-pull-to-refresh";
import prop_types from "prop-types";
import * as react_material_icons from "react-icons/md";
// import * as react_game_icons from "react-icons/gi";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/wallettransaction/view_form";

import * as antd from "antd";
// import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,
	wallet: prop_types.object,
	wallettransactions: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class WalletTransactionListComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			page: 1,
			limit: 10,
		};

		this.api_merchant_list_wallettransactions = this.api_merchant_list_wallettransactions.bind(this);
		this.api_merchant_get_wallets = this.api_merchant_get_wallets.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.on_refresh = this.on_refresh.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef
		
		
		this.on_refresh();

		// fetch wallet if no value
		if (collection_helper.validate_is_null_or_undefined(this.props.wallet) === true
			|| Object.keys(this.props.wallet).length < 1) {
			this.api_merchant_get_wallets();
		}
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_wallettransactions({ page: 1, limit: 10, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {
		const opts = {
			event: constant_helper.get_app_constant().INTERNAL_DISPATCH,
			append_data: false,
			attributes: {
				key: "wallet",
				value: {}
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.internal_generic_dispatch(opts, (result) => {

		});
	}

	api_merchant_list_wallettransactions(values) {
		const list_filters = collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["wallet_id", "sort", "sort_op", "page", "limit"]);

		this.set_state({ page: list_filters.page || values.page || 1, limit: list_filters.limit || values.limit || 10 });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		let wallet_filters = {};
		if (collection_helper.validate_not_null_or_undefined(this.props.wallet) === true
			&& Object.keys(this.props.wallet).length > 0) {
			wallet_filters = { wallet_id: this.props.wallet._id };
		}

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				...axios_wrapper.get_wrapper().fetch({
					lead_id: lead_id,
					page: values.page || 1,
					limit: values.limit || 10,
					sort: values.sort || "created_at",
					sort_op: values.sort_op || "DESC",
					...wallet_filters,
					...list_filters
				}, "wallettransaction")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	api_merchant_get_wallets() {
		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const search_params = collection_helper.process_url_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(search_params.get("wallet_id")) === true) return null;

		// try fetching th wallet
		const walletopts = {
			event: constant_helper.get_app_constant().API_MERCHANT_VIEW_WALLET_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().get(search_params.get("wallet_id"), "wallet")
			}
		};

		this.set_state({ loading: true });
		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(walletopts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.wallettransactions && this.props.wallettransactions.items || []).map(item => ({ ...item, key: item._id }));
	}

	on_refresh(force = false) {
		if (force === true) {
			this.set_state({ page: 1, limit: 10 });
			return new Promise(resolve => {
				this.api_merchant_list_wallettransactions({ page: 1, limit: 10 });
				return resolve(true);
			});
		}

		if (collection_helper.validate_is_null_or_undefined(this.props.wallettransactions) === true
			|| collection_helper.validate_is_null_or_undefined(this.props.wallettransactions.items) === true
			|| (collection_helper.validate_not_null_or_undefined(this.props.wallettransactions.items) === true && this.props.wallettransactions.items.length < 1)) {
			this.api_merchant_list_wallettransactions({ page: 1, limit: 10 });
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
		const count = (this.props.wallettransactions && this.props.wallettransactions.count || 0);
		// eslint-disable-next-line no-unused-vars
		const wallet = this.props.wallet && Object.keys(this.props.wallet).length > 0 ? this.props.wallet : {
			available: "",
			reserve: "",
		};

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%", marginTop: 5, marginBottom: 5 }}>
					<antd.Button type="primary" onClick={() => this.api_merchant_list_wallettransactions({ page: Math.floor(Number(data_source.length) / this.state.limit) + 1, append_data: true })}>Load More</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				{/* <ReactPullToRefresh onRefresh={() => this.on_refresh(true)} pullingContent={""} refreshingContent={""}> */}
				<div>
					<antd.Card className="nector-card" style={{ padding: 0, minHeight: "10%", borderBottom: "1px solid #eeeeee00" }} bordered={false}>
						<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
							<div style={{ display: "flex" }} onClick={() => this.props.history.goBack()}>
								<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ background: "#eee", color: "#000", borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
							</div>
						</antd.PageHeader>

						<div style={{ display: "flex", flex: 1, alignItems: "center" }}>
							<div style={{ display: "flex", flex: 1 }}><h3><b>Wallet History</b></h3></div>
						</div>

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
							renderItem={(item) => ViewForm.MobileRenderListItem(item, this.props)}
						/>
					</antd.Layout>
				</div>
				{/* </ReactPullToRefresh> */}
			</div>

		);
	}
}

WalletTransactionListComponent.propTypes = properties;

export default WalletTransactionListComponent;