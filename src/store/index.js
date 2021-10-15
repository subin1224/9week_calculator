import { createStore } from 'vuex'

export default createStore({
  state: {
    historiesIndex: 0,
    histories: [],
  },
  getters: {
    getHistories(state){
      return state.histories;
    }

  },
  mutations: {
    separateExpression(state, payload) {
      //state 배열에서 하나를 가지고 = 의 위치를 찾아서 분리 -> = 까지의 문자열
      state.histories.push({
        'historyIndex' : state.historiesIndex,
        'expression' : payload.split('=')[0],
        'resultValue' : payload.split('=')[1]
      });

      state.historiesIndex++;
    },
    allClearHistories(state) {
      state.histories = [];
      state.historiesIndex = 0;
    },
    clearHistoryByIndex(state, payload) {
      state.histories.splice(payload, 1);
    }

  }
})
