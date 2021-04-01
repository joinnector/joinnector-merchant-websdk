//from system
import React from "react";
import prop_types from "prop-types";

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
			limit: 5,
		};

		this.api_merchant_list_wallettransactions = this.api_merchant_list_wallettransactions.bind(this);

		this.process_list_data = this.process_list_data.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		this.api_merchant_list_wallettransactions({ page: 1, limit: 5 });
	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.lead._id != this.props.lead._id) {
			this.api_merchant_list_wallettransactions({ page: 1, limit: 5, lead_id: nextProps.lead._id });
		}

		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_list_wallettransactions(values) {
		this.set_state({ page: values.page || 1, limit: values.limit || 5, loading: true });

		const default_search_params = collection_helper.get_default_params(this.props.location.search);
		const lead_id = values.lead_id || this.props.lead._id;

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;
		if (collection_helper.validate_is_null_or_undefined(lead_id) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_MERCHANT_LIST_WALLETTRANSACTION_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: values.append_data || false,
			attributes: {
				method: "fetch_wallettransactions",
				body: {},
				params: {},
				query: {
					...collection_helper.get_lodash().pick(collection_helper.process_objectify_params(this.props.location.search), ["wallet_id"]),
					lead_id: lead_id,
					page: values.page || 1,
					limit: values.limit || 5,
					sort: values.sort || "updated_at",
					sort_op: values.sort_op || "DESC",
				},
			}
		};

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_post(opts, (result) => {
			this.set_state({ loading: false });
		});
	}

	process_list_data() {
		return (this.props.wallettransactions && this.props.wallettransactions.items || []).map(item => ({ ...item, key: item._id }));
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
		const count = (this.props.wallettransactions && this.props.wallettransactions.count || 0);
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
			currency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") },
			devcurrency: { symbol: "", currency_code: "", place: 2, conversion_factor: Number("1") }
		};

		const render_list_item = default_search_params.view === "desktop" ? DesktopView.DesktopRenderListItem : MobileView.MobileRenderListItem;

		const render_header = () => {
			return (
				<div>
					<antd.Typography.Title style={{ fontSize: 24 }}>My Wallet Transactions</antd.Typography.Title>
				</div>
			);
		};

		const render_load_more = () => {
			if (!this.state.loading) {
				if (Number(count) <= data_source.length) return <div />;
				return (<div style={{ textAlign: "center", padding: "2%" }}>
					<antd.Button onClick={() => this.api_merchant_list_wallettransactions({ page: Number(this.state.page) + 1, append_data: true })}>Load more</antd.Button>
				</div>);
			} else {
				return <div />;
			}
		};

		return (
			<div>
				<antd.Card className="nector-wallettransaction-hero-image" style={{ padding: 0 }}>
					<antd.PageHeader style={{ paddingLeft: 0, paddingRight: 0 }}>
						<antd_icons.ArrowLeftOutlined style={{ fontSize: 20, color: "#ffffff" }} onClick={() => this.props.history.goBack()}></antd_icons.ArrowLeftOutlined>
					</antd.PageHeader>

					<antd.Typography.Title style={{ color: "#ffffff" }}>{Number(picked_wallet.available)} {collection_helper.get_lodash().upperFirst((picked_wallet.currency || picked_wallet.devcurrency).currency_code)}</antd.Typography.Title>
					<antd.Typography.Paragraph style={{ color: "#ffffff" }}>total rewards</antd.Typography.Paragraph>

					<div style={{ textAlign: "end" }}>
						<antd.Tag> {Number(picked_wallet.reserve)} {(picked_wallet.currency || picked_wallet.devcurrency).currency_code} wallet points in reserve </antd.Tag>
					</div>
				</antd.Card>

				<antd.Layout>
					<antd.List
						// grid={{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
						locale={{ emptyText: "We did not find anything at the moment, please try after sometime" }}
						dataSource={data_source}
						loading={this.state.loading}
						bordered={false}
						size="small"
						header={render_header()}
						loadMore={render_load_more()}
						renderItem={(item) => render_list_item(item, this.props)}
					/>
				</antd.Layout>
			</div>
		);
	}
}

WalletTransactionListComponent.propTypes = properties;

export default WalletTransactionListComponent;