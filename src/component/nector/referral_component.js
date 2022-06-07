/* eslint-disable no-unused-vars */
//from system
import React from "react";
import ReactRipples from "react-ripples";
import prop_types from "prop-types";
import copy_to_clipboard from "copy-to-clipboard";
import * as react_material_icons from "react-icons/md";
import * as react_fi_icons from "react-icons/fi";
import * as react_fa_icons from "react-icons/fa";

import collection_helper from "../../helper/collection_helper";
import constant_helper from "../../helper/constant_helper";
import axios_wrapper from "../../wrapper/axios_wrapper";

import * as ViewForm from "../../component_form/nector/profile/view_form";
import Timeline from "./common/timeline";
import Button from "./common/button";

import * as antd from "antd";
import * as antd_icons from "@ant-design/icons";

const properties = {
	history: prop_types.any.isRequired,
	location: prop_types.any.isRequired,

	systeminfos: prop_types.object.isRequired,
	websdkinfos: prop_types.object.isRequired,

	lead: prop_types.object.isRequired,
	triggers: prop_types.object.isRequired,

	// actions
	app_action: prop_types.object.isRequired,
};

//from app
class ReferralComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			drawer_visible: false,

			action: "view",

			loading: false,

			page: 1,
			limit: 10,

			show_referral_code_modal: false,
			referral_code: ""
		};

		this.api_merchant_update_leadsreferredbyreferralcode = this.api_merchant_update_leadsreferredbyreferralcode.bind(this);

		this.on_referralcopy = this.on_referralcopy.bind(this);
		this.on_referral_sharewhatsapp = this.on_referral_sharewhatsapp.bind(this);
		this.on_referral_sharefacebook = this.on_referral_sharefacebook.bind(this);
		this.on_referral_sharetwitter = this.on_referral_sharetwitter.bind(this);
		this.on_referral_shareemail = this.on_referral_shareemail.bind(this);

		this.set_state = this.set_state.bind(this);
	}

	// mounted
	componentDidMount() {
		// eslint-disable-next-line no-undef

	}

	// updating
	// eslint-disable-next-line no-unused-vars
	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	// unmount
	componentWillUnmount() {

	}

	api_merchant_update_leadsreferredbyreferralcode(values) {
		if (!this.props.lead._id) return;

		const default_search_params = collection_helper.get_default_params(this.props.location.search);

		if (collection_helper.validate_is_null_or_undefined(default_search_params.url) === true) return null;

		// eslint-disable-next-line no-unused-vars
		const opts = {
			event: constant_helper.get_app_constant().API_SUCCESS_DISPATCH,
			url: default_search_params.url,
			endpoint: default_search_params.endpoint,
			params: {},
			authorization: default_search_params.authorization,
			append_data: false,
			attributes: {
				...axios_wrapper.get_wrapper().save(this.props.lead._id, {
					...collection_helper.process_nullify(collection_helper.get_lodash().omitBy(collection_helper.get_lodash().pick(values, ["referred_by_referral_code"]), collection_helper.get_lodash().isNil)),
				}, "leadreferredbyreferralcode")
			}
		};

		if (Object.keys(opts.attributes.attributes).length < 1) return null;

		// eslint-disable-next-line no-unused-vars
		this.props.app_action.api_generic_put(opts, (result) => {
			if (result.meta.status === "success") {
				collection_helper.show_message("Your referral reward will get processed in sometime", "success");
				this.setState({ show_referral_code_modal: false, referral_code: null });
				this.api_merchant_get_leads();
			}
		});

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_referral_request, {
				referred_by_referral_code: values.referred_by_referral_code,
				referral_code: this.state.referral_code
			});
	}

	on_submit_referralcode(values) {
		if (values.referred_by_referral_code) {
			this.api_merchant_update_leadsreferredbyreferralcode({ referred_by_referral_code: values.referred_by_referral_code });
		}
	}

	on_referralcopy(code) {
		collection_helper.show_message("Code copied");
		copy_to_clipboard(code);

		require("../../analytics")
			.track_event(constant_helper.get_app_constant().EVENT_TYPE.ws_lead_copy_request, {
				referral_code: code
			});
	}

	on_referral_sharewhatsapp(business_name, referral_code) {
		window.open(`https://wa.me/?text=${encodeURI(`Hey everyone. Check out ${business_name} (${window.location.origin}) and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank");
	}

	on_referral_sharefacebook(business_name, referral_code) {
		window.open(`https://www.facebook.com/dialog/share?app_id=${5138626756219227}&display=popup&href=${encodeURI(window.location.origin)}&quote=${encodeURI(`Hey everyone. Check out ${business_name} and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_referral_sharetwitter(business_name, referral_code) {
		window.open(`http://twitter.com/share?url=${encodeURI(window.location.origin)}&text=${encodeURI(`Hey everyone. Check out ${business_name} and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_blank", "popup=yes,left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	}

	on_referral_shareemail(business_name, referral_code) {
		window.open(`mailto:?subject=${encodeURI(`Check out ${business_name}`)}&body=${encodeURI(`Hi. Check out ${business_name} (${window.location.origin}) and use my referral code: ${referral_code} to get amazing rewards!`)}`, "_self");
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
		const wallets = this.props.lead.wallets || this.props.lead.devwallets || [];

		const safe_lead = this.props.lead || {};
		const safe_metadetail = safe_lead.metadetail || {};

		const dataSource = (this.props.websdkinfos && this.props.websdkinfos.items || []).map(item => ({ ...item, key: item._id }));

		const referral_content_triggers = (this.props.triggers?.items?.filter(x => x.content_type === "referral") || []);

		const websdk_config_arr = dataSource.filter(x => x.name === "websdk_config") || [];
		const websdk_config_options = websdk_config_arr.length > 0 ? websdk_config_arr[0].value : {};
		const websdk_config = collection_helper.get_websdk_config(websdk_config_options);

		const picked_wallet = wallets.length > 0 ? wallets[0] : {
			available: "0",
			reserve: "0",
		};

		const has_user = (safe_lead._id) || false;
		const has_wallet = (wallets.length > 0 && (websdk_config_options.hide_wallet || false) !== true) || false;
		const safe_name = (safe_lead.name) || "There";

		collection_helper.set_css_property("--g-text-color", websdk_config.text_color);

		return (
			<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: websdk_config.text_color }}>
				<div style={{ flex: "1 0 auto", backgroundColor: websdk_config.business_color }}>
					<div style={{ display: "flex", cursor: "pointer", margin: 15, marginBottom: 0, marginTop: 10 }} onClick={() => this.props.history.goBack()}>
						<h2><react_material_icons.MdKeyboardBackspace className="nector-icon" style={{ color: websdk_config.text_color, borderRadius: 10 }}></react_material_icons.MdKeyboardBackspace></h2>
					</div>

					<div style={{ fontSize: 28, color: websdk_config.text_color, marginLeft: 15, textAlign: "center", marginBottom: 15 }}>
						<span>Refer &amp; Earn</span>
					</div>

					<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<img src="https://res.cloudinary.com/de8lpgnq0/image/upload/v1654590860/referral_coins_2_pgqqmz.png" style={{ width: "78%", height: "auto" }} />
					</div>

					<div style={{ margin: "25px 20px 25px 30px" }}>
						<div>
							<Timeline>
								<Timeline.Content circleBackgroundColor={websdk_config.text_color}>
									<p style={{ marginBottom: 30, fontSize: 13 }}>Refer your friends to {websdk_config.business_name}</p>
								</Timeline.Content>
								<Timeline.Content circleBackgroundColor={websdk_config.text_color}>
									<p style={{ marginBottom: 30, fontSize: 13 }}>Your friend places an order</p>
								</Timeline.Content>
								<Timeline.Content last={true}>
									<p style={{ fontSize: 15 }}>{referral_content_triggers?.[0]?.content?.name}, {referral_content_triggers?.[1]?.content?.name}</p>
								</Timeline.Content>
							</Timeline>
						</div>

						<div style={{ marginTop: 20 }}>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<antd.Typography.Title level={5} style={{ marginBottom: 10, fontWeight: "lighter", fontSize: "18px", color: websdk_config.text_color }}>Your Referral Code</antd.Typography.Title>
								<antd.Typography.Text style={{ display: "block", fontSize: 13, color: websdk_config.text_color }}>Refer your friends through your unique code below &amp; get rewarded!</antd.Typography.Text>
							</div>

							<div style={{ marginTop: 20 }}>
								<div className="wallet-point-design" style={{ fontSize: "1.2em", padding: "10px 0px", width: "95%" }}>
									<span style={{ display: "inline-block", marginRight: 15 }}>{safe_lead.referral_code}</span>

									<react_material_icons.MdContentCopy onClick={() => this.on_referralcopy(safe_lead.referral_code)} style={{ color: "#000", fontSize: "1em", cursor: "pointer" }} />
								</div>
							</div>
						</div>

						<div style={{ width: "95%", margin: "25px 0px", marginTop: 15, display: "flex", justifyContent: "space-around", padding: "0px 10px" }}>
							<react_fa_icons.FaWhatsapp title="WhatsApp" style={{ fontSize: 25, cursor: "pointer" }} onClick={() => this.on_referral_sharewhatsapp(websdk_config_options.business_name, safe_lead.referral_code)} />

							<react_fa_icons.FaFacebook title="Facebook" style={{ fontSize: 23, cursor: "pointer" }} onClick={() => this.on_referral_sharefacebook(websdk_config_options.business_name, safe_lead.referral_code)} />

							<react_fa_icons.FaTwitter title="Twitter" style={{ fontSize: 23, cursor: "pointer" }} onClick={() => this.on_referral_sharetwitter(websdk_config_options.business_name, safe_lead.referral_code)} />

							<react_material_icons.MdEmail title="Email" style={{ fontSize: 24, cursor: "pointer" }} onClick={() => this.on_referral_shareemail(websdk_config_options.business_name, safe_lead.referral_code)} />
						</div>

						{(safe_lead.referred_by_referral_code === null) && <div style={{ width: "95%" }}>
							<antd.Collapse
								defaultActiveKey="temp"
								bordered={false}
								style={{
									marginBottom: "0",
									borderRadius: "7px",
									overflow: "hidden",
									backgroundColor: "#f5f5f5"
								}}>
								<antd.Collapse.Panel header="Have a Referral Code?" key="1" className="referral-code-collapse-panel" showArrow={false} extra={<antd_icons.CaretDownFilled />}>
									<antd.Form onFinish={this.on_submit_referralcode}>
										<antd.Form.Item
											name="referred_by_referral_code"
											rules={[{ required: true, message: "Please enter the referral code" }]}
											style={{ marginBottom: 15 }}>
											<antd.Input placeholder="Enter the referral code" style={{ borderRadius: 5 }} />
										</antd.Form.Item>

										<antd.Form.Item style={{ marginBottom: 0 }}>
											<Button type="primary" htmlType="submit" size="middle" style={{ width: "100%", borderRadius: 5 }}> Submit </Button>
										</antd.Form.Item>
									</antd.Form>
								</antd.Collapse.Panel>
							</antd.Collapse>
						</div>}
					</div>
				</div>
			</div>
		);
	}
}

ReferralComponent.propTypes = properties;

export default ReferralComponent;