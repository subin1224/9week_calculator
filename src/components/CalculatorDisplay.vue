<template>
  <div class="display">

    <span class="expression">
      {{ $props.currentExpression }}
    </span>

    <span class="currentValue">
      {{ displayValue }}
    </span>
  </div>

</template>

<script>
import { useCalculate } from "../composable/useCalculate";
import { computed } from "vue";

export default {
  name: "CalculatorDisplay",
  props: {
    currentValue: {
      type: String,
      default: ''
    },
    currentExpression: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const {
      addComma
    } = useCalculate();

    const displayValue = computed(() => addComma(props.currentValue));

    return {
      displayValue,
    };
  }
}
</script>

<style scoped>
.display {
  color: white;
  text-align: right;
  padding-right: 15px;
}

.expression {
  font-size:  1.5rem;
  display: block;
}

.currentValue {
  font-size: 3rem;
}

</style>