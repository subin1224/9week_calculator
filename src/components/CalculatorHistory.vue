<template>
<div class="history">

  <div class="previous"
       @mousedown.right = "mouseRight(idx)"
       @mouseover = "mouseoverEraseActive"
       @mouseleave = "mouseleaveEraseActive"
       v-for="(history, idx) in histories.slice().reverse()"
       :key="history.historyIndex"
  >
    <div class="operation">
      {{ history.expression }} =
    </div>

    <CalculatorButton class="eraseBtn"
      type="trash"
      v-show="eraseActive"
    >
      <img src="../assets/trash.png" style="width:20px">
    </CalculatorButton>

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
  components: {
    CalculatorButton,
  },
  props: {
    calcHistory: {
      type: String,
      default: '',
    }
  },
  setup() {
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

    return {
      eraseActive,
      mouseoverEraseActive,
      mouseleaveEraseActive,

      histories,
      clearHistories,
      mouseRight,
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