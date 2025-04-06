# emojilang

A minimal compiled programming language that demonstrates how compilers work. Perfect for learning about language implementation and compilation.

## How Compilers Work

A compiler is like a translator that converts your code into something your computer can understand. Here's the process:

1. **Lexer** (Word Processor)

   - Reads your code character by character
   - Groups characters into meaningful tokens (like words in a sentence)
   - Handles whitespace and tracks line/column information
   - Example: `x = 42` becomes `[IDENTIFIER "x", ASSIGN "=", NUMBER "42"]`

2. **Parser** (Grammar Checker)

   - Implements a recursive descent parser
   - Checks if your code follows the language's rules
   - Builds a tree structure (AST) showing how operations relate
   - Handles operator precedence (\* before +)
   - Example: `x = 42` becomes:
     ```
     AssignmentStatement
     ├── identifier: "x"
     └── value: NumberLiteral(42)
     ```

3. **Code Generator** (Translator)

   - Traverses the AST and generates x86-64 assembly
   - Manages variable allocation on the stack
   - Example: `x = 42` becomes:
     ```assembly
     mov rax, 42
     mov QWORD PTR [rbp-8], rax
     ```

4. **Assembler & Linker** (Builder)
   - **Assembler (NASM)**: Converts assembly to machine code
     - Creates binary object files (like a puzzle with missing pieces)
     - Keeps track of where things are (symbol tables)
     - Notes where things need to be connected (relocation info)
   - **Linker (ld)**: Creates the final executable
     - Organizes the program's memory:
       - `.text`: Where the code lives
       - `.data`: Where variables start with values
       - `.bss`: Where variables start as zero
     - Connects everything together (like completing a puzzle)
     - Creates the program's startup instructions
     - Makes sure the operating system can run it

### Modern vs Traditional Compilation

1. **Direct Machine Code** (Modern)

   - Compilers like Rust, Go, and JavaScript generate machine code directly
   - Benefits: Faster execution, better optimization
   - Example: Rust's compiler creates highly optimized code in one step

2. **Assembly Generation** (Traditional)
   - This project uses this approach for clarity
   - Benefits: Easier to understand and debug
   - Example: Early C compilers worked this way

## Language Features

- Numbers: `42`
- Variables: `x = 42`
- Math: `x + y * 3` (with proper precedence)
- Print: `print x`
- While loops: `while x > 0 { ... }`

## Quick Start

1. Install:

   ```bash
   git clone https://github.com/mattcookio/emojilang.git
   cd emojilang
   npm install
   ```

2. Write code in `example.asm`:

   ```asm
   x = 42
   print x
   ```

3. Compile and run:
   ```bash
   npm run compile example.asm
   ./example
   ```

## Project Structure

```
emojilang/
├── src/           # Compiler source
│   ├── lexer/    # Token creation
│   ├── parser/   # Parsing logic
│   ├── ast/      # Abstract Syntax Tree
│   └── codegen/  # Assembly output
├── examples/      # Sample programs
└── emojilang-vscode/  # VS Code extension with syntax highlighting
```

## Editor Support

### VS Code Extension

The project includes a dedicated VS Code extension (`emojilang-vscode`) that provides:

- Syntax highlighting for all emoji operators:
  - Assignment: 🍌
  - Addition: 🤪
  - Subtraction: 🥴
  - Multiplication: 🤯
  - Print: 🦄
  - While loop: 🔄
  - Loop end: 🛑
  - Statement terminator: 💩
- Number and identifier highlighting
- Comment support
- Basic language features

To install the extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for "emojilang"
4. Click Install

## Future Extensions

The compiler could be extended with:

- More data types (strings, booleans, arrays)
- Control flow (if/else, loops)
- Functions and scope
- Type checking
- Optimization passes

## License

MIT License - see [LICENSE](LICENSE)
