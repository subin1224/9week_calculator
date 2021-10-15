import { MAX_LENGTH } from "../shared/constants";

export function useCalculate() {
    //
    function addComma(number) {
        const parts = number.split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }

    function findResult(expression) { // 이때 expression :  1 + 1  꼴
        const expressArr = expression.split(" ");

        const firstValue = Number(expressArr[0]);
        const secondValue = Number(expressArr[2]);

        let result = 0;
        switch ( expressArr[1] ) {
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
                        // currentValue.value = '정의되지 않은 결과입니다.';
                        return;
                    }
                    // currentValue.value = '0으로 나눌 수 없습니다.';
                    return;
                }

                result = (firstValue / secondValue);
                break;
        }

        if( expressArr[0].indexOf('.') !== -1 || expressArr[2].indexOf('.') !== -1 ) {
            const length = expressArr[0].length - expressArr[0].indexOf('.') > expressArr[2].length - expressArr[2].indexOf('.')
                ? expressArr[0].length - expressArr[0].indexOf('.') - 1
                : expressArr[2].length - expressArr[2].indexOf('.') - 1 ;

            return result.toFixed(length).toString();
        }else{
            return result.toString().length > MAX_LENGTH
                ? result.toFixed(MAX_LENGTH).toString()
                : result.toString() ;
        }
    }

    //연산자가 두번 들어왔을때 => changBool 이 true 연산진행, false면 return


    return {
        addComma,
        findResult,
    };
}