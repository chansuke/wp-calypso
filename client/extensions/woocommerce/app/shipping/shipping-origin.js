/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import ShippingHeader from './shipping-header';
import Notice from 'components/notice';

class ShippingOrigin extends Component {
	constructor( props ) {
		super( props );

		//TODO: use redux state and real data
		this.state = {
			address: {
				name: 'Octopus Outlet Emporium',
				street: '27 Main Street',
				city: 'Ellington, CT 06029',
				country: 'United States'
			},
		};
	}

	render() {
		const __ = i18n.translate;

		return (
			<div>
				<ShippingHeader
					label={ __( 'Shipping Origin' ) }
					description={ __( 'The address of where you will be shipping from.' ) } />
				<Notice
					status="is-info"
					className="shipping__address-notice"
					text={ __( 'This is the address you entered while signing up for a WordPress.com Store.' ) }
					showDismiss={ true } >
				</Notice>
				<Card>
					<div className="shipping__address">
						<p className="shipping__address-name">{ this.state.address.name }</p>
						<p>{ this.state.address.street }</p>
						<p>{ this.state.address.city }</p>
						<p>{ this.state.address.country }</p>
					</div>
					<a>{ __( 'Edit address' ) }</a>
				</Card>
			</div>
		);
	}
}

export default ShippingOrigin;
