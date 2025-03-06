# MiniLang Compiler Summary

We've created a minimal compiled programming language that demonstrates the core concepts of a compiler. Here's a summary of the components and how they work together:

## Components

1. **Lexer** (`src/lexer/lexer.ts` and `src/lexer/token.ts`)

   - Breaks source code into tokens (numbers, identifiers, operators, etc.)
   - Handles whitespace and tracks line/column information for error reporting
   - Provides a simple interface to tokenize the entire source or get tokens one by one

2. **Parser** (`src/parser/parser.ts`)

   - Implements a recursive descent parser
   - Builds an Abstract Syntax Tree (AST) from tokens
   - Handles operator precedence (\*, / before +, -)
   - Supports expressions, assignments, and statement sequences

3. **AST** (`src/ast/ast.ts`)

   - Defines the structure of the Abstract Syntax Tree
   - Includes node types for programs, statements, expressions, etc.
   - Provides a clean interface for the code generator to work with

4. **Code Generator** (`src/codegen/codegen.ts`)

   - Traverses the AST and generates x86-64 assembly code
   - Manages variable allocation on the stack
   - Implements code generation for arithmetic operations
   - Creates a proper assembly program with entry point and exit

5. **Compiler Driver** (`src/index.ts`)
   - Orchestrates the compilation process
   - Reads source files and writes output files
   - Invokes external tools (nasm, ld) to create executables

## Compilation Process

1. **Source Code** → **Lexer** → **Tokens**

   ```
   x = 5;
   ```

   becomes

   ```
   [IDENTIFIER("x"), ASSIGN, NUMBER("5"), SEMICOLON]
   ```

2. **Tokens** → **Parser** → **AST**

   ```
   [IDENTIFIER("x"), ASSIGN, NUMBER("5"), SEMICOLON]
   ```

   becomes

   ```
   {
     type: "AssignmentStatement",
     identifier: "x",
     value: { type: "NumberLiteral", value: 5 }
   }
   ```

3. **AST** → **Code Generator** → **Assembly**

   ```
   {
     type: "AssignmentStatement",
     identifier: "x",
     value: { type: "NumberLiteral", value: 5 }
   }
   ```

   becomes

   ```
   mov rax, 5
   mov QWORD PTR [rbp-8], rax
   ```

4. **Assembly** → **Assembler (NASM)** → **Object File**
5. **Object File** → **Linker (ld)** → **Executable**

## Language Features

MiniLang is intentionally minimal but demonstrates the essential concepts:

- Integer literals
- Variables (implicitly defined on first use)
- Basic arithmetic operations (+, -, \*, /)
- Expressions with proper precedence
- Statements separated by semicolons

## Extensions

This minimal compiler could be extended with:

- More data types (strings, booleans, arrays)
- Control flow (if/else, loops)
- Functions and scope
- Type checking
- Optimization passes

The core architecture would remain the same, with additions to each component to support new features.
