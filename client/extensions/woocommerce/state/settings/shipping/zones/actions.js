/**
 * External dependencies
 */
import { omit, sortBy, first, remove } from 'lodash';

/**
 * Internal dependencies
 */
import {
	WOOCOMMERCE_SHIPPING_METHODS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_METHODS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_SETTINGS_SAVE_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_CANCEL,
	WOOCOMMERCE_SHIPPING_ZONE_CLOSE,
	WOOCOMMERCE_SHIPPING_ZONE_EDIT,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATION_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATION_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_CHANGE_TYPE,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_EDIT,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONES_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONES_FETCH_SUCCESS,
} from '../../../action-types';
import * as api from '../../../helpers/api';
import { getOperationsToSaveZonesSettings } from './selectors';

const removeLinks = ( data ) => omit( data, '_links' );

export const fetchServerData = () => ( dispatch, getState ) => {
	// TODO: Prevent duplicate requests on subsequent fetchServerData calls
	const state = getState();
	api.get( 'shipping/zones', state )
		.then( ( zones ) => {
			dispatch( {
				type: WOOCOMMERCE_SHIPPING_ZONES_FETCH_SUCCESS,
				zones: removeLinks( zones ),
			} );
			zones.forEach( ( { id } ) => {
				if ( id ) { // No need to fetch locations from "Rest of the world" zone (id=0)
					api.get( `shipping/zones/${ id }/locations`, state )
						.then( ( locations ) => dispatch( {
							type: WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_SUCCESS,
							id,
							locations: removeLinks( locations ),
						} ) )
						.catch( ( error ) => dispatch( { type: WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_ERROR, error } ) );
				}
				api.get( `shipping/zones/${ id }/methods`, state )
					.then( ( methods ) => dispatch( {
						type: WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_SUCCESS,
						id,
						methods: removeLinks( methods ),
					} ) )
					.catch( ( error ) => dispatch( { type: WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_ERROR, error } ) );
			} );
		} )
		.catch( ( error ) => dispatch( { type: WOOCOMMERCE_SHIPPING_ZONES_FETCH_ERROR, error } ) );
	api.get( 'shipping_methods', state )
		.then( ( methods ) => dispatch( {
			type: WOOCOMMERCE_SHIPPING_METHODS_FETCH_SUCCESS,
			methods: removeLinks( methods ),
		} ) )
		.catch( ( error ) => dispatch( { type: WOOCOMMERCE_SHIPPING_METHODS_FETCH_ERROR, error } ) );
};

const getApiRequest = ( action, payload, id, zoneId, state ) => {
	switch ( action ) {
		case 'add_method':
			return api.post( `shipping/zones/${ zoneId }/methods`, payload, state );
		case 'update_method':
			return api.put( `shipping/zones/${ zoneId }/methods/${ id }`, payload, state );
		case 'delete_method':
			return api.del( `shipping/zones/${ zoneId }/methods/${ id }`, state );
		case 'update_locations':
			return api.put( `shipping/zones/${ zoneId }/locations`, payload, state );
		case 'add_zone':
			return api.post( 'shipping/zones', payload, state );
		case 'update_zone':
			return api.put( `shipping/zones/${ zoneId }`, payload, state );
		case 'delete_zone':
			return api.del( `shipping/zones/${ zoneId }`, state );
		default:
			throw new Error( 'Unrecognized action "' + action + '"' );
	}
};

const runOperations = ( operations, state ) => {
	return Promise.all( operations.map( ( { action, payload, id, zoneId, subOperations } ) => {
		const request = getApiRequest( action, payload, id, zoneId, state );
		return request.then( ( result ) => {
			if ( ! operations ) {
				return;
			}
			return Promise.all( subOperations.map( ( subOperationFunc ) => {
				return runOperations( subOperationFunc( result.id || result.instance_id ), state );
			} ) );
		} );
	} ) );
};

export const submitChanges = () => ( dispatch, getState ) => {
	// TODO: Put individual errors in the state so they can be displayed in the UI
	// TODO: Update the serverZones state tree with each success response so it always reflect the server state
	const state = getState();
	runOperations( getOperationsToSaveZonesSettings( state ), state )
	// TODO: Show some kind of success notice
	// TODO: This only saves the zone settings, not the entire page
		.then( () => dispatch( { type: WOOCOMMERCE_SHIPPING_SETTINGS_SAVE_SUCCESS } ) );
};

export const addShippingZone = () => ( { type: WOOCOMMERCE_SHIPPING_ZONE_ADD } );

export const editShippingZone = ( index ) => ( { type: WOOCOMMERCE_SHIPPING_ZONE_EDIT, index } );

export const cancelEditingShippingZone = () => ( { type: WOOCOMMERCE_SHIPPING_ZONE_CANCEL } );

export const closeEditingShippingZone = () => ( { type: WOOCOMMERCE_SHIPPING_ZONE_CLOSE } );

export const removeShippingZone = ( index ) => ( { type: WOOCOMMERCE_SHIPPING_ZONE_REMOVE, index } );

export const addLocationToShippingZone = ( locationType, locationCode ) => ( {
	type: WOOCOMMERCE_SHIPPING_ZONE_LOCATION_ADD,
	locationType,
	locationCode
} );

export const removeLocationFromShippingZone = ( locationType, locationCode ) => ( {
	type: WOOCOMMERCE_SHIPPING_ZONE_LOCATION_REMOVE,
	locationType,
	locationCode
} );

export const addShippingMethod = () => ( { type: WOOCOMMERCE_SHIPPING_ZONE_METHOD_ADD } );

export const changeShippingMethodType = ( index, newType ) => ( { type: WOOCOMMERCE_SHIPPING_ZONE_METHOD_CHANGE_TYPE, index, newType } );

export const editShippingMethod = ( index, field, value ) => ( { type: WOOCOMMERCE_SHIPPING_ZONE_METHOD_EDIT, index, field, value } );

export const removeShippingMethod = ( index ) => ( { type: WOOCOMMERCE_SHIPPING_ZONE_METHOD_REMOVE, index } );
