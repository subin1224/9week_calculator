import { MAX_LENGTH, ERROR_CODE } from "../shared/constants";

export function useCalculate() {
    //안전한 최대 정수값 (2^53 -1)
    //const SAFE_VALUE = Number.MAX_SAFE_INTEGER;

    //세자리수 컴마
    function addComma(number) {
        const parts = number.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }

    // Bigint 변환 대신 MAX_VALUE => 지수표기법 으로 변환
    /*
    function changeSafeDigit(num) {
        if( Number(num) >= SAFE_VALUE ) {
          return BigInt(num);
        } else {
           return Number(num);
        }
    }
    */

    //지수 표기 => 문자열 반환
    function inputValueToExpotential(inputValue) {
        if(inputValue.length > MAX_LENGTH) {
            return Number(inputValue).toExponential();
        }else {
            return inputValue;
        }
    }

    //연산식
    function findResult(expression) { // 이때 expression :  1 + 1  꼴
        try {
            const expressArr = expression.split(" ");

            const firstValue = Number(expressArr[0]);
            const secondValue = Number(expressArr[2]);

            let result = 0;
            switch (expressArr[1]) {
                case '+':
                    result = firstValue + secondValue;
                    break;
                case '-':
                    result = firstValue - secondValue;
                    break;
                case '*':
                    result = firstValue * secondValue;
                    break;
                case '/':
                    if (secondValue === 0) {
                        if (firstValue === 0) {
                            return '정의되지 않은 결과입니다.';
                        }
                        return '0으로 나눌 수 없습니다.';
                    }
                    result = (firstValue / secondValue);
                    break;
            }

            //소수점이 있을때
            if (expressArr[0].indexOf('.') !== -1
                || expressArr[2].indexOf('.') !== -1
                || result.toString().indexOf('.') !== -1
            ) {
                const length = expressArr[0].length - expressArr[0].indexOf('.') > expressArr[2].length - expressArr[2].indexOf('.')
                    ? expressArr[0].length - expressArr[0].indexOf('.') - 1
                    : expressArr[2].length - expressArr[2].indexOf('.') - 1;

                result = result.toFixed(length).toString();
            }

            return inputValueToExpotential(result);

        } catch (e) {
            return '에러 발생';
        }
    }

    //연산자가 두번 들어왔을때 => changBool 이 true 연산진행, false면 return

    // 숫자로 바꾸어 주고 -1 곱해준 뒤에 문자열로 다시 변환 (negateDigit)
    const negateInputValue = (inputValue) => {
        return ( Number(inputValue) * (-1) ).toString();
    };

    return {
        addComma,
        findResult,
        negateInputValue,
    };
}