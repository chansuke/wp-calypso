/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';
import clone from 'lodash/clone';

/**
 * Internal dependencies
 */
import FormCurrencyInput from 'components/forms/form-currency-input';
import FormLabel from 'components/forms/form-label';
import FormRadio from 'components/forms/form-radio';

class FreeShippingMethod extends Component {
	constructor( props ) {
		super( props );
		this.state = clone( props );

		this.onOptionChange = this.onOptionChange.bind( this );
	}

	onOptionChange( event ) {
		this.setState( { everyone: 'everyone' === event.currentTarget.value } );
	}

	render() {
		const __ = i18n.translate;

		return (
			<div className="shipping-methods__method-container">
				<FormLabel>{ __( 'Who gets free shipping?' ) }</FormLabel>
				<div className="shipping-methods__free-shipping-option">
					<FormRadio value="everyone" checked={ this.state.everyone } onChange={ this.onOptionChange } />
					{ __( 'Everyone!' ) }
				</div>
				<div className="shipping-methods__free-shipping-option">
					<FormRadio value="paying" checked={ ! this.state.everyone } onChange={ this.onOptionChange } />
					{ __( 'Customers that spend {{priceInput/}} or more per order', {
						components: {
							priceInput: <FormCurrencyInput currencySymbolPrefix="$" value={ this.state.minSpend } />
						}
					} ) }
				</div>
			</div>
		);
	}
}

export default FreeShippingMethod;
