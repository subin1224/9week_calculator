<template>
  <button class="btn"
    :class="classes"
    :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>

export default{
  name: "CalculatorButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'number',
      validator: val => ['number', 'clear', 'operator', 'history', 'equal', 'trash'].includes(val)
    }
  },
  setup(props) {
    return { classes : props.type }
  }
}
</script>

<style scoped>
.btn {
  color: white;
  text-align: center;
  display: inline-block;
  width: 24%;
  height: 98%;
  border: none;
  font-size: 1.5rem;
  margin-right: 2px;
}

.btn:hover{
  opacity: 0.5;
}

.number {
  background-color: black;
}

.clear, .operator, .history {
  background-color: #4a4a4a;
}

.equal {
  background-color: #2648a4;
}

.trash:hover {
  background-color: dimgray;
}

.backspace {
  background-image: url("../assets/backspace.png");
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 0px;
}
</style>