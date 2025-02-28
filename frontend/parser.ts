import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];
    private not_eof (): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    }

    private at () {
        return this.tokens[0] as Token;
    }

    private eat () : Token {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect (type: TokenType, error: any) {
        const prev  = this.tokens.shift() as Token;
        if(!prev || prev.type !== type){
            console.error('Parser Error:\n', error, prev, ' - Expected ', type);
            process.exit(1);
        }

        return prev;
    } 

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: 'Program',
            body: [],
        };
        
        //Parse until end of file
        while(this.not_eof()){
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt (): Stmt {
        return this.parse_expr();
    }

    private parse_expr() : Expr {
        return this.parse_additive_expr();
    }

    private parse_additive_expr() : Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value === '+' || this.at().value === '-'){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator,
            } as BinaryExpr
        }

        return left;
    }

    private parse_multiplicative_expr() : Expr {
        let left = this.parse_primary_expr();

        while (this.at().value === '/' || this.at().value === '*' || this.at().value === '%'){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator,
            } as BinaryExpr
        }

        return left;
    }

    // Orders of Prescidence
    // 
    // Assignment Expr
    // Member Expr
    // FunctionCall
    // Comparison
    // AdditiveExpr
    // Multiplicative
    // UnaryExpr
    // PrimaryExpr
    //
    // parse higher prescidence last to put it at the top of the tree

    private parse_primary_expr () : Expr {
        const tk = this.at().type;

        switch (tk){
            case TokenType.Identifier:
                return {kind: 'Identifier', symbol: this.eat().value} as Identifier;
            case TokenType.Null:
                this.eat(); //advance past null keyword
                return {kind: 'NullLiteral', value: 'null'} as NullLiteral;
            case TokenType.Number:
                return {kind: 'NumericLiteral', value: parseFloat(this.eat().value)} as NumericLiteral;
            case TokenType.OpenParen:
                this.eat(); // eat opening
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, 'unexpected token'); //eat ending
                return value;
            default:
                console.log('Unexpected Token Found During Parsing', this.at());
                process.exit(1);
        }
    }
}
