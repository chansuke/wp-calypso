/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Dialog from 'components/dialog';
import FormFieldSet from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSelect from 'components/forms/form-select';
import FormTextInput from 'components/forms/form-text-input';
import FreeShippingMethod from './shipping-methods/free-shipping';
import LocalPickupMethod from './shipping-methods/local-pickup';
import TokenField from 'components/token-field';

class ShippingZoneDialog extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			location: [],
			shippingMethods: [ {
				methodId: 'free',
				everyone: true,
				minSpend: 0
			} ] };

		this.onLocationChange = this.onLocationChange.bind( this );
		this.renderShippingMethod = this.renderShippingMethod.bind( this );
	}

	onLocationChange( location ) {
		this.setState( { location } );
	}

	changeShippingMethod( index, value ) {
		const shippingMethods = this.state.shippingMethods;
		if ( 'free' === value ) {
			shippingMethods[ index ] = {
				methodId: 'free',
				everyone: true,
				minSpend: 0
			};
		} else {
			shippingMethods[ index ] = {
				methodId: 'local',
				price: 0,
				taxable: false
			};
		}

		this.setState( { shippingMethods } );
	}

	renderShippingMethod( method, index ) {
		const { methodId } = method;
		const __ = i18n.translate;

		const onMethodChange = ( event ) => {
			this.changeShippingMethod( index, event.target.value );
		};

		return (
			<div key={ index }>
				<FormSelect
					value={ methodId }
					onChange={ onMethodChange } >
					<option value="free">{ __( 'Free shipping' ) }</option>
					<option value="local">{ __( 'Local pickup' ) }</option>
				</FormSelect>
				{ 'free' === methodId
					? <FreeShippingMethod { ...method } />
					: <LocalPickupMethod { ...method } /> }
			</div>
		);
	}

	render() {
		const { isVisible, onClose } = this.props;
		const __ = i18n.translate;
		const buttons = [
			{ action: 'cancel', label: __( 'Cancel' ) },
			{ action: 'add', label: __( 'Add zone' ), isPrimary: true },
		];

		return (
			<Dialog
				additionalClassNames="shipping__zone-dialog woocommerce"
				isVisible={ isVisible }
				buttons={ buttons }
				onClose={ onClose } >
				<div className="shipping__header">{ __( 'Add new shipping zone' ) }</div>
				<FormFieldSet>
					<FormLabel htmlFor="zone-name">{ __( 'Shipping zone name' ) }</FormLabel>
					<FormTextInput name="zone-name" placeholder={ __( 'For your reference only, the customer will not see this' ) } />
				</FormFieldSet>
				<FormFieldSet>
					<FormLabel>{ __( 'Shipping location' ) }</FormLabel>
					<TokenField
						value={ this.state.location }
						onChange={ this.onLocationChange } />
				</FormFieldSet>
				<FormFieldSet>
					<FormLabel>{ __( 'Shipping method' ) }</FormLabel>
					{ this.state.shippingMethods.map( this.renderShippingMethod ) }
				</FormFieldSet>
				<Button>{ __( 'Add another shipping method' ) }</Button>
			</Dialog>
		);
	}
}

export default ShippingZoneDialog;
