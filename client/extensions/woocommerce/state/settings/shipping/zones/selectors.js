/**
 * External dependencies
 */
import { get, remove, keyBy, omit, flatten, isEqual, xorBy, pick } from 'lodash';

const getOperationsToUpdateMethod = ( method, serverMethod, zoneId ) => ( instanceId ) => {
	if ( ! method ) {
		return [ {
			action: 'delete_method',
			zoneId,
			id: instanceId,
		} ];
	}

	if ( ! serverMethod || ! isEqual( method, serverMethod ) ) {
		return [ {
			action: 'update_method',
			zoneId,
			id: instanceId,
			payload: {
				...pick( method, [ 'enabled', 'order' ] ),
				settings: omit( method, [ 'id', 'enabled', 'order', 'method_id' ] ),
			},
		} ];
	}
};

const getOperationsToAddMethod = ( method, zoneId ) => {
	return [ {
		action: 'add_method',
		zoneId,
		payload: pick( method, 'method_id' ),
		subOperations: [
			getOperationsToUpdateMethod( method, null, zoneId ),
		],
	} ];
};

const getOperationsToUpdateMethods = ( methods, serverMethods ) => ( zoneId ) => {
	methods = [ ...methods ];
	const newMethods = remove( methods, { id: null } );
	methods = keyBy( methods, 'id' );

	return [
		...flatten( newMethods.map( ( method ) => getOperationsToAddMethod( method, zoneId ) ) ),
		...flatten( serverMethods.map( ( serverMethod ) =>
			getOperationsToUpdateMethod( methods[ serverMethod.id ], serverMethod, zoneId )( serverMethod.id ) )
		),
	];
};

const getOperationsToUpdateLocations = ( locations, serverLocations ) => ( zoneId ) => {
	if ( ! xorBy( locations, serverLocations, isEqual ).length ) {
		return [];
	}
	return [ {
		action: 'update_locations',
		payload: locations,
		zoneId,
	} ];
};

const getOperationsToUpdateZone = ( zone, serverZone ) => {
	if ( ! zone ) {
		return [ {
			action: 'delete_zone',
			zoneId: serverZone.id,
		} ];
	}

	if ( ! serverZone ) {
		return [ {
			action: 'add_zone',
			payload: omit( zone, [ 'id', 'locations', 'methods' ] ),
			subOperations: [
				getOperationsToUpdateMethods( zone.methods, null ),
				getOperationsToUpdateLocations( zone.locations, null ),
			],
		} ];
	}

	const operations = [];
	const zoneInfo = omit( zone, [ 'locations', 'methods' ] );
	const serverZoneInfo = omit( serverZone, [ 'locations', 'methods' ] );
	if ( ! isEqual( zoneInfo, serverZoneInfo ) ) {
		operations.push( {
			action: 'update_zone',
			zoneId: zone.id,
			payload: zoneInfo,
		} );
	}

	return [ ...operations,
		...getOperationsToUpdateMethods( zone.methods, serverZone.methods )( zone.id ),
		...getOperationsToUpdateLocations( zone.locations, serverZone.locations )( zone.id ),
	];
};

export const getOperationsToSaveZonesSettings = ( state ) => {
	const data = get( state, [ 'extensions', 'woocommerce', 'settings', 'shipping', 'zones' ] );
	let zones = [ ...data.zones ];
	const serverZones = [ ...data.serverZones ];
	const restOfWorldServerZone = remove( serverZones, { id: 0 } )[ 0 ];
	const restOfWorldZone = remove( zones, { id: 0 } )[ 0 ];
	if ( ! restOfWorldServerZone ) {
		throw new Error( 'The server didn\'t provide a "Rest Of The World" shipping zone' );
	}
	if ( ! restOfWorldZone ) {
		throw new Error( 'The "Rest Of The World" shipping zone has been deleted' );
	}
	const newZones = remove( zones, { id: null } );
	zones = keyBy( zones, 'id' );

	return [
		...flatten( newZones.map( ( zone ) => getOperationsToUpdateZone( zone, null ) ) ),
		...flatten( serverZones.map( ( serverZone ) => getOperationsToUpdateZone( zones[ serverZone.id ], serverZone ) ) ),
		// "Rest of the world" zone can't have custom name or locations, so only look at their differences in methods
		...getOperationsToUpdateMethods( restOfWorldZone.methods, restOfWorldServerZone.methods )( 0 ),
	];
};
