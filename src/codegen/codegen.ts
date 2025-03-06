import {
  AssignmentStatement,
  BinaryExpression,
  Expression,
  ExpressionStatement,
  Identifier,
  NumberLiteral,
  PrintStatement,
  Program,
  Statement,
} from "../ast/ast";

export class CodeGenerator {
  private variables: Map<string, number> = new Map();
  private nextVarOffset: number = 8; // Start after rbp
  private isMacOS: boolean;

  constructor() {
    this.isMacOS = process.platform === "darwin";
  }

  private getVariableOffset(name: string): number {
    if (!this.variables.has(name)) {
      this.variables.set(name, this.nextVarOffset);
      this.nextVarOffset += 8; // 8 bytes for a 64-bit integer
    }
    return this.variables.get(name)!;
  }

  public generate(program: Program): string {
    // Calculate stack size needed for variables
    this.variables.clear();
    this.nextVarOffset = 8;

    // First pass to collect all variables
    for (const statement of program.statements) {
      if (statement.type === "AssignmentStatement") {
        this.getVariableOffset(statement.identifier);
      }
    }

    // Round up to 16-byte alignment for the stack
    const stackSize = Math.ceil(this.nextVarOffset / 16) * 16;

    // Generate assembly
    let assembly = "";

    // Add standard assembly header for NASM
    if (this.isMacOS) {
      // macOS format
      assembly += "section .text\n";
      assembly += "global _main\n\n";

      // Add print number function
      assembly += "; Function to print a number\n";
      assembly += "_print_number:\n";
      assembly += "  push rbp\n";
      assembly += "  mov rbp, rsp\n";
      assembly += "  sub rsp, 32\n"; // More stack space for buffer

      // Handle special case for zero
      assembly += "  cmp rdi, 0\n";
      assembly += "  jne .L_not_zero\n";
      assembly += "  mov byte [rsp+1], '0'\n";
      assembly += "  mov byte [rsp+2], 10\n"; // Newline
      assembly += "  lea rsi, [rsp+1]\n";
      assembly += "  mov rdx, 2\n";
      assembly += "  jmp .L_print\n";

      assembly += ".L_not_zero:\n";
      // Convert number to string (in reverse)
      assembly += "  mov rax, rdi\n"; // Number to print is in rdi
      assembly += "  mov rcx, 10\n"; // Base 10
      assembly += "  lea r8, [rsp+30]\n"; // End of buffer
      assembly += "  mov byte [r8], 10\n"; // Newline character
      assembly += "  dec r8\n";

      // Convert digits
      assembly += ".L_convert_loop:\n";
      assembly += "  xor rdx, rdx\n"; // Clear rdx for division
      assembly += "  div rcx\n"; // Divide by 10
      assembly += "  add dl, '0'\n"; // Convert remainder to ASCII
      assembly += "  mov [r8], dl\n"; // Store digit
      assembly += "  dec r8\n"; // Move buffer pointer
      assembly += "  test rax, rax\n"; // Check if number is zero
      assembly += "  jnz .L_convert_loop\n";

      // Calculate string length
      assembly += "  inc r8\n"; // Point to first digit
      assembly += "  lea rsi, [r8]\n"; // rsi = buffer address
      assembly += "  lea rdx, [rsp+30]\n";
      assembly += "  sub rdx, r8\n"; // rdx = length
      assembly += "  inc rdx\n"; // Include newline

      // Write to stdout
      assembly += ".L_print:\n";
      assembly += "  mov rax, 0x2000004\n"; // macOS write syscall
      assembly += "  mov rdi, 1\n"; // stdout
      assembly += "  syscall\n";

      assembly += "  leave\n";
      assembly += "  ret\n\n";

      // Main function
      assembly += "_main:\n";
    } else {
      // Linux format
      assembly += "section .text\n";
      assembly += "global _start\n\n";

      // Add print number function
      assembly += "; Function to print a number\n";
      assembly += "_print_number:\n";
      assembly += "  push rbp\n";
      assembly += "  mov rbp, rsp\n";
      assembly += "  sub rsp, 32\n"; // More stack space for buffer

      // Handle special case for zero
      assembly += "  cmp rdi, 0\n";
      assembly += "  jne .L_not_zero\n";
      assembly += "  mov byte [rsp+1], '0'\n";
      assembly += "  mov byte [rsp+2], 10\n"; // Newline
      assembly += "  lea rsi, [rsp+1]\n";
      assembly += "  mov rdx, 2\n";
      assembly += "  jmp .L_print\n";

      assembly += ".L_not_zero:\n";
      // Convert number to string (in reverse)
      assembly += "  mov rax, rdi\n"; // Number to print is in rdi
      assembly += "  mov rcx, 10\n"; // Base 10
      assembly += "  lea r8, [rsp+30]\n"; // End of buffer
      assembly += "  mov byte [r8], 10\n"; // Newline character
      assembly += "  dec r8\n";

      // Convert digits
      assembly += ".L_convert_loop:\n";
      assembly += "  xor rdx, rdx\n"; // Clear rdx for division
      assembly += "  div rcx\n"; // Divide by 10
      assembly += "  add dl, '0'\n"; // Convert remainder to ASCII
      assembly += "  mov [r8], dl\n"; // Store digit
      assembly += "  dec r8\n"; // Move buffer pointer
      assembly += "  test rax, rax\n"; // Check if number is zero
      assembly += "  jnz .L_convert_loop\n";

      // Calculate string length
      assembly += "  inc r8\n"; // Point to first digit
      assembly += "  lea rsi, [r8]\n"; // rsi = buffer address
      assembly += "  lea rdx, [rsp+30]\n";
      assembly += "  sub rdx, r8\n"; // rdx = length
      assembly += "  inc rdx\n"; // Include newline

      // Write to stdout
      assembly += ".L_print:\n";
      assembly += "  mov rax, 1\n"; // Linux write syscall
      assembly += "  mov rdi, 1\n"; // stdout
      assembly += "  syscall\n";

      assembly += "  leave\n";
      assembly += "  ret\n\n";

      // Main function
      assembly += "_start:\n";
    }

    // Function prologue
    assembly += "  push rbp\n";
    assembly += "  mov rbp, rsp\n";
    assembly += `  sub rsp, ${stackSize}\n\n`;

    // Generate code for each statement
    for (const statement of program.statements) {
      assembly += this.generateStatement(statement);
    }

    // Exit the program
    if (this.isMacOS) {
      // macOS exit
      assembly += "  mov rax, 0x2000001\n"; // macOS exit syscall
      assembly += "  xor rdi, rdi\n"; // exit code 0
      assembly += "  syscall\n";
    } else {
      // Linux exit
      assembly += "  mov rax, 60\n"; // Linux exit syscall
      assembly += "  xor rdi, rdi\n"; // exit code 0
      assembly += "  syscall\n";
    }

    return assembly;
  }

