# 🤪 EmojiLang Syntax Highlighter 🤪

A VS Code extension that provides syntax highlighting for the EmojiLang programming language with goofy emoji operators.

## Features

This extension provides syntax highlighting for EmojiLang files (`.emoji` extension), including:

- Colorful highlighting for emoji operators:
  - Addition: `🤪` (crazy face)
  - Subtraction: `🥴` (woozy face)
  - Multiplication: `🤯` (mind blown)
  - Assignment: `🍌` (banana)
  - Print: `🦄` (unicorn)
  - While loop: `🔄` (repeat arrow)
  - End loop: `🛑` (stop sign)
  - Statement terminator: `💩` (poop emoji)
- Highlighting for numbers and variable names
- Comment highlighting

## Example

```
// Set a variable
x 🍌 5 💩

// Print it
🦄 x 💩

// Do some math
y 🍌 10 🤪 x 🤯 2 💩

// Print the result
🦄 y 💩

// Loop example
i 🍌 1 💩
🔄 i 🤪 1 🥴 10 💩  // while i <= 10
  🦄 i 💩
  i 🍌 i 🤪 1 💩
🛑 💩
```

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "EmojiLang"
4. Click Install

### Manual Installation

1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X)
4. Click on the "..." menu in the top-right of the Extensions panel
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

## Building the Extension

If you want to build the extension yourself:

1. Clone this repository
2. Run `npm install -g vsce` to install the VS Code Extension Manager
3. Run `vsce package` in the extension directory
4. This will generate a `.vsix` file that you can install manually

## About EmojiLang

EmojiLang is a minimal compiled programming language with goofy emoji syntax. It's designed to demonstrate compiler concepts in a fun and playful way.

For more information about the EmojiLang compiler, visit the [EmojiLang repository](https://github.com/yourusername/emojilang).

## License

MIT
