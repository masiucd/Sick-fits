<template>
  <div>
    <h1>
      You clicked
      <span>{{num}}</span> times
    </h1>
    <button @click="add">Increment</button>
    <button @click="dec" :disabled="num === 0">Decerement</button>
  </div>
</template>

<script>
import methods from "methods";
export default {
  name: "Counter",
  data() {
    return {
      num: 0,
      term: false
    };
  },
  methods: {
    add() {
      this.num = this.num + 1;
    },
    dec() {
      this.num = this.num - 1;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
}
span {
  color: steelblue;
}
</style>