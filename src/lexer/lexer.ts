import { Token, TokenType } from "./token";

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null = null;

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
      
      // Handle newlines for line counting
      if (this.currentChar === '\n') {
        this.line++;
        this.column = 1;
      }
    }
  }

  private skipWhitespace(): void {
    while (
      this.currentChar !== null &&
      /\s/.test(this.currentChar)
    ) {
      if (this.currentChar === '\n') {
        this.line++;
        this.column = 0;
      }
      this.advance();
    }
  }

  private readNumber(): Token {
    let result = '';
    const startColumn = this.column;
    
    while (
      this.currentChar !== null &&
      /[0-9]/.test(this.currentChar)
    ) {
      result += this.currentChar;
      this.advance();
    }
    
    return {
      type: TokenType.NUMBER,
      value: result,
      line: this.line,
      column: startColumn
    };
  }

  private readIdentifier(): Token {
    let result = '';
    const startColumn = this.column;
    
    while (
      this.currentChar !== null &&
      /[a-zA-Z0-9_]/.test(this.currentChar)
    ) {
      result += this.currentChar;
      this.advance();
    }
    
    return {
      type: TokenType.IDENTIFIER,
      value: result,
      line: this.line,
      column: startColumn
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    
    while (this.currentChar !== null) {
      // Skip whitespace
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }
      
      // Handle numbers
      if (/[0-9]/.test(this.currentChar)) {
        tokens.push(this.readNumber());
        continue;
      }
      
      // Handle identifiers
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        tokens.push(this.readIdentifier());
        continue;
      }
      
      // Handle emoji operators and symbols
      const currentColumn = this.column;
      
      // Check for multi-character emojis
      if (this.currentChar === '🤪' || this.source.substring(this.position, this.position + 2) === '🤪') {
        tokens.push({
          type: TokenType.ADD,
          value: '🤪',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      if (this.currentChar === '🥴' || this.source.substring(this.position, this.position + 2) === '🥴') {
        tokens.push({
          type: TokenType.SUBTRACT,
          value: '🥴',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      if (this.currentChar === '🤯' || this.source.substring(this.position, this.position + 2) === '🤯') {
        tokens.push({
          type: TokenType.MULTIPLY,
          value: '🤯',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      if (this.currentChar === '🍌' || this.source.substring(this.position, this.position + 2) === '🍌') {
        tokens.push({
          type: TokenType.ASSIGN,
          value: '🍌',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      if (this.currentChar === '🦄' || this.source.substring(this.position, this.position + 2) === '🦄') {
        tokens.push({
          type: TokenType.PRINT,
          value: '🦄',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      if (this.currentChar === '💩' || this.source.substring(this.position, this.position + 2) === '💩') {
        tokens.push({
          type: TokenType.SEMICOLON,
          value: '💩',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      // Handle loop tokens
      if (this.currentChar === '🔄' || this.source.substring(this.position, this.position + 2) === '🔄') {
        tokens.push({
          type: TokenType.WHILE,
          value: '🔄',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }

      if (this.currentChar === '🛑' || this.source.substring(this.position, this.position + 2) === '🛑') {
        tokens.push({
          type: TokenType.END,
          value: '🛑',
          line: this.line,
          column: currentColumn
        });
        this.advance();
        continue;
      }
      
      // Skip comments
      if (this.currentChar === '/' && this.position + 1 < this.source.length && this.source[this.position + 1] === '/') {
        while (this.currentChar !== null && this.currentChar !== '\n' as string) {
          this.advance();
        }
        continue;
      }
      
      // Skip unknown characters
      this.advance();
    }
    
    // Add EOF token
    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column
    });
    
    return tokens;
  }
}