  private generateStatement(statement: Statement): string {
    switch (statement.type) {
      case "AssignmentStatement":
        return this.generateAssignmentStatement(statement);
      case "ExpressionStatement":
        return this.generateExpressionStatement(statement);
      case "PrintStatement":
        return this.generatePrintStatement(statement);
      default:
        throw new Error(`Unknown statement type: ${(statement as any).type}`);
    }
  }

  private generateAssignmentStatement(statement: AssignmentStatement): string {
    const offset = this.getVariableOffset(statement.identifier);
    const expressionCode = this.generateExpression(statement.value);

    return `${expressionCode}  mov [rbp-${offset}], rax\n\n`;
  }

  private generateExpressionStatement(statement: ExpressionStatement): string {
    return this.generateExpression(statement.expression);
  }

  private generatePrintStatement(statement: PrintStatement): string {
    const expressionCode = this.generateExpression(statement.expression);
    return `${expressionCode}  mov rdi, rax\n  call _print_number\n\n`;
  }

  private generateExpression(expression: Expression): string {
    switch (expression.type) {
      case "NumberLiteral":
        return this.generateNumberLiteral(expression);
      case "Identifier":
        return this.generateIdentifier(expression);
      case "BinaryExpression":
        return this.generateBinaryExpression(expression);
      default:
        throw new Error(`Unknown expression type: ${(expression as any).type}`);
    }
  }

  private generateNumberLiteral(literal: NumberLiteral): string {
    return `  mov rax, ${literal.value}\n`;
  }

  private generateIdentifier(identifier: Identifier): string {
    const offset = this.getVariableOffset(identifier.name);
    return `  mov rax, [rbp-${offset}]\n`;
  }

  private generateBinaryExpression(expression: BinaryExpression): string {
    // For simplicity, we'll evaluate the right operand first, push it to the stack,
    // then evaluate the left operand, and finally perform the operation
    const rightCode = this.generateExpression(expression.right);
    const pushRight = "  push rax\n";
    const leftCode = this.generateExpression(expression.left);
    const popRight = "  pop rcx\n";

    let operationCode = "";

    switch (expression.operator) {
      case "+":
        operationCode = "  add rax, rcx\n";
        break;
      case "-":
        operationCode = "  sub rax, rcx\n";
        break;
      case "*":
        operationCode = "  imul rax, rcx\n";
        break;
      case "/":
        // x86-64 idiv is a bit complex - it divides rdx:rax by the operand
        operationCode = "  mov rdx, 0\n"; // Clear rdx for division
        operationCode += "  xchg rax, rcx\n"; // Swap divisor and dividend
        operationCode += "  idiv rcx\n"; // Divide rdx:rax by rcx
        break;
      default:
        throw new Error(`Unknown operator: ${expression.operator}`);
    }

    return rightCode + pushRight + leftCode + popRight + operationCode;
  }
}
