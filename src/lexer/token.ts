// Token types for our goofy emoji-based minimal language
export enum TokenType {
  NUMBER,     // Integer numbers
  IDENTIFIER, // Variable names
  ADD,        // 🤪
  SUBTRACT,   // 🥴
  MULTIPLY,   // 🤯
  ASSIGN,     // 🍌
  PRINT,      // 🦄
  SEMICOLON,  // 💩
  WHILE,      // 🔄
  END,        // 🛑
  EOF,        // End of file
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
