# 계산기 만들기

> Vue3 를 이용하여 계산기 만들기
---
<br>

## 폴더 구조
```
├── src
│   ├── components
│   │   ├── Calculator.vue
│   │   ├── CalculatorButton.vue
│   │   ├── CalculatorDisplay.vue
│   │   ├── CalculatorHistory.vue
│   │   └── CalculatorKeypad.vue
│   │
│   ├── compositions
│   │   ├── useCalculate.js
│   │   └── useKeyboard.js
│   │
│   └── store
│       └── index.js
│ 
├── App.vue
└── main.js
```




## Button
### Props

| 이름 | 타입 | 디폴트 | 설명 | 종류 |
| --- | ---- | ----- | ---- | --- |
| disabled | Boolean | false | 비활성화 여부 | true, false |
| type | String | 'default' | 버튼의 type. 색상및 투명도 변화 | 'number', 'clear','operator', 'history', 'equal' |
| size | String | 'medium' | 버튼의 크기 | 'medium', 'small' |

### Event

| 이름 | 파라미터 | 설명 |
| ---- | ------- | ---- |
| click | event | 컴포넌트 click 이벤트 발생 시 호출 |


<br>
<br>

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
