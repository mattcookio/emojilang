// Abstract Syntax Tree node types

export interface ASTNode {
  type: string;
}

export interface Program extends ASTNode {
  type: "Program";
  statements: Statement[];
}

export type Statement =
  | AssignmentStatement
  | ExpressionStatement
  | PrintStatement;

export interface AssignmentStatement extends ASTNode {
  type: "AssignmentStatement";
  identifier: string;
  value: Expression;
}

export interface ExpressionStatement extends ASTNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface PrintStatement extends ASTNode {
  type: "PrintStatement";
  expression: Expression;
}

export type Expression = BinaryExpression | NumberLiteral | Identifier;

export interface BinaryExpression extends ASTNode {
  type: "BinaryExpression";
  left: Expression;
  operator: string; // '+', '-', '*', '/'
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
