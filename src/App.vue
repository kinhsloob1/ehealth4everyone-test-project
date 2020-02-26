<template>
  <div id="app">
    <chart-component />
  </div>
</template>

<script>
import ChartComponent from "./components/ChartComponent.vue";

export default {
  name: "App",
  components: {
    ChartComponent
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  border: 1px solid rgb(180, 180, 180);
  box-shadow: 2px 2px 4px rgb(59, 59, 59);
  width: 100%;
  height: 100vh;

  @media only screen and (min-width: 450px) {
    width: 90%;
    margin-right: auto;
    margin-left: auto;
  }

  @media only screen and (min-width: 760px) {
    width: 80%;
  }

  @media only screen and (min-width: 1024px) {
    width: 70%;
  }
}
</style>
