import {
  AssignmentStatement, Expression, PrintStatement,
  Program,
  Statement,
  WhileStatement
} from "../ast/ast";
import { Token, TokenType } from "../lexer/token";

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    const token = this.tokens[this.current];
    this.current++;
    return token;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    const token = this.peek();
    throw new Error(`${message} at line ${token.line}, column ${token.column}`);
  }

  public parse(): Program {
    const statements: Statement[] = [];
    
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }
    
    return {
      type: "Program",
      statements
    };
  }

  private statement(): Statement {
    if (this.check(TokenType.PRINT)) {
      return this.printStatement();
    }
    
    if (this.check(TokenType.WHILE)) {
      return this.whileStatement();
    }
    
    return this.assignmentStatement();
  }

  private printStatement(): PrintStatement {
    this.advance(); // Consume 🦄
    
    const expression = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected '💩' after expression");
    
    return {
      type: "PrintStatement",
      expression
    };
  }

  private assignmentStatement(): AssignmentStatement {
    const identifier = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
    this.consume(TokenType.ASSIGN, "Expected '🍌' after variable name");
    
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected '💩' after expression");
    
    return {
      type: "AssignmentStatement",
      identifier,
      value
    };
  }

  private whileStatement(): WhileStatement {
    this.advance(); // Consume 🔄
    
    const condition = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected '💩' after while condition");
    
    const body: Statement[] = [];
    
    while (!this.check(TokenType.END) && !this.isAtEnd()) {
      body.push(this.statement());
    }
    
    this.consume(TokenType.END, "Expected '🛑' to end while loop");
    this.consume(TokenType.SEMICOLON, "Expected '💩' after end of while loop");
    
    return {
      type: "WhileStatement",
      condition,
      body
    };
  }

  private expression(): Expression {
    return this.additive();
  }

  private additive(): Expression {
    let expr = this.multiplicative();
    
    while (this.check(TokenType.ADD) || this.check(TokenType.SUBTRACT)) {
      const operator = this.advance().value;
      const right = this.multiplicative();
      
      expr = {
        type: "BinaryExpression",
        left: expr,
        operator,
        right
      };
    }
    
    return expr;
  }

  private multiplicative(): Expression {
    let expr = this.primary();
    
    while (this.check(TokenType.MULTIPLY)) {
      const operator = this.advance().value;
      const right = this.primary();
      
      expr = {
        type: "BinaryExpression",
        left: expr,
        operator,
        right
      };
    }
    
    return expr;
  }

  private primary(): Expression {
    if (this.check(TokenType.NUMBER)) {
      const token = this.advance();
      return {
        type: "NumberLiteral",
        value: parseInt(token.value)
      };
    }
    
    if (this.check(TokenType.IDENTIFIER)) {
      const token = this.advance();
      return {
        type: "Identifier",
        name: token.value
      };
    }
    
    const token = this.peek();
    throw new Error(`Unexpected token: ${token.value} at line ${token.line}, column ${token.column}`);
  }
}
