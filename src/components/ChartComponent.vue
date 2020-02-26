<template>
  <div class="container">
    <loader-inner v-if="loadingChart" text="loading chart" />
    <error-inner v-else-if="hasError" :text="chartError" />
    <div :class="['chart-container', { loaded: hasData }]" ref="chartContainer"></div>
  </div>
</template>

<script>
/** include the patient chart initializer */

import LoaderInner from "./LoaderInner.vue";
import ErrorInner from "./ErrorInner.vue";
import chartInitializer from "../handlers/patientsChartInitializer";

/** Get the patients handler */
import patientsData from "../handlers/PatientsData";

export default {
  components: {
    LoaderInner,
    ErrorInner
  },
  data() {
    return {
      data: null,
      error: null,
      chart: null
    };
  },
  mounted() {
    /** Get the reference of the chart container */
    const { chartContainer } = this.$refs;

    patientsData.on("data-parsing-success", () => {
      this.data = patientsData.chartData();

      /** load the chart */
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      chartInitializer(chartContainer, this.chartData);
    });

    patientsData.on("data-parsing-error", () => {
      this.error = "An error occurred while parsing data";
    });

    patientsData.on("loading", () => {
      this.data = null;
    });

    patientsData.on("error-loading-data", () => {
      this.error = "An error occured while fetching chart data";
    });

    patientsData.load();
  },
  computed: {
    chartInstance: {
      set(instance) {
        this.chart = instance;
      },

      get() {
        return this.chart;
      }
    },

    chartData: {
      set(data) {
        this.data = data;
        return this.chartData;
      },

      get() {
        return this.data;
      }
    },

    chartError: {
      set(error) {
        this.error = error;
        return this.chartError;
      },

      get() {
        return this.error;
      }
    },

    hasError() {
      return !!this.chartError;
    },

    hasData() {
      return !!this.chartData;
    },

    loadingChart() {
      return !this.hasData;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  > .chart-container {
    display: none;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &.loaded {
      display: flex;
    }
  }
}
</style>
