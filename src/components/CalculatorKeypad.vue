<template>
  <div class="keypad">
    <div>
      <CalculatorButton type="clear" @click="clearEntry">CE</CalculatorButton>
      <CalculatorButton type="clear">C</CalculatorButton>
      <CalculatorButton type="clear">←</CalculatorButton>
      <!--    <CalculatorButton class="clear backspace"></CalculatorButton>-->
      <CalculatorButton type="operator" @click="addOperator('/')">÷</CalculatorButton>
    </div>

    <div>
      <CalculatorButton v-for="number in ['7', '8', '9']" :key="number" @click="addDigit(number)">
        {{ number }}
      </CalculatorButton>
      <CalculatorButton type="operator" @click="addOperator('*')">×</CalculatorButton>
    </div>

    <div>
      <CalculatorButton v-for="number in ['4', '5', '6']" :key="number" @click="addDigit(number)">
        {{ number }}
      </CalculatorButton>
      <CalculatorButton type="operator" @click="addOperator('-')">－</CalculatorButton>
    </div>

    <div>
      <CalculatorButton v-for="number in ['1', '2', '3']" :key="number" @click="addDigit(number)">
        {{ number }}
      </CalculatorButton>
      <CalculatorButton type="operator" @click="addOperator('+')">＋</CalculatorButton>
    </div>

    <div>
      <CalculatorButton>+/-</CalculatorButton>
      <CalculatorButton :key="0" @click="addDigit('0')">0</CalculatorButton>
      <CalculatorButton @click="addDigit('.')" >.</CalculatorButton>
      <CalculatorButton type="equal" @click="calculateResult('=')" >=</CalculatorButton>
    </div>
  </div>
</template>

<script>
import CalculatorButton from "./CalculatorButton.vue";
import { useKeyboard } from "../composable/useKeyboard";
import { DIGITS, OPERATORS, RESULT_KEYS, CLEAR_KEYS, ERASE_KEYS } from "../shared/constants";

import { onMounted, onBeforeUnmount } from "vue";

export default {
  name: "CalculatorKeypad",
  components: {
    CalculatorButton
  },
  emits: [
    'add-digit',
    'add-operator',
    'show-result',
    'clear-entry',
  ],
  setup(props, { emit }) {
    const keyboard = useKeyboard();

    const addDigit = (digit) => {
      emit('add-digit', digit);
    };

    const addOperator = (operator) => {
      emit('add-operator', operator);
    };

    const calculateResult = (equal) => {
      emit('show-result', equal);
    };

    const clearEntry = () => {
      emit('clear-entry');
    };

    onMounted(() => {
      keyboard.addListener((e) => {
        const key = e.key;

        if (DIGITS.includes(key)) addDigit(key);
        if (OPERATORS.includes(key)) addOperator(key);
        if (RESULT_KEYS.includes(key)) calculateResult(key);
      });

      onBeforeUnmount(() => {
        keyboard.removeAllListeners();
      });

    });

    return {
      addDigit,
      addOperator,
      calculateResult,
      clearEntry,
    };
  }
}
</script>

<style scoped>
  div{
    height: 80px;
    margin: 2px;
  }
</style>