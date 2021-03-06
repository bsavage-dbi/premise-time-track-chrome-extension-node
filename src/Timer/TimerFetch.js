import PTT from '../PTT';
import $ from 'jquery';

class TimerFetch {

  _defaultParams() {
    let _params = '?per_page=100';

    _params += PTT.get('user').id
    ? '&author=' + PTT.get('user').id
    : '';

    return _params;
  }

  /**
   * Retrieve a taxonomy from premise time tracker.
   *
   * @param  {String}   slug     the taxonomy slug (wihtout 'premise_time_tracker_')
   * @param  {Function} callback a callback to be called with the taxonomy found
   * @return {Void}              does not return anything. call the callbcak passed.
   */
  loadTaxonomy( slug, callback ) {
    slug = slug || null;

    if ( ! slug ) return false;

    fetch( PTT.get( 'endpoint' )
      + '_' + slug
      + '/'
      + this._defaultParams() )
    .then( response => {
      response.json()
      .then( _terms => {
        callback( _terms );
      });
    });
  }

  /**
   * Retrieve a taxonomy from premise time tracker.
   *
   * @param  {String} slug the taxonomy slug (wihtout 'premise_time_tracker_')
   * @return {Promise}     Promise for the taxonomy object
   */
  getTaxonomy( slug ) {
    slug = slug || null;

    if ( ! slug ) return false;

    const url = PTT.get( 'endpoint' )
    + '_' + slug
    + this._defaultParams();

    // console.log(url);

    const tax = fetch( url )
    .then( response => {
      return response.json();
    });

    return tax;
  }

  /**
   * Search timers.
   *
   * @param  {String}  Search term.
   * @return {Promise} Promise for the results object
   */
  searchTimers( searchTerm ) {
    searchTerm = searchTerm || null;

    if ( ! searchTerm ) return false;

    const url = PTT.get( 'endpoint' )
    + this._defaultParams()
    + '&search='
    + encodeURIComponent( searchTerm );

    // console.log(url);

    const results = fetch( url )
    .then( response => {
      return response.json();
    });

    return results;
  }

  /**
   * Get timers by term.
   *
   * @param  {Integer}  Term ID.
   * @param  {String}  Taxonomy.
   * @return {Promise} Promise for the timers object
   */
  getTimersByTerm( termId, taxonomy ) {
    taxonomy = taxonomy || null;

    if ( ! termId ) return false;
    if ( ! taxonomy ) return false;

    const url = this.timersByTermUrl( termId, taxonomy );

    // console.log(url);

    const timers = fetch( url )
    .then( response => {
      return response.json();
    });

    return timers;
  }

  /**
   * Get timers by term URL.
   *
   * @param  {Integer}  Term ID.
   * @param  {String}  Taxonomy.
   * @return {String}  Wordpress API URL.
   */
  timersByTermUrl( termId, taxonomy ) {
    taxonomy = 'premise_time_tracker_' + taxonomy;

    return PTT.get( 'endpoint' )
    + this._defaultParams()
    + '&'
    + encodeURIComponent( taxonomy )
    + '[]=' + encodeURIComponent( termId );
  }

  /**
   * Get timers by term, filtered by date.
   *
   * @param  {Integer}  Term ID.
   * @param  {String}   Taxonomy.
   * @param  {String}   Timers before date (ISO8601 compliant date).
   * @param  {String}   Timers before date (ISO8601 compliant date).
   * @return {Promise}  Promise for the timers object
   */
  getTimersByTermFilterByDate( termId, taxonomy, before, after ) {
    taxonomy = taxonomy || null;

    if ( ! termId ) return false;
    if ( ! taxonomy ) return false;

    if ( ! before && ! after ) {
      return this.getTimersByTerm( termId, taxonomy );
    }

    let url = this.timersByTermUrl( termId, taxonomy );

    if ( after ) {
      url += '&after=' + encodeURIComponent( after );
    }

    if ( before ) {
      url += '&before=' + encodeURIComponent( before );
    }

    console.log(url);

    const timers = fetch( url )
    .then( response => {
      return response.json();
    });

    return timers;
  }

  /**
   * Retrieve a post from premise time tracker.
   *
   * @param  {Integer} id      the id for the post we want to retrieve
   * @param  {Object}  options params to add to the query as a javascript object
   * @return {Object}          the post object for the post found.
   */
  getPost( id, options ) {
    id = id || null;
    options = options || null;

    if ( ! id ) return false;

    let _url = PTT.get( 'endpoint' )
    + '/' + id;

    // Parse options as params.
    // BETA not fully tested
    if ( options ) {
      var _options = '';
      for ( var i in options ) {
        if ( options.hasOwnProperty( i ) ) {
          _options += '&' + i + '=' + options[i];
        }
      }
      _url += '?' + _options + '/';
    }

    // Fetch the post and return promise.
    return fetch( _url )
    .then( response => {
      return response.json();
    });
  }

  otherEndpoint( endpoint ) {
    const url = PTT.get( 'site' ).url
    + '/wp-json/'
    + endpoint;

    return $.ajax({
        method: 'GET',
        beforeSend: PTT.get( 'auth' ).ajaxBeforeSend,
        url: url,
    });
  }
}

// Export new singleton class!
// http://stackoverflow.com/questions/33550380/react-flux-dispatcher-as-singleton-in-typescript#34377957
export default new TimerFetch();
