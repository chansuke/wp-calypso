/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import CompactCard from 'components/card/compact';
import ShippingHeader from './shipping-header';

class ShippingOrigin extends Component {
	render() {
		const __ = i18n.translate;

		return (
			<div>
				<ShippingHeader
					label={ __( 'Shipping Origin' ) }
					description={ __( 'The address from which you will be shipping from' ) } />
				<CompactCard>
					{ __( 'This is the address you entered while signing up for a WordPress.com Store.' ) }
				</CompactCard>
				<Card>
					<div className="shipping__address">
						<p className="shipping__address-name">Octopus Outlet Emporium</p>
						<p>27 Main Street</p>
						<p>Ellington, CT 06029</p>
						<p>United States</p>
					</div>
					<a>{ __( 'Edit address' ) }</a>
				</Card>
			</div>
		);
	}
}

export default ShippingOrigin;
