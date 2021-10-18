<template>
  <div class="header">
    <button class="historyBtn"
      @click="showHistory"
    >
      <img src="../assets/history.png" style="width:25px">
    </button>
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
    @erase-digit="eraseDigit"
    @all-clear-expression="allClearExpression"
    @negate-digit="negateDigit"
  />
  <CalculatorHistory class="keypad"
    v-show="isOpen"
    :calc-history="currentValue"
    @call-express="callExpressByHistory"
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
import { MAX_LENGTH, ERROR_CODE } from "../shared/constants";

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
      findResult,
      negateInputValue,
    } = useCalculate();

    const isOpen = ref(false);
    const calculateExpression = reactive({
      currentValue: '0',
      firstValue: '',
      operator: '',
      secondValue: ''
    });
    const expression = ref(''); // number (+ / - * )

    let changeValueBool = true;
    let equalBool = false;  // = 을 연속으로 누를 시 return => 추후 수정 : currVal이 firstVal로 계산

    const showHistory = () => {
      isOpen.value = !isOpen.value;
    }

    const showEnteredNum = (digit) => {
      if (changeValueBool) {
        calculateExpression.currentValue = '';
        changeValueBool = false;
      }
      //길이 제한
      if (calculateExpression.currentValue.length === MAX_LENGTH) return;

      // 소수점은 하나만 표기
      if (calculateExpression.currentValue.indexOf('.') !== -1 && digit === '.') return;

      // 0.xx 꼴
      if (calculateExpression.currentValue === '' && digit === '.') {
        calculateExpression.currentValue = '0';
      }

      calculateExpression.currentValue += digit;
      equalBool = true;
    };

    const showExpression = (operatorType) => {
      if (ERROR_CODE.includes(calculateExpression.currentValue)) return;

      calculateExpression.operator = operatorType;

      if(operatorType === '*') operatorType = '×';
      else if(operatorType === '/' ) operatorType = '÷';

      calculateExpression.firstValue = calculateExpression.currentValue;
      expression.value = calculateExpression.firstValue + ' ' + operatorType;
      changeValueBool = true;
    };

    const showResultValue = (equal) => {
      if(!equalBool) return;

      calculateExpression.secondValue = calculateExpression.currentValue;
      expression.value += ' ' + calculateExpression.secondValue;

      calculateExpression.currentValue = findResult(expression.value);

      changeValueBool = true;
      equalBool = false;

      if (!ERROR_CODE.includes(calculateExpression.currentValue)) {
        store.commit('separateExpression',
          {
            expression: expression.value,
            resultValue: calculateExpression.currentValue
        });
      }

      expression.value += ' = ';
    };

    const eraseDigit = () => {
      if (calculateExpression.currentValue.length === 1) {
        calculateExpression.currentValue = '0';
        changeValueBool = true;
      } else if(calculateExpression.currentValue !== '0') {
        calculateExpression.currentValue =
          calculateExpression.currentValue.slice(0, calculateExpression.currentValue.length -1);
      }
    };

    const clearEntry = () => {
      if (ERROR_CODE.includes(calculateExpression.currentValue)) {
        allClearExpression();
        return;
      }
      calculateExpression.currentValue = '0';
      changeValueBool = true;
    };

    const allClearExpression = () => {
      calculateExpression.currentValue = '0';
      calculateExpression.firstValue = '';
      calculateExpression.secondValue = '';
      calculateExpression.operator = '';
      expression.value = '';
      changeValueBool = true;
    };

    const callExpressByHistory = (idx) => {
      const historyIndex = store.getters.getHistories.length - idx - 1;
      const historyOfIndex = store.getters.getHistories[historyIndex];

      expression.value = historyOfIndex.expression + ' = ';
      calculateExpression.currentValue = historyOfIndex.resultValue;
      changeValueBool = true;
      isOpen.value = !isOpen.value;
    };

    const negateDigit = () => {
      if(calculateExpression.currentValue === '0') return;
      calculateExpression.currentValue = negateInputValue(calculateExpression.currentValue);
    };

    return {
      isOpen,
      showHistory,

      expression,
      showExpression,
      showEnteredNum,
      showResultValue,
      negateDigit,

      clearEntry,
      eraseDigit,
      allClearExpression,

      callExpressByHistory,

      ...toRefs(calculateExpression),
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