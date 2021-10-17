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

import {ref, reactive, toRefs, onMounted} from "vue";
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
      negateInputValue
    } = useCalculate();

    const isOpen = ref(false);
    const computeExpression = reactive({
      currentValue: '0',
      firstValue: '',
      operator: '',
      secondValue: ''
    });
    const expression = ref(''); // number (+ / - * )

    let changeValueBool = true;
    let changeOperatorBool = false; // = 를 눌러 결과값 도출 후 숫자 입력 시 expression 초기화
    let equalBool = false;  // = 을 연속으로 누를 시 return => 추후 수정 : currVal이 firstVal로 계산

    const showHistory = () => {
      isOpen.value = !isOpen.value;
    }

    const showEnteredNum = (digit) => {
      if (changeValueBool) {
        computeExpression.currentValue = '';
        changeValueBool = false;
      }
      //길이 제한
      if (computeExpression.currentValue.length === MAX_LENGTH) return;

      // 소수점은 하나만 표기
      if (computeExpression.currentValue.indexOf('.') !== -1 && digit === '.') return;

      // 0.xx 꼴
      if (computeExpression.currentValue === '' && digit === '.') {
        computeExpression.currentValue = '0';
      }

      computeExpression.currentValue += digit;

      if (changeOperatorBool) {
        expression.value = '';
        changeOperatorBool = false;
      }

      equalBool = true;
    };

    const showExpression = (operatorType) => {
      if (ERROR_CODE.includes(computeExpression.currentValue)) return;

      computeExpression.operator = operatorType;

      /*
      if(operatorType === '*') operatorType = '×';
      else if(operatorType === '/' ) operatorType = '÷';
      */

      computeExpression.firstValue = computeExpression.currentValue;

      expression.value = computeExpression.firstValue + ' ' + operatorType;
      changeValueBool = true;
    };

    const showResultValue = (equal) => {
      if(!equalBool) return;
      computeExpression.secondValue = computeExpression.currentValue;
      expression.value += ' ' + computeExpression.secondValue;

      computeExpression.currentValue = findResult(expression.value);

      expression.value += ' '+ equal ;
      changeValueBool = true;
      changeOperatorBool = true;
      equalBool = false;

      if (!ERROR_CODE.includes(computeExpression.currentValue)) {
        store.commit('separateExpression', expression.value + computeExpression.currentValue);
      }
    };

    const eraseDigit = () => {
      computeExpression.currentValue =
        computeExpression.currentValue.slice(0, computeExpression.currentValue.length -1);
    };

    const clearEntry = () => {
      if (ERROR_CODE.includes(computeExpression.currentValue)) {
        allClearExpression();
        return;
      }
      computeExpression.currentValue = '0';
      changeValueBool = true;
    };

    const allClearExpression = () => {
      computeExpression.currentValue = '0';
      computeExpression.firstValue = '';
      computeExpression.secondValue = '';
      computeExpression.operator = '';
      expression.value = '';
      changeValueBool = true;
    };

    const callExpressByHistory = (idx) => {
      const historyIndex = store.getters.getHistories.length - idx - 1;
      const historyOfIndex = store.getters.getHistories[historyIndex];

      expression.value = historyOfIndex.expression + ' = ';
      computeExpression.currentValue = historyOfIndex.resultValue;
      changeValueBool = true;
      isOpen.value = !isOpen.value;
    };

    const negateDigit = () => {
      if(computeExpression.currentValue === '0') return;
      computeExpression.currentValue = negateInputValue(computeExpression.currentValue);
    };

    return {
      isOpen,
      showHistory,

      expression,
      showExpression,

      ...toRefs(computeExpression),
      showEnteredNum,

      showResultValue,

      clearEntry,
      eraseDigit,
      allClearExpression,

      callExpressByHistory,
      negateDigit,
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