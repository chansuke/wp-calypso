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
import FormCheckbox from 'components/forms/form-checkbox';
import FormLabel from 'components/forms/form-label';

class LocalPickupMethod extends Component {
	constructor( props ) {
		super( props );
		this.state = clone( props );
	}

	render() {
		const __ = i18n.translate;

		return (
			<div className="shipping-methods__method-container">
				<FormLabel>{ __( 'How much will you charge for local pickup?' ) }</FormLabel>
				<FormCurrencyInput currencySymbolPrefix="$" value={ this.state.price } />
				<FormCheckbox checked={ this.state.taxable } /> Taxable
			</div>
		);
	}
}

export default LocalPickupMethod;
