# emojilang

A minimal compiled programming language that demonstrates the core concepts of a compiler. This project is designed as a learning tool to understand how compilers work.

## Overview

emojilang is a simple programming language that compiles to x86-64 assembly. It demonstrates the key components of a compiler:

- **Lexer**: Breaks source code into tokens
- **Parser**: Builds an Abstract Syntax Tree (AST) from tokens
- **Code Generator**: Converts the AST to x86-64 assembly
- **Compiler Driver**: Orchestrates the compilation process

### Code Generation Approaches

This project uses a traditional approach of generating assembly code as an intermediate step. However, modern compilers often use different strategies:

1. **Direct Machine Code Generation** (Modern Approach)

   - Compilers like LLVM, GCC, and Rust generate machine code directly
   - Benefits: Better optimization opportunities, no need for external assembler
   - Examples:
     - Rust uses LLVM to generate optimized machine code
     - Go's compiler generates machine code directly
     - Modern JavaScript engines (V8, SpiderMonkey) use JIT compilation to machine code

2. **Assembly Generation** (Traditional Approach)
   - Used in this project for educational purposes
   - Benefits: Easier to understand and debug, human-readable output
   - Examples:
     - Early C compilers generated assembly before linking
     - Some educational compilers (like this one) use this approach
     - NASM and GAS (GNU Assembler) are still used in some specialized contexts

## Language Features

The language is intentionally minimal but includes:

- Integer literals
- Variables (implicitly defined on first use)
- Basic arithmetic operations (+, -, \*, /)
- Expressions with proper precedence
- Statements separated by semicolons

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- NASM (Netwide Assembler)
- GNU Linker (ld)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mattcookio/emojilang.git
   cd emojilang
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Usage

1. Write your emojilang code in a `.asm` file (see `examples/` directory for samples)
2. Compile your code:
   ```bash
   npm run compile yourfile.asm
   ```
3. The compiler will generate an executable with the same name as your source file

## Project Structure

- `src/`: Source code for the compiler
  - `lexer/`: Tokenization logic
  - `parser/`: Parsing and AST generation
  - `codegen/`: Assembly code generation
  - `index.ts`: Main compiler driver
- `examples/`: Sample emojilang programs
- `emojilang-vscode/`: VS Code extension for emojilang

## Learning Resources

For a detailed explanation of how the compiler works, check out `SUMMARY.md`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
