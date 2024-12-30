import { NullVal, NumberVal, RuntimeVal } from './values.ts';
import { BinaryExpr, NumericLiteral, Stmt, Program } from '../frontend/ast';

function evaluate_binary_expr(binop: BinaryExpr): RuntimeVal{
    const leftHandSide = evaluate(binop.left);
    const rightHandSide = evaluate(binop.right);

    if(rightHandSide.type === 'number' && leftHandSide.type === 'number'){
        return evaluate_numeric_binary_expr(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
    }
    else{
        return {type: 'null', value: 'null'} as NullVal;    
    }
}

function evaluate_numeric_binary_expr(left: NumberVal, right: NumberVal, operator: string) : NumberVal {
    let res:number = 0;

    if(operator === '+'){
        res = left.value + right.value;
    }
    else if (operator === '-'){
        res = left.value - right.value;
    }
    else if (operator === '*'){
        res = left.value * right.value;
    }
    else if (operator === '/'){
        //TODO division by 0 checks
        res = left.value / right.value;
    }
    else if (operator === '%'){
        res = left.value % right.value;
    }

    return {value: res, type: 'number'};
}

function evaluate_program(program: Program): RuntimeVal{
    let lastEvaluated: RuntimeVal = {type: 'null', value: 'null'} as NullVal;

    for(const statement of program.body){
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}

export function evaluate(astNode: Stmt) : RuntimeVal{
    switch(astNode.kind){
        case 'NumericLiteral':
            return {
                value: ((astNode as NumericLiteral).value),
                type:'number',
            } as NumberVal;
        case 'NullLiteral':
            return {
                value:'null',
                type:'null',
            } as NullVal
        case 'BinaryExpr':
            return evaluate_binary_expr(astNode as BinaryExpr);
        case 'Program':
            return evaluate_program(astNode as Program);
        default:
            console.error('This AST Node is not a recognizable type', astNode);
            process.exit(1);
    }
}