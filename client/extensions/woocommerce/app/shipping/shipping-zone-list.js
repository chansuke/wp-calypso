/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import ShippingHeader from './shipping-header';
import ShippingZone from './shipping-zone';
import ShippingZoneDialog from './shipping-zone-dialog';

class ShippingZoneList extends Component {
	constructor( props ) {
		super( props );
		this.state = { showDialog: false };

		this.onAddZoneOpen = this.onAddZoneOpen.bind( this );
		this.onAddZoneClose = this.onAddZoneClose.bind( this );
	}

	onAddZoneOpen() {
		this.setState( { showDialog: true } );
	}

	onAddZoneClose() {
		this.setState( { showDialog: false } );
	}

	render() {
		const __ = i18n.translate;

		return (
			<div>
				<ShippingHeader
					label={ __( 'Shipping Zones' ) }
					description={ __( 'The regions you ship to and the methods you will provide.' ) }>
					<Button onClick={ this.onAddZoneOpen }>{ __( 'Add zone' ) }</Button>
				</ShippingHeader>
				<Card className="shipping__zones">
					<div className="shipping__zones-row shipping__zones-header">
						<div className="shipping__zones-row-icon"></div>
						<div className="shipping__zones-row-location">{ __( 'Location' ) }</div>
						<div className="shipping__zones-row-method">{ __( 'Shipping method' ) }</div>
						<div className="shipping__zones-row-actions" />
					</div>
					<ShippingZone
						locationName="United States"
						locationDescription="50 states"
						methodName="USPS"
						methodDescription="All domestic services"
						icon="location" />
					<ShippingZone
						locationName="Rest of the world"
						locationDescription="240 countries"
						methodName="USPS"
						methodDescription="All international services"
						icon="globe" />
				</Card>
				<ShippingZoneDialog isVisible={ this.state.showDialog } onClose={ this.onAddZoneClose } />
			</div>
		);
	}
}

export default ShippingZoneList;
