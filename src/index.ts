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

try {
  // 1. Lexical Analysis
  console.log("Lexical Analysis...");
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();

  // 2. Parsing
  console.log("Parsing...");
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // 3. Code Generation
  console.log("Code Generation...");
  const codeGenerator = new CodeGenerator();
  const assembly = codeGenerator.generate(ast);

  // Write the assembly to a file
  fs.writeFileSync(asmFile, assembly);
  console.log(`Assembly written to ${asmFile}`);

  // 4. Assemble and Link
  console.log("Assembling...");
  if (isMacOS) {
    // macOS uses macho64 format
    execSync(`nasm -f macho64 -o ${objFile} ${asmFile}`);

    console.log("Linking...");
    execSync(
      `ld -o ${exeFile} ${objFile} -macos_version_min 10.15 -lSystem -L/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib`
    );
  } else {
    // Linux uses elf64 format
    execSync(`nasm -f elf64 -o ${objFile} ${asmFile}`);

    console.log("Linking...");
    execSync(`ld -o ${exeFile} ${objFile}`);
  }

  console.log(`Executable created: ${exeFile}`);

  // Clean up intermediate files
  fs.unlinkSync(objFile);

  console.log("Compilation successful!");
} catch (error) {
  console.error("Compilation failed:", error);
  process.exit(1);
}
