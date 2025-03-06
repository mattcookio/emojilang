import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { CodeGenerator } from "./codegen/codegen";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";

// Check if a source file was provided
if (process.argv.length < 3) {
  console.error("Usage: node dist/index.js <source-file>");
  process.exit(1);
}

// Read the source file
const sourceFile = process.argv[2];
const sourceCode = fs.readFileSync(sourceFile, "utf-8");

// Get the output file name (replace extension with .asm)
const outputFile = path.basename(sourceFile, path.extname(sourceFile));
const asmFile = `${outputFile}.asm`;
const objFile = `${outputFile}.o`;
const exeFile = outputFile;

// Detect platform
const isMacOS = process.platform === "darwin";

// Add print_int function to assembly
const printIntFunction = `
; Function to print an integer
print_int:
  push rbp
  mov rbp, rsp
  sub rsp, 32
  
  ; Handle special case for zero
  cmp rdi, 0
  jne .not_zero
  mov byte [rsp+1], '0'
  mov byte [rsp+2], 10  ; newline
  lea rsi, [rsp+1]
  mov rdx, 2
  jmp .print
  
.not_zero:
  ; Convert number to string (in reverse)
  mov rax, rdi
  mov rcx, 10
  lea r8, [rsp+30]
  mov byte [r8], 10  ; newline
  dec r8
  
.convert_loop:
  xor rdx, rdx
  div rcx
  add dl, '0'
  mov [r8], dl
  dec r8
  test rax, rax
  jnz .convert_loop
  
  ; Calculate string length
  inc r8
  lea rsi, [r8]
  lea rdx, [rsp+30]
  sub rdx, r8
  inc rdx  ; Include newline
  
.print:
  ; Write to stdout
  ${isMacOS ? 
    `mov rax, 0x2000004  ; macOS write syscall
  mov rdi, 1  ; stdout` : 
    `mov rax, 1  ; Linux write syscall
  mov rdi, 1  ; stdout`}
  syscall
  
  leave
  ret
`;

try {
  // 1. Lexical Analysis
  console.log("🔍 Tokenizing...");
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();
  
  // Debug: Print tokens
  const isDebug = process.argv.includes("--debug");
  if (isDebug) {
    console.log("📋 Tokens:");
    tokens.forEach((token, index) => {
      console.log(`Token ${index}: Type=${token.type}, Value="${token.value}", Line=${token.line}, Column=${token.column}`);
    });
  }

  // 2. Parsing
  console.log("🧩 Parsing...");
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // 3. Code Generation
  console.log("🏗️ Generating code...");
  const codeGenerator = new CodeGenerator();
  let assembly = codeGenerator.generate(ast);
  
  // Add print_int function
  assembly += printIntFunction;

  // Write the assembly to a file
  fs.writeFileSync(asmFile, assembly);
  console.log(`📝 Assembly written to ${asmFile}`);

  // 4. Assemble and Link
  console.log("🔧 Assembling...");
  if (isMacOS) {
    // macOS uses macho64 format
    execSync(`nasm -f macho64 -o ${objFile} ${asmFile}`);

    console.log("🔗 Linking...");
    execSync(
      `ld -o ${exeFile} ${objFile} -macos_version_min 10.15 -lSystem -L/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib`
    );
  } else {
    // Linux uses elf64 format
    execSync(`nasm -f elf64 -o ${objFile} ${asmFile}`);

    console.log("🔗 Linking...");
    execSync(`ld -o ${exeFile} ${objFile}`);
  }

  console.log(`✨ Executable created: ${exeFile}`);

  // Clean up intermediate files
  fs.unlinkSync(objFile);

  console.log("🎉 Compilation successful!");
} catch (error) {
  console.error("❌ Compilation failed:", error);
  process.exit(1);
}
