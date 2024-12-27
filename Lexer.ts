export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
}

export interface Token {
    value: string;
    type: TokenType;
}

const token = (value = '', type: TokenType): Token => {
    return { value, type };
}

export const tokenize = (sourceCode: string): Token[] => {
    const tokens = new Array<Token>();
    const src = sourceCode.split('');

    // Build each token until end of file
    while(src.length > 0){
        if((src[0]) === '('){
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if(src[0] === ')'){
            tokens.push(token(src.shift(), TokenType.CloseParen))
        } else if (src[0] === '+' || src[0] === '-' || src[0] === '/' || src[0] === '*'){
            tokens.push(token(src.shift(), TokenType.BinaryOperator));           
        } else if (src[0] === '='){
            tokens.push(token(src.shift(), TokenType.BinaryOperator));           
        }
    }

    return tokens;
}


