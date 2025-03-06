import {
  AssignmentStatement,
  BinaryExpression,
  Expression,
  Identifier,
  NumberLiteral,
  PrintStatement,
  Program,
  Statement,
  WhileStatement
} from "../ast/ast";

export class CodeGenerator {
  private variableMap: Map<string, number> = new Map();
  private nextVarOffset: number = 8; // Start after rbp
  private assembly: string[] = [];
  private isMacOS: boolean;

  constructor() {
    this.isMacOS = process.platform === "darwin";
  }

  public generate(program: Program): string {
    this.assembly = [];
    this.variableMap = new Map();
    this.nextVarOffset = 8;

    // Assembly header
    this.emit("section .text");
    if (this.isMacOS) {
      this.emit("global _main");
      this.emit("_main:");
    } else {
      this.emit("global _start");
      this.emit("_start:");
    }
    
    // Setup stack frame
    this.emit("  push rbp");
    this.emit("  mov rbp, rsp");
    this.emit("  sub rsp, 64"); // Reserve space for variables
    
    // Generate code for each statement
    for (const statement of program.statements) {
      this.generateStatement(statement);
    }
    
    // Exit program
    if (this.isMacOS) {
      this.emit("  mov rax, 0x2000001"); // macOS exit syscall
      this.emit("  xor rdi, rdi"); // status: 0
      this.emit("  syscall");
    } else {
      this.emit("  mov rax, 60"); // Linux exit syscall
      this.emit("  xor rdi, rdi"); // status: 0
      this.emit("  syscall");
    }
    
    return this.assembly.join("\n");
  }

  private emit(line: string): void {
    this.assembly.push(line);
  }

  private generateStatement(statement: Statement): void {
    if (statement.type === "AssignmentStatement") {
      this.generateAssignment(statement);
    } else if (statement.type === "PrintStatement") {
      this.generatePrint(statement);
    } else if (statement.type === "WhileStatement") {
      this.generateWhile(statement);
    }
  }

  private generateAssignment(statement: AssignmentStatement): void {
    // Generate code for the expression
    this.generateExpression(statement.value);
    
    // Store the result in the variable
    const varOffset = this.getVariableOffset(statement.identifier);
    this.emit(`  ; Store value in variable ${statement.identifier}`);
    this.emit(`  mov [rbp-${varOffset}], rax`);
  }

  private generatePrint(statement: PrintStatement): void {
    // Generate code for the expression
    this.generateExpression(statement.expression);
    
    // Print the result (in rax)
    this.emit("  ; Print value");
    this.emit("  mov rdi, rax"); // First argument: value to print
    this.emit("  call print_int");
  }

  private generateExpression(expression: Expression): void {
    if (expression.type === "NumberLiteral") {
      this.generateNumberLiteral(expression);
    } else if (expression.type === "Identifier") {
      this.generateIdentifier(expression);
    } else if (expression.type === "BinaryExpression") {
      this.generateBinaryExpression(expression);
    }
  }

  private generateNumberLiteral(expression: NumberLiteral): void {
    this.emit(`  ; Load number ${expression.value}`);
    this.emit(`  mov rax, ${expression.value}`);
  }

  private generateIdentifier(expression: Identifier): void {
    const varOffset = this.getVariableOffset(expression.name);
    this.emit(`  ; Load variable ${expression.name}`);
    this.emit(`  mov rax, [rbp-${varOffset}]`);
  }

  private generateBinaryExpression(expression: BinaryExpression): void {
    // For conditions like i <= n, we need to handle them differently
    // First, check if this is a condition with subtraction and addition (i <= n becomes i - n + 1)
    if (expression.operator === "🤪" && 
        expression.left.type === "BinaryExpression" && 
        expression.left.operator === "🥴") {
      
      // This is likely a condition like i <= n (implemented as i - n + 1)
      // We need to generate a comparison instead
      
      // Generate code for the right side of the subtraction (n)
      if (expression.left.right.type === "Identifier") {
        this.emit(`  ; Load variable ${expression.left.right.name}`);
        const varOffset = this.getVariableOffset(expression.left.right.name);
        this.emit(`  mov rax, [rbp-${varOffset}]`);
      } else if (expression.left.right.type === "NumberLiteral") {
        this.emit(`  ; Load number ${expression.left.right.value}`);
        this.emit(`  mov rax, ${expression.left.right.value}`);
      } else {
        this.generateExpression(expression.left.right);
      }
      
      // Save the right operand (n) on the stack
      this.emit("  push rax");
      
      // Generate code for the left side of the subtraction (i)
      if (expression.left.left.type === "Identifier") {
        this.emit(`  ; Load variable ${expression.left.left.name}`);
        const varOffset = this.getVariableOffset(expression.left.left.name);
        this.emit(`  mov rax, [rbp-${varOffset}]`);
      } else if (expression.left.left.type === "NumberLiteral") {
        this.emit(`  ; Load number ${expression.left.left.value}`);
        this.emit(`  mov rax, ${expression.left.left.value}`);
      } else {
        this.generateExpression(expression.left.left);
      }
      
      // Pop the right operand (n) into rcx
      this.emit("  pop rcx");
      
      // Compare i and n (for i <= n)
      this.emit("  ; Compare for less than or equal");
      this.emit("  cmp rax, rcx");
      this.emit("  setle al");  // Set al to 1 if i <= n, 0 otherwise
      this.emit("  movzx rax, al");  // Zero-extend al to rax
      
      return;
    }
    
    // For regular binary expressions, use the original code
    // Generate code for the right operand
    this.generateExpression(expression.right);
    
    // Save the right operand on the stack
    this.emit("  push rax");
    
    // Generate code for the left operand
    this.generateExpression(expression.left);
    
    // The left operand is now in rax
    // Pop the right operand into rcx
    this.emit("  pop rcx");
    
    // Perform the operation based on the operator
    switch (expression.operator) {
      case "🤪": // Add
        this.emit("  ; Add operation");
        this.emit("  add rax, rcx");
        break;
      case "🥴": // Subtract
        this.emit("  ; Subtract operation");
        this.emit("  sub rax, rcx");
        break;
      case "🤯": // Multiply
        this.emit("  ; Multiply operation");
        this.emit("  imul rax, rcx");
        break;
      default:
        throw new Error(`Unknown operator: ${expression.operator}`);
    }
  }

  private generateWhile(statement: WhileStatement): void {
    const loopLabel = `loop_${this.getUniqueId()}`;
    const endLabel = `end_${this.getUniqueId()}`;
    
    // Loop label
    this.emit(`${loopLabel}:`);
    
    // Generate condition code
    this.generateExpression(statement.condition);
    
    // Compare result with 0 (false)
    this.emit("  cmp rax, 0");
    this.emit(`  je ${endLabel}`);
    
    // Generate code for the loop body
    for (const bodyStatement of statement.body) {
      this.generateStatement(bodyStatement);
    }
    
    // Jump back to the beginning of the loop
    this.emit(`  jmp ${loopLabel}`);
    
    // End label
    this.emit(`${endLabel}:`);
  }
  
  private uniqueIdCounter: number = 0;
  
  private getUniqueId(): number {
    return this.uniqueIdCounter++;
  }

  private getVariableOffset(name: string): number {
    if (!this.variableMap.has(name)) {
      this.variableMap.set(name, this.nextVarOffset);
      this.nextVarOffset += 8; // 8 bytes for a 64-bit integer
    }
    
    return this.variableMap.get(name)!;
  }
}
