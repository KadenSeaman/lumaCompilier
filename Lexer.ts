import * as fs from 'fs';

export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
}

const KEYWORDS: Record<string, TokenType> = {
    'let': TokenType.Let,
}

export interface Token {
    value: string;
    type: TokenType;
}

const token = (value = '', type: TokenType): Token => {
    return { value, type };
}

const isInteger = (src: string) => {
    const c = src.charCodeAt(0);
    const BOUNDS = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= BOUNDS[0] && c <= BOUNDS[1]);
}

const isalpha = (src: string) => {
    return src.toUpperCase() !== src.toLowerCase();
}

const isSkippable = (src: string) => {
    return src === ' ' || src === '\n' || src === '\t';
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
            tokens.push(token(src.shift(), TokenType.Equals));           
        } else {
            // Handle Mutlicharacter tokens
            
            // Build Number Token
            if(isInteger(src[0])){
                let num = '';
                while(src.length > 0 && isInteger(src[0])){
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            }
            else if(isalpha(src[0])){
                let ident = '';
                while(src.length > 0 && isalpha(src[0])){
                    ident += src.shift();
                }

                //check for reserved keywords
                const reserved = KEYWORDS[ident];
                if(reserved === undefined){
                    tokens.push(token(ident, TokenType.Identifier));
                }
                else {
                    tokens.push(token(ident, reserved));
                }
            }
            else if(isSkippable(src[0])){
                src.shift();
            }
            else{
                console.log('Unrecognized character found in srouce: ', src[0]);
                process.exit(1);
            }
        }
    }

    return tokens;
}

const sourceCode = fs.readFileSync('testing.txt', 'utf-8');
for(const token of tokenize(sourceCode)){
    console.log(token);
};