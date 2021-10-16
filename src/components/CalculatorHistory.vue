<template>
<div class="history">

  <div class="previous"
       v-for="(history, idx) in histories.slice().reverse()"
       :key="history.historyIndex"
       @mousedown.right = "mouseRight(idx)"
       @mouseover = "mouseoverEraseActive"
       @mouseleave = "mouseleaveEraseActive"
       @click = "callExpression(idx)"
  >
    <div class="operation">
      {{ history.expression }} =
    </div>

    <div class="currentValue">
      {{ history.resultValue }}
    </div>
  </div>

  <div class="trash">
    <span v-show="histories.length === 0">아직 기록이 없음</span>
    <button class="trashBtn"
            @click="clearHistories"
            v-show="histories.length > 0"
    >
      <img src="../assets/trash.png" style="width:20px">
    </button>
  </div>
</div>


</template>

<script>
import CalculatorButton from "./CalculatorButton.vue";

import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "CalculatorHistory",
  props: {
    calcHistory: {
      type: String,
      default: '',
    }
  },
  emits: [
    'call-express'
  ],
  setup(props, { emit }) {
    const store = useStore();
    const histories = computed(() => store.getters.getHistories );
    let eraseActive = ref(false);

    const mouseoverEraseActive = () => {
      eraseActive.value = true;
    };

    const mouseleaveEraseActive = () => {
      eraseActive.value = false;
    }

    const clearHistories = () => {
      store.commit('allClearHistories');
    };

    const mouseRight = (idx) => {
      store.commit('clearHistoryByIndex', histories.value.length - idx - 1);
    };

    const callExpression = (idx) => {
      emit('call-express', idx);
    };

    return {
      eraseActive,
      mouseoverEraseActive,
      mouseleaveEraseActive,

      histories,
      clearHistories,
      mouseRight,
      callExpression,
    }
  }
}
</script>

<style scoped>
.history {
  background-color: black;
  color:white;
  text-align: right;
}
.previous {
  padding: 15px;
  margin: 10px 0px;
}

.operation {
  font-size: 1rem;
}

.currentValue {
  font-size: 2rem;
}

.previous:hover {
  background-color: dimgray;
}

.trash {
  z-index: 999;
}

.trashBtn {
  background-color: black;
  border: none;
}

.trashBtn:hover {
  background-color: dimgray;
}

.previous .eraseBtn {
  float: left;
  background-color: dimgray;
  border: none;
}

</style>