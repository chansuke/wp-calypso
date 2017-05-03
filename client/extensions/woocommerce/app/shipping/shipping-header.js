/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import SectionHeader from 'components/section-header';

class ShippingHeader extends Component {
	render() {
		const { label, description, children } = this.props;

		const labelContent = (
			<span>
				<p className="shipping__header">{ label }</p>
				<p className="shipping__header-description">{ description }</p>
			</span>
		);

		return (
			<SectionHeader label={ labelContent }>
				{ children }
			</SectionHeader>
		);
	}
}

export default ShippingHeader;
