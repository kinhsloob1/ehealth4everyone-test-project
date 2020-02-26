/* eslint-disable no-underscore-dangle */

import { EventEmitter } from "emitter";

class PatientsData extends EventEmitter {
  constructor() {
    super();
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
    try {
      const savedData = JSON.parse(data);
      this._data = savedData;
      this.saveToLocal(data);
      this.emit("data-parsing-success");
      return true;
    } catch (e) {
      this.emit("data-parsing-error");
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
    this.emit("loading");
    const dataPromise = this.hasLocalData() ? this.loadFromLocal() : this.loadFromRemote();

    try {
      const data = await dataPromise;
      this.emit("data-loaded");
      this.data = data;

      return this.data;
    } catch (e) {
      this.emit("error-loading-data");
      throw e;
    }
  }

  /** load from remote static method
   *  accepts void
   *  returns <Promise>
   */
  async loadFromRemote() {
    // post topic data
    const abortController = new AbortController();
    const { url } = this;

    const fetchInit = {
      method: "get",
      cache: "force-cache",
      signal: abortController.signal
    };

    const response = await fetch(url, fetchInit);
    if (response.status !== 200) {
      throw Error("An error has occurred");
    }

    return response.text();
  }

  /** save to local method
   *  accepts String
   *  returns Void
   */
  saveToLocal(data) {
    return window.localStorage.setItem(this.savedKey, data);
  }

  /** load from local method
   *  accepts void | Boolean
   *  returns <Promise> | String
   */
  loadFromLocal(withPromise = true) {
    const data = window.localStorage.getItem(this.savedKey);
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
  chartData() {
    const outData = {};
    const bloodGroups = ["O", "A", "B", "AB", "O+", "A+", "B+", "AB+"];
    const ageGroups = [
      {
        min: 1,
        max: 14,
        pointer: "(1 - 14) years old"
      },
      {
        min: 15,
        max: 30,
        pointer: "(15 - 30) years old"
      },
      {
        min: 31,
        max: 50,
        pointer: "(31 - 50) years old"
      },
      {
        min: 51,
        max: 70,
        pointer: "(51 - 70) years old"
      },
      {
        min: 71,
        max: null,
        pointer: "(> 71) years old"
      }
    ];

    bloodGroups.forEach(bloodGroup => {
      const data = {};

      data.total = 0;
      ageGroups.forEach(({ pointer }) => {
        data[pointer] = 0;
      });

      outData[bloodGroup] = data;
    });

    const patientsData = this.data || [];
    patientsData.forEach(({ age, "blood-groups": patientBloodGroups }) => {
      let ageGroupPointer = null;
      ageGroups.forEach(({ min, max, pointer }) => {
        const maximum = max || Infinity;
        if (age >= min && age <= maximum) {
          ageGroupPointer = pointer;
        }
      });

      bloodGroups.forEach(bloodGroup => {
        const isPatientBloodGroup = patientBloodGroups[bloodGroup];
        if (isPatientBloodGroup) {
          outData[bloodGroup][ageGroupPointer] += 1;
          outData[bloodGroup].total += 1;
        }
      });
    });

    return outData;
  }
}

export default new PatientsData();
