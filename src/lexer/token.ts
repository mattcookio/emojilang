// Token types for our minimal language
export enum TokenType {
  NUMBER, // Integer numbers
  IDENTIFIER, // Variable names
  PLUS, // +
  MINUS, // -
  MULTIPLY, // *
  DIVIDE, // /
  ASSIGN, // =
  SEMICOLON, // ;
  LPAREN, // (
  RPAREN, // )
  PRINT, // 'print' keyword
  EOF, // End of file
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
