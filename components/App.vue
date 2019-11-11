<template>
  <div>
    <h1>App</h1>
    <Counter />
  </div>
</template>

<script>
import Counter from "./Counter.vue";
export default {
  name: "App",
  components: {
    Counter
  }
};
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}
body {
  box-sizing: border-box;
  font-family: sans-serif;
}
</style>