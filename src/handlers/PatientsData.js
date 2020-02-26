/* eslint-disable no-underscore-dangle */

class patientsData {
  constructor() {
    /** data to hold instance patients variable */
    this._data = null;

    /** saved key - pointer to the local offline data */
    this._saved_key = "__patients_data__";

    /** fire base remote url to the data as default */
    this._url = "https://ehealth4eveyone.firebaseio.com/patients.json";
  }

  /** getter to the saved_key instance property
   *  accepts null
   *  returns String
   */
  get savedKey() {
    return this._saved_key;
  }

  /** setter to the saved_key instance property
   *  accepts string
   * r eturns instance
   */
  set savedKey(key) {
    this._saved_key = key;
    return this;
  }

  /** getter to the data instance property
   *  accepts null
   *  returns native javacript object / array
   */
  get data() {
    return this._data;
  }

  /** setter to the data instance property
   *  accepts stringified json object
   *  return Boolean
   */
  set data(data) {
    let savedData;
    try {
      savedData = JSON.parse(data);
      this._data = savedData;
      this.dispatchEvent(new Event("data-parsing-success"));
      return true;
    } catch (e) {
      this.dispatchEvent(new Event("data-parsing-error"));
      return false;
    }
  }

  /** getter to the url instance property
   *  accepts null
   *  return url String
   */
  get url() {
    return this._url;
  }

  /** setter to the url instance property
   *  accepts a url String
   *  returns instance;
   */
  set url(url) {
    this._url = url;
    return this;
  }

  /** load method
   *  accepts void
   *  returns <Promise>
   */
  async load() {
    const dataPromise = this.hasLocalData() ? this.loadFromLocal() : this.loadFromRemote();

    try {
      const data = await dataPromise;
      this.dispatchEvent(new Event("data-loaded"));

      return this.data(data);
    } catch (e) {
      this.dispatchEvent(new Event("error-loading-data"));
      throw e;
    }
  }

  /** load from remote static method
   *  accepts void
   *  returns <Promise>
   */
  static async loadFromRemote() {
    // post topic data
    const abortController = new AbortController();
    const url = this.url();
    const fetchInit = {
      method: "get",
      cache: "force-cache",
      signal: abortController.signal
    };

    const response = await fetch(url, fetchInit);
    if (response.status !== 200) {
      throw Error("An error has occurred");
    }

    return response.json();
  }

  /** load from local method
   *  accepts void | Boolean
   *  returns <Promise> | String
   */
  loadFromLocal(withPromise = true) {
    const data = window.localStorage.getItem(this.savedKey());
    return withPromise ? Promise.resolve(data) : data;
  }

  /** has local method
   *  accepts void
   *  returns Boolean
   */
  hasLocalData() {
    const data = this.loadFromLocal(false);
    return !!data;
  }

  /** getChartData method
   *  accepts void
   *  returns Object | Array
   */
  getChartData() {}
}
