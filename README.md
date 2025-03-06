# MiniLang Compiler

A minimal compiled programming language written in TypeScript that demonstrates the core concepts of a compiler.

## Overview

This project implements a simple compiler that translates a minimal programming language (MiniLang) into x86-64 assembly, which is then assembled and linked into an executable.

The compiler follows these steps:

1. **Lexical Analysis**: Converts source code into tokens
2. **Parsing**: Builds an Abstract Syntax Tree (AST) from tokens
3. **Code Generation**: Translates the AST into x86-64 assembly code
4. **Assembly & Linking**: Uses external tools (nasm and ld) to create an executable

## Language Features

MiniLang is an extremely minimal language with the following features:

- Integer literals
- Variables (no declarations needed)
- Basic arithmetic operations (+, -, \*, /)
- Assignment statements
- Expression statements

## Example

```
x = 5;
y = 10;
z = x + y * 2;
z;
```

## Project Structure

- `src/lexer/`: Tokenization of source code
- `src/parser/`: Parsing tokens into an AST
- `src/ast/`: AST node definitions
- `src/codegen/`: Assembly code generation
- `examples/`: Sample MiniLang programs

## Requirements

- Node.js and npm
- TypeScript
- NASM (Netwide Assembler)
- ld (GNU Linker)

## Building and Running

1. Install dependencies:

   ```
   npm install
   ```

2. Build the compiler:

   ```
   npm run build
   ```

3. Compile a MiniLang program:

   ```
   npm run test
   ```

   or

   ```
   node dist/index.js examples/test.mini
   ```

4. Run the compiled program:
   ```
   ./test
   ```

## How It Works

### 1. Lexical Analysis

The lexer (`src/lexer/lexer.ts`) scans the source code character by character and produces a stream of tokens. Each token has a type (e.g., NUMBER, IDENTIFIER, PLUS) and a value.

### 2. Parsing

The parser (`src/parser/parser.ts`) takes the tokens and builds an Abstract Syntax Tree (AST) according to the grammar rules of the language. It uses a recursive descent parsing approach.

### 3. Code Generation

The code generator (`src/codegen/codegen.ts`) traverses the AST and generates x86-64 assembly code. It handles variable allocation on the stack and translates expressions into appropriate assembly instructions.

### 4. Assembly and Linking

The final step uses external tools:

- NASM to convert assembly code to an object file
- ld to link the object file into an executable
