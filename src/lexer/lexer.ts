import { Token, TokenType } from "./token";

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null;

  constructor(source: string) {
    this.source = source;
    this.currentChar = this.source.length > 0 ? this.source[0] : null;
  }

  private advance(): void {
    this.position++;
    this.column++;

    if (this.position >= this.source.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.source[this.position];
      if (this.currentChar === "\n") {
        this.line++;
        this.column = 1;
      }
    }
  }

  private skipWhitespace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private skipComment(): void {
    // Skip the initial '//'
    this.advance();
    this.advance();

    // Skip until end of line or end of file
    while (this.currentChar !== null && this.currentChar !== "\n") {
      this.advance();
    }

    // Skip the newline if present
    if (this.currentChar === "\n") {
      this.advance();
    }
  }

  private readNumber(): Token {
    const startColumn = this.column;
    let result = "";

    while (this.currentChar !== null && /[0-9]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.NUMBER,
      value: result,
      line: this.line,
      column: startColumn,
    };
  }

  private readIdentifier(): Token {
    const startColumn = this.column;
    let result = "";

    while (this.currentChar !== null && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    // Check if the identifier is a reserved keyword
    if (result === "print") {
      return {
        type: TokenType.PRINT,
        value: result,
        line: this.line,
        column: startColumn,
      };
    }

    return {
      type: TokenType.IDENTIFIER,
      value: result,
      line: this.line,
      column: startColumn,
    };
  }

  public getNextToken(): Token {
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      // Skip comments
      if (
        this.currentChar === "/" &&
        this.position + 1 < this.source.length &&
        this.source[this.position + 1] === "/"
      ) {
        this.skipComment();
        continue;
      }

      // Numbers
      if (/[0-9]/.test(this.currentChar)) {
        return this.readNumber();
      }

      // Identifiers
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.readIdentifier();
      }

      // Single-character tokens
      const currentChar = this.currentChar;
      const line = this.line;
      const column = this.column;

      this.advance();

      switch (currentChar) {
        case "+":
          return { type: TokenType.PLUS, value: "+", line, column };
        case "-":
          return { type: TokenType.MINUS, value: "-", line, column };
        case "*":
          return { type: TokenType.MULTIPLY, value: "*", line, column };
        case "/":
          return { type: TokenType.DIVIDE, value: "/", line, column };
        case "=":
          return { type: TokenType.ASSIGN, value: "=", line, column };
        case ";":
          return { type: TokenType.SEMICOLON, value: ";", line, column };
        case "(":
          return { type: TokenType.LPAREN, value: "(", line, column };
        case ")":
          return { type: TokenType.RPAREN, value: ")", line, column };
        default:
          throw new Error(
            `Unexpected character: ${currentChar} at line ${line}, column ${column}`
          );
      }
    }

    // End of file
    return {
      type: TokenType.EOF,
      value: "",
      line: this.line,
      column: this.column,
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.getNextToken();

    while (token.type !== TokenType.EOF) {
      tokens.push(token);
      token = this.getNextToken();
    }

    tokens.push(token); // Add EOF token
    return tokens;
  }
}
