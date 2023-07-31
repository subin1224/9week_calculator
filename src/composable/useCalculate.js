import { MAX_LENGTH } from '../shared/constants';

export function useCalculate() {
  //안전한 최대 정수값 (2^53 -1)
  //const SAFE_VALUE = Number.MAX_SAFE_INTEGER;

  //세자리수 컴마
  function addComma(number) {
    // 이 부분에서 소수점 ' . ' 이 보이지 않았던 것
    const parts = number.toString().split('.');
    return (
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (parts[1] ? '.' + parts[1] : '')
    );

    // return number.toLocaleString(); => currentValue 에서 콤마가 찍히지 않음
  }

  //지수 표기 => 문자열 반환
  function inputValueToExpotential(inputValue) {
    if (inputValue.length > MAX_LENGTH) {
      return Number(inputValue).toExponential();
    } else {
      return inputValue;
    }
  }

  //연산식
  function findResult(expression) {
    // 이때 expression :  1 + 1  꼴
    const expressArr = expression.split(' ');

    let firstValue = Number(expressArr[0]);
    let secondValue = Number(expressArr[2]);

    //부동소수점 오차 해결 : 10진수로 바꾸어서 계산
    let decimalLength = 0;
    let isDecimal = false;
    if (
      expressArr[0].indexOf('.') !== -1 ||
      expressArr[2].indexOf('.') !== -1
    ) {
      decimalLength =
        expressArr[0].length - expressArr[0].indexOf('.') >
        expressArr[2].length - expressArr[2].indexOf('.')
          ? expressArr[0].length - expressArr[0].indexOf('.') - 1
          : expressArr[2].length - expressArr[2].indexOf('.') - 1;
      firstValue *= Math.pow(10, decimalLength);
      secondValue *= Math.pow(10, decimalLength);
      isDecimal = true;
    }

    let result = 0;
    switch (expressArr[1]) {
      case '+':
        result = firstValue + secondValue;
        break;
      case '-':
        result = firstValue - secondValue;
        break;
      case '×':
        result = firstValue * secondValue;
        break;
      case '÷':
        if (secondValue === 0) {
          if (firstValue === 0) {
            return '정의되지 않은 결과입니다.';
          }
          return '0으로 나눌 수 없습니다.';
        }
        result = firstValue / secondValue;
        break;
    }

    if (isDecimal) {
      //
      console.log('decimalLength', decimalLength);
      console.log('round', Math.round(result));
      if (expressArr[1] === '+' || expressArr[1] === '-') {
        result /= Math.pow(10, decimalLength);
      } else {
        result /= Math.pow(10, decimalLength * 2);
      }
    }

    return inputValueToExpotential(result);
  }

  // 숫자로 바꾸어 주고 -1 곱해준 뒤에 문자열로 다시 변환 (negateDigit)
  function negateInputValue(inputValue) {
    return (Number(inputValue) * -1).toString();
  }

  return {
    addComma,
    findResult,
    negateInputValue,
  };
}
