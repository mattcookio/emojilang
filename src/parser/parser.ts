import {
  AssignmentStatement,
  Expression,
  ExpressionStatement,
  PrintStatement,
  Program,
  Statement,
} from "../ast/ast";
import { Token, TokenType } from "../lexer/token";

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private currentToken: Token;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentToken = tokens[0];
  }

  private advance(): void {
    this.position++;
    if (this.position < this.tokens.length) {
      this.currentToken = this.tokens[this.position];
    }
  }

  private eat(tokenType: TokenType): Token {
    if (this.currentToken.type === tokenType) {
      const token = this.currentToken;
      this.advance();
      return token;
    }

    throw new Error(
      `Unexpected token: expected ${TokenType[tokenType]}, got ${
        TokenType[this.currentToken.type]
      } ` +
        `at line ${this.currentToken.line}, column ${this.currentToken.column}`
    );
  }

  // program ::= statement*
  public parse(): Program {
    const statements: Statement[] = [];

    while (this.currentToken.type !== TokenType.EOF) {
      statements.push(this.parseStatement());
    }

    return {
      type: "Program",
      statements,
    };
  }

  // statement ::= assignment_statement | print_statement | expression_statement
  private parseStatement(): Statement {
    if (
      this.currentToken.type === TokenType.IDENTIFIER &&
      this.tokens[this.position + 1]?.type === TokenType.ASSIGN
    ) {
      return this.parseAssignmentStatement();
    } else if (this.currentToken.type === TokenType.PRINT) {
      return this.parsePrintStatement();
    }

    return this.parseExpressionStatement();
  }

  // assignment_statement ::= identifier '=' expression ';'
  private parseAssignmentStatement(): AssignmentStatement {
    const identifier = this.eat(TokenType.IDENTIFIER).value;
    this.eat(TokenType.ASSIGN);
    const value = this.parseExpression();
    this.eat(TokenType.SEMICOLON);

    return {
      type: "AssignmentStatement",
      identifier,
      value,
    };
  }

  // print_statement ::= 'print' expression ';'
  private parsePrintStatement(): PrintStatement {
    this.eat(TokenType.PRINT);
    const expression = this.parseExpression();
    this.eat(TokenType.SEMICOLON);

    return {
      type: "PrintStatement",
      expression,
    };
  }

  // expression_statement ::= expression ';'
  private parseExpressionStatement(): ExpressionStatement {
    const expression = this.parseExpression();
    this.eat(TokenType.SEMICOLON);

    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  // expression ::= term (('+' | '-') term)*
  private parseExpression(): Expression {
    let left = this.parseTerm();

    while (
      this.currentToken.type === TokenType.PLUS ||
      this.currentToken.type === TokenType.MINUS
    ) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseTerm();

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right,
      };
    }

    return left;
  }

  // term ::= factor (('*' | '/') factor)*
  private parseTerm(): Expression {
    let left = this.parseFactor();

    while (
      this.currentToken.type === TokenType.MULTIPLY ||
      this.currentToken.type === TokenType.DIVIDE
    ) {
      const operator = this.currentToken.value;
      this.advance();
      const right = this.parseFactor();

      left = {
        type: "BinaryExpression",
        left,
        operator,
        right,
      };
    }

    return left;
  }

  // factor ::= number | identifier | '(' expression ')'
  private parseFactor(): Expression {
    const token = this.currentToken;

    switch (token.type) {
      case TokenType.NUMBER:
        this.advance();
        return {
          type: "NumberLiteral",
          value: parseInt(token.value, 10),
        };

      case TokenType.IDENTIFIER:
        this.advance();
        return {
          type: "Identifier",
          name: token.value,
        };

      case TokenType.LPAREN:
        this.advance();
        const expression = this.parseExpression();
        this.eat(TokenType.RPAREN);
        return expression;

      default:
        throw new Error(
          `Unexpected token: ${TokenType[token.type]} at line ${
            token.line
          }, column ${token.column}`
        );
    }
  }
}
