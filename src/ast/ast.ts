// Abstract Syntax Tree node types for goofy emoji language

export interface ASTNode {
  type: string;
}

export interface Program extends ASTNode {
  type: "Program";
  statements: Statement[];
}

export type Statement = AssignmentStatement | PrintStatement | WhileStatement;

export interface AssignmentStatement extends ASTNode {
  type: "AssignmentStatement";
  identifier: string;
  value: Expression;
}

export interface PrintStatement extends ASTNode {
  type: "PrintStatement";
  expression: Expression;
}

export interface WhileStatement extends ASTNode {
  type: "WhileStatement";
  condition: Expression;
  body: Statement[];
}

export type Expression = BinaryExpression | NumberLiteral | Identifier;

export interface BinaryExpression extends ASTNode {
  type: "BinaryExpression";
  left: Expression;
  operator: string; // '🤪', '🥴', '🤯'
  right: Expression;
}

export interface NumberLiteral extends ASTNode {
  type: "NumberLiteral";
  value: number;
}

export interface Identifier extends ASTNode {
  type: "Identifier";
  name: string;
}
