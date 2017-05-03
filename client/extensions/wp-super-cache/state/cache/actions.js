/**
 * Internal dependencies
 */
import wp from 'lib/wp';
import {
	WP_SUPER_CACHE_DELETE_CACHE,
	WP_SUPER_CACHE_DELETE_CACHE_FAILURE,
	WP_SUPER_CACHE_DELETE_CACHE_SUCCESS,
	WP_SUPER_CACHE_PRELOAD_CACHE,
	WP_SUPER_CACHE_PRELOAD_CACHE_FAILURE,
	WP_SUPER_CACHE_PRELOAD_CACHE_SUCCESS,
	WP_SUPER_CACHE_RECEIVE_TEST_CACHE_RESULTS,
	WP_SUPER_CACHE_TEST_CACHE,
	WP_SUPER_CACHE_TEST_CACHE_FAILURE,
	WP_SUPER_CACHE_TEST_CACHE_SUCCESS,
} from '../action-types';

/**
 * Returns an action object to be used in signalling that cache test results have been received.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} results Cache test results object
 * @return {Object} Action object
 */
export const receiveResults = ( siteId, results ) => ( { type: WP_SUPER_CACHE_RECEIVE_TEST_CACHE_RESULTS, siteId, results } );

/*
 * Tests the cache for a site.
 *
 * @param  {Number} siteId Site ID
 * @param  {Boolean} httpOnly Whether to send non-secure requests for the homepage
 * @returns {Function} Action thunk that tests the cache for a given site
 */
export const testCache = ( siteId, httpOnly ) => {
	return ( dispatch ) => {
		dispatch( {
			type: WP_SUPER_CACHE_TEST_CACHE,
			siteId,
		} );

		return wp.req.post(
			{ path: `/jetpack-blogs/${ siteId }/rest-api/` },
			{ path: '/wp-super-cache/v1/cache/test', body: JSON.stringify( { httponly: httpOnly } ), json: true } )
			.then( ( { data } ) => {
				dispatch( receiveResults( siteId, data ) );
				dispatch( {
					type: WP_SUPER_CACHE_TEST_CACHE_SUCCESS,
					siteId,
				} );
			} )
			.catch( () => {
				dispatch( {
					type: WP_SUPER_CACHE_TEST_CACHE_FAILURE,
					siteId,
				} );
			} );
	};
};

/*
 * Deletes the cache for a site.
 *
 * @param  {Number} siteId Site ID
 * @returns {Function} Action thunk that deletes the cache for a given site
 */
export const deleteCache = ( siteId, deleteAll ) => {
	return ( dispatch ) => {
		dispatch( {
			type: WP_SUPER_CACHE_DELETE_CACHE,
			siteId,
		} );

		return wp.req.post(
			{ path: `/jetpack-blogs/${ siteId }/rest-api/` },
			{ path: '/wp-super-cache/v1/cache', body: JSON.stringify( { all: deleteAll } ), json: true } )
			.then( () => {
				dispatch( {
					type: WP_SUPER_CACHE_DELETE_CACHE_SUCCESS,
					siteId,
				} );
			} )
			.catch( () => {
				dispatch( {
					type: WP_SUPER_CACHE_DELETE_CACHE_FAILURE,
					siteId,
				} );
			} );
	};
};

/*
 * Preloads the cache for a site.
 *
 * @param  {Number} siteId Site ID
 * @param  {Boolean} cancelPreload Whether to cancel the preload
 * @returns {Function} Action thunk that preloads the cache for a given site
 */
export const preloadCache = ( siteId, cancelPreload ) => {
	return ( dispatch ) => {
		dispatch( {
			type: WP_SUPER_CACHE_PRELOAD_CACHE,
			siteId,
		} );

		return wp.req.post(
			{ path: `/jetpack-blogs/${ siteId }/rest-api/` },
			{ path: '/wp-super-cache/v1/preload', body: JSON.stringify( { enable: ! cancelPreload } ), json: true } )
			.then( ( { data } ) => {
				dispatch( receiveResults( siteId, data ) );
				dispatch( {
					type: WP_SUPER_CACHE_PRELOAD_CACHE_SUCCESS,
					siteId,
				} );
			} )
			.catch( () => {
				dispatch( {
					type: WP_SUPER_CACHE_PRELOAD_CACHE_FAILURE,
					siteId,
				} );
			} );
	};
};
