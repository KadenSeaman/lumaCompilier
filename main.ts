import Parser from "./frontend/parser";
import readline from "readline";
import { evaluate } from "./runtime/interpreter";

repl();

function repl () {
    const parser = new Parser();
    console.log('\nRepl v0.1');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('> ', (input) => {
        if(!input || input.includes('exit')){
            process.exit(1);
        }

        const program = parser.produceAST(input);


        const result = evaluate(program);

        console.log(result);

        rl.close();
        process.exit(1);
    })
}