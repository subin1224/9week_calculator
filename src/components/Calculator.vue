<template>
  <div class="header">
    <button class="historyBtn" @click="showHistory"><img src="../assets/history.png" style="width:25px"></button>
  </div>

  <CalculatorDisplay class="display"
    :current-value="currentValue"
    :current-expression="expression"
  />

  <CalculatorKeypad class="keypad"
    v-show="!isOpen"
    @add-digit="showEnteredNum"
    @add-operator="showExpression"
    @show-result="showResultValue"
    @clear-entry="clearEntry"
  />
  <CalculatorHistory class="keypad"
    v-show="isOpen"
    :calc-history="currentValue"
    @contextmenu.prevent
  />
</template>

<script>
import CalculatorDisplay from "./CalculatorDisplay.vue";
import CalculatorKeypad from "./CalculatorKeypad.vue";
import CalculatorHistory from "./CalculatorHistory.vue";

import { ref, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { useCalculate } from "../composable/useCalculate";
import { MAX_LENGTH } from "../shared/constants";

export default {
  name: "Calculator",
  components: {
    CalculatorKeypad,
    CalculatorDisplay,
    CalculatorHistory,
  },
  setup() {
    const store = useStore();
    const {
      findResult
    } = useCalculate();

    const isOpen = ref(false);
    const showHistory = () => {
      isOpen.value = !isOpen.value;
    }

    let changeBool = true;
    const computeExpression = reactive({
      currentValue: '0',
      firstValue: '',
      operator: '',
      secondValue: ''
    });

    const showEnteredNum = (digit) => {
      if(changeBool) {
        computeExpression.currentValue = '';
        changeBool = false;
      }
      if(computeExpression.currentValue.length === MAX_LENGTH) return;
      computeExpression.currentValue += digit;
    }

    const expression = ref(''); // number (+ / - * )
    const showExpression = (operatorType) => {
      computeExpression.operator = operatorType;

      /*
      if(operatorType === '*') operatorType = '×';
      else if(operatorType === '/' ) operatorType = '÷';
      */

      computeExpression.firstValue = computeExpression.currentValue;

      expression.value = computeExpression.firstValue + ' ' + operatorType;
      changeBool = true;
    }

    const showResultValue = (equal) => {
      computeExpression.secondValue = computeExpression.currentValue;
      expression.value += ' ' + computeExpression.secondValue;
      computeExpression.currentValue = findResult(expression.value);

      expression.value += ' '+ equal ;
      changeBool = true;

      store.commit('separateExpression', expression.value + computeExpression.currentValue);
    }

    const clearEntry = () => {
      computeExpression.currentValue = '0';
      changeBool = true;
    }

    return {
      isOpen,
      showHistory,

      expression,
      showExpression,

      ...toRefs(computeExpression),
      showEnteredNum,

      showResultValue,

      clearEntry,
    };
  }
}
</script>

<style>
html, body {
  background-color: gray;
}

.header {
  text-align: right;
  padding-right: 15px;
  background-color: gray;
  border: none;
}

.historyBtn {
  background-color: gray;
  border: none;
}

.historyBtn:hover {
  background-color: silver;
}


</style>