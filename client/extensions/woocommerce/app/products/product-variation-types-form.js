/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import i18n from 'i18n-calypso';
import { find, debounce } from 'lodash';

/**
 * Internal dependencies
 */
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import Button from 'components/button';
import TokenField from 'components/token-field';

export default class ProductVariationTypesForm extends Component {

	static propTypes = {
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
			type: PropTypes.string.isRequired,
			name: PropTypes.string,
			attributes: PropTypes.array,
		} ),
		editProductAttribute: PropTypes.func.isRequired,
	};

	componentWillMount() {
		const { product } = this.props;

		if ( ! product.attributes ) {
			this.addType();
		}

		this.debouncedUpdateName = debounce( this.updateName, 300 );
	}

	constructor( props ) {
		super( props );

		this.state = {
			attributeNames: [],
		};

		this.addType = this.addType.bind( this );
		this.updateNameHandler = this.updateNameHandler.bind( this );
		this.updateValues = this.updateValues.bind( this );
	}

	getNewFields() {
		return {
			name: '',
			options: [],
			variation: true,
		};
	}

	addType() {
		const { product, editProductAttribute } = this.props;
		editProductAttribute( product, null, this.getNewFields() );
	}

	updateNameHandler( e ) {
		const attributeNames = [ ...this.state.attributeNames ];
		attributeNames[ e.target.id ] = e.target.value;
		this.setState( { attributeNames } );
		this.debouncedUpdateName( e.target.id, e.target.value );
	}

	updateName( attributeId, name ) {
		const { product, editProductAttribute } = this.props;
		const attribute = product.attributes && find( product.attributes, function( a ) {
			return a.uid === attributeId;
		} );
		editProductAttribute( product, attribute, { name } );
	}

	updateValues( values, attribute ) {
		const { product, editProductAttribute } = this.props;
		editProductAttribute( product, attribute, { options: values } );
	}

	renderInputs( attribute ) {
		const { attributeNames } = this.state;
		const attributeName = attributeNames && attributeNames[ attribute.uid ] || attribute.name;
		return (
			<div key={ attribute.uid } className="products__variation-types-form-fieldset">
				<FormTextInput
					placeholder={ i18n.translate( 'Color' ) }
					value={ attributeName }
					id={ attribute.uid }
					name="type"
					className="products__variation-types-form-field"
					onChange={ this.updateNameHandler }
				/>
				<TokenField
					placeholder={ i18n.translate( 'Comma separate these' ) }
					value={ attribute.options }
					name="values"
					/* eslint-disable react/jsx-no-bind */
					onChange={ ( values ) => this.updateValues( values, attribute ) }
				/>
			</div>
		);
	}

	render() {
		const { product } = this.props;
		const { attributes } = product;
		const variationTypes = ( attributes && attributes.filter( attribute => attribute.variation ) ) || [];
		const inputs = variationTypes.map( this.renderInputs, this );

		return (
			<div className="products__variation-types-form-wrapper">
				<strong>{ i18n.translate( 'Variation types' ) }</strong>
				<p>
					{ i18n.translate(
						'Let\'s add some variations! A common {{em}}variation type{{/em}} is color. ' +
						'The {{em}}values{{/em}} would be the colors the product is available in.',
						{ components: { em: <em /> } }
					) }
				</p>

				<div className="products__variation-types-form-group">
					<div className="products__variation-types-form-labels">
						<FormLabel className="products__variation-types-form-label">{ i18n.translate( 'Variation type' ) }</FormLabel>
						<FormLabel>{ i18n.translate( 'Variation values' ) }</FormLabel>
					</div>
					{inputs}
				</div>

				<Button onClick={ this.addType }>{ i18n.translate( 'Add another variation' ) }</Button>
		</div>
		);
	}

}
