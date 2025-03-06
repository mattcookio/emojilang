section .text
global _main

; Function to print a number
_print_number:
  push rbp
  mov rbp, rsp
  sub rsp, 32
  cmp rdi, 0
  jne .L_not_zero
  mov byte [rsp+1], '0'
  mov byte [rsp+2], 10
  lea rsi, [rsp+1]
  mov rdx, 2
  jmp .L_print
.L_not_zero:
  mov rax, rdi
  mov rcx, 10
  lea r8, [rsp+30]
  mov byte [r8], 10
  dec r8
.L_convert_loop:
  xor rdx, rdx
  div rcx
  add dl, '0'
  mov [r8], dl
  dec r8
  test rax, rax
  jnz .L_convert_loop
  inc r8
  lea rsi, [r8]
  lea rdx, [rsp+30]
  sub rdx, r8
  inc rdx
.L_print:
  mov rax, 0x2000004
  mov rdi, 1
  syscall
  leave
  ret

_main:
  push rbp
  mov rbp, rsp
  sub rsp, 32

  mov rax, 5
  mov [rbp-8], rax

  mov rax, [rbp-8]
  mov rdi, rax
  call _print_number

  mov rax, 1
  mov [rbp-16], rax

  mov rax, [rbp-8]
  push rax
  mov rax, [rbp-16]
  pop rcx
  imul rax, rcx
  mov [rbp-16], rax

  mov rax, 1
  push rax
  mov rax, [rbp-8]
  pop rcx
  sub rax, rcx
  mov [rbp-8], rax

  mov rax, [rbp-16]
  mov rdi, rax
  call _print_number

  mov rax, [rbp-8]
  push rax
  mov rax, [rbp-16]
  pop rcx
  imul rax, rcx
  mov [rbp-16], rax

  mov rax, 1
  push rax
  mov rax, [rbp-8]
  pop rcx
  sub rax, rcx
  mov [rbp-8], rax

  mov rax, [rbp-16]
  mov rdi, rax
  call _print_number

  mov rax, [rbp-8]
  push rax
  mov rax, [rbp-16]
  pop rcx
  imul rax, rcx
  mov [rbp-16], rax

  mov rax, 1
  push rax
  mov rax, [rbp-8]
  pop rcx
  sub rax, rcx
  mov [rbp-8], rax

  mov rax, [rbp-16]
  mov rdi, rax
  call _print_number

  mov rax, [rbp-8]
  push rax
  mov rax, [rbp-16]
  pop rcx
  imul rax, rcx
  mov [rbp-16], rax

  mov rax, 1
  push rax
  mov rax, [rbp-8]
  pop rcx
  sub rax, rcx
  mov [rbp-8], rax

  mov rax, [rbp-16]
  mov rdi, rax
  call _print_number

  mov rax, [rbp-8]
  push rax
  mov rax, [rbp-16]
  pop rcx
  imul rax, rcx
  mov [rbp-16], rax

  mov rax, [rbp-16]
  mov rdi, rax
  call _print_number

  mov rax, 0x2000001
  xor rdi, rdi
  syscall
