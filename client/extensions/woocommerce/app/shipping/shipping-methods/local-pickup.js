/**
 * External dependencies
 */
import React, { Component } from 'react';
import i18n from 'i18n-calypso';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import FormCurrencyInput from 'components/forms/form-currency-input';
import FormCheckbox from 'components/forms/form-checkbox';
import FormLabel from 'components/forms/form-label';
import FormFieldSet from 'components/forms/form-fieldset';
import Tooltip from 'components/tooltip';

class LocalPickupMethod extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			showTooltip: false,
			...props
		};

		this.toggleTooltip = this.toggleTooltip.bind( this );
	}

	toggleTooltip() {
		this.setState( { showTooltip: ! this.state.showTooltip } );
	}

	render() {
		const __ = i18n.translate;

		return (
			<div className="shipping-methods__method-container shipping-methods__local-pickup">
				<FormFieldSet>
					<FormLabel>{ __( 'How much will you charge for local pickup?' ) }</FormLabel>
					<FormCurrencyInput currencySymbolPrefix="$" value={ this.state.price } />
				</FormFieldSet>
				<FormFieldSet>
					<FormCheckbox
						checked={ this.state.taxable }
						className="shipping-methods__local-pickup-taxable" />
					{ __( 'Taxable' ) }
					<span
						className="shipping-methods__local-pickup-taxable-help"
						ref="taxableHelp"
						onMouseEnter={ this.toggleTooltip }
						onMouseLeave={ this.toggleTooltip } >
					<Gridicon icon="help-outline" size={ 18 } />
					</span>
					<Tooltip
						isVisible={ this.state.showTooltip }
						context={ this.refs && this.refs.taxableHelp }
						className="shipping-methods__local-pickup-taxable-tooltip is-dialog-visible"
						position="top">
						{ __( 'Taxable explanation' ) }
					</Tooltip>
				</FormFieldSet>
			</div>
		);
	}
}

export default LocalPickupMethod;
