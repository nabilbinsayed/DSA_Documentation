# Data Types — Primitive and Non-Primitive

> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

A **data type** is a classification that tells a system two things: what kind of value a variable holds, and what operations are legal on that value. Every variable has a type — even if the language does not force you to declare it explicitly.

Understanding data types is not just a formality. It determines memory layout, operation cost, and what you can meaningfully do with a piece of data.

---

## What is a Data Type?

Formally, a data type is defined by three things:

1. **A domain** — the set of values it can represent. An 8-bit unsigned integer can represent $\{0, 1, 2, \ldots, 255\}$.
2. **A set of operations** — what you can legally do with it. You can add integers; the result of adding two booleans is not mathematically meaningful in the same sense.
3. **A representation** — how values are encoded in memory. A float uses IEEE 754; an integer uses two's complement.

---

## Primitive Data Types

**Primitive data types** are the atomic types provided by the language or hardware. They are not built from other types — they map directly to operations the CPU can perform natively.

### Integer

Represents whole numbers, stored in a fixed number of bits.

| Variant | Bits | Range (signed) |
|---|---|---|
| `byte` / `char` | 8 | $-128$ to $127$ |
| `short` | 16 | $-32{,}768$ to $32{,}767$ |
| `int` | 32 | $-2^{31}$ to $2^{31} - 1$ |
| `long` | 64 | $-2^{63}$ to $2^{63} - 1$ |

Signed integers use **two's complement** representation. The most significant bit is the sign bit.

For a signed $n$-bit integer:

$$\text{Range} = -2^{n-1} \text{ to } 2^{n-1} - 1$$

Unsigned variants shift the range to start from 0:

$$\text{Unsigned } n\text{-bit range} = 0 \text{ to } 2^n - 1$$

> [!warning] Integer overflow is silent in most languages
> If you add 1 to a signed 32-bit integer holding $2^{31} - 1$, it wraps around to $-2^{31}$. C and C++ do not raise an error. This is a common source of hard-to-find bugs.

---

### Float / Real

Represents numbers with fractional parts, using **floating-point** encoding (IEEE 754).

| Variant | Bits | Approx. Range | Precision |
|---|---|---|---|
| `float` | 32 | $\pm 3.4 \times 10^{38}$ | ~7 decimal digits |
| `double` | 64 | $\pm 1.8 \times 10^{308}$ | ~15 decimal digits |

A floating-point number is represented as:

$$\text{value} = (-1)^s \times m \times 2^e$$

Where $s$ is the sign bit, $m$ is the mantissa, and $e$ is the exponent.

> [!warning] Floats are not exact
> $0.1 + 0.2 \neq 0.3$ in floating-point arithmetic. The decimal $0.1$ has no exact binary representation — it is stored as a rounded approximation. Never use `==` to compare floats. Use a tolerance: $|a - b| < \epsilon$.

---

### Character

Represents a single symbol, stored internally as an integer mapped to a character encoding.

- **ASCII:** 7-bit encoding, 128 characters. `'A'` = 65, `'a'` = 97, `'0'` = 48.
- **Unicode (UTF-16):** Covers all world scripts. Java and C# use 16-bit `char`.

Because characters are stored as integers, arithmetic on them is valid:

```cpp
char c = 'A';
c = c + 1;  // c is now 'B'
```

---

### Pointer

A pointer stores a **memory address** — the location in memory where another value lives. It is the primitive type that makes all dynamic data structures possible.

```
ptr → [value at address]
```

If `ptr` holds address `0x7ffd3a`, dereferencing `ptr` reads the value at that memory address.

**Pointer arithmetic:** adding 1 to a pointer moves it forward by the size of the pointed-to type. A pointer to `int` (4 bytes) incremented by 1 advances 4 bytes.

> [!note] Pointers are the foundation of non-primitive structures
> Arrays, linked lists, trees, and graphs are all built using pointers. A linked list node contains data and a pointer to the next node. Understanding pointers is prerequisite to understanding any dynamic data structure.

---

## Non-Primitive Data Types

**Non-primitive data types** are constructed from primitive types. They organize multiple values — possibly of different types — into a named entity with defined structure.

### Array

A fixed-size, ordered collection of elements of the **same type**, stored in **contiguous memory**.

```
arr: [ 10 | 20 | 30 | 40 | 50 ]
       0    1    2    3    4
```

- Access by index: $O(1)$ — address computed directly as $\text{Base} + i \times w$
- Insertion/deletion in middle: $O(n)$ — elements must shift
- Fixed size: must be declared at creation

**Three notations** for subscripted variables (as in the lecture):
- Subscript: $A_k$
- Parenthesis: $A(k)$
- Bracket: $A[k]$ *(mostly used)*

---

### Record / Structure

A collection of **named fields** of **possibly different types**, grouped under one name.

```c
struct Student {
    char name[50];
    int roll;
    float gpa;
};
```

Fields are stored contiguously in memory in declaration order (with possible alignment padding). Records let you treat related data as a single unit.

---

### Class

A record with associated **behavior** (methods). The foundation of object-oriented programming.

```python
class Student:
    def __init__(self, name, roll):
        self.name = name
        self.roll = roll

    def display(self):
        print(f"{self.name}: {self.roll}")
```

---

### Enumeration

A named set of integer constants, giving meaningful names to otherwise magic numbers.

```c
enum Day { MON=0, TUE, WED, THU, FRI, SAT, SUN };
```

`MON` is 0, `TUE` is 1, and so on. Using `Day.MON` instead of `0` makes code self-documenting.

---

### String

A sequence of characters. In C, a string is a null-terminated array of `char`. In Python, Java, and C#, strings are immutable objects.

```c
char str[] = "hello";   // stored as: ['h','e','l','l','o','\0']
```

The null terminator `'\0'` marks the end of the string in C. Strings support storage via:

- **Fixed-length structures** — arrays
- **Variable-length structures** — pointer arrays
- **Linked structure** — linked lists

---

## Type Systems

### Static vs Dynamic Typing

| Property | Static | Dynamic |
|---|---|---|
| Type checked at | Compile time | Runtime |
| Examples | C, C++, Java, C# | Python, JavaScript |
| Error detection | Early | Late |

### Strong vs Weak Typing

| Property | Strong | Weak |
|---|---|---|
| Implicit conversions | Rare or none | Common |
| Examples | Python, Java | C, JavaScript |

---

## Memory Representation Summary

| Type | Memory | Notes |
|---|---|---|
| `int` (32-bit) | 4 bytes | Two's complement |
| `float` (32-bit) | 4 bytes | IEEE 754 |
| `double` (64-bit) | 8 bytes | IEEE 754 |
| `char` | 1 byte | ASCII or UTF unit |
| `bool` | 1 byte (typically) | Stored as 0 or 1 |
| Pointer (64-bit system) | 8 bytes | Memory address |
| Array of $n$ ints | $4n$ bytes | Contiguous |
| Struct | Sum of field sizes + padding | Alignment-dependent |

---

## Common Misconceptions

> [!warning] "A string is a primitive type"
> Strings feel primitive because of their special syntax (`"hello"`), but a string is a sequence of characters. Its operations cost more than $O(1)$, and in Python, Java, and C# it is an immutable object. It is non-primitive.

> [!warning] "Float is just a more precise integer"
> Floats are not more precise — they are *differently* precise. Integers are exact within their range. Floats represent a vastly wider range, but introduce rounding error. For financial calculations, use fixed-point or decimal types.

> [!warning] "Pointers are dangerous and should be avoided"
> Pointers require care, but they underlie every dynamic data structure. High-level languages hide pointers internally — they do not eliminate them. Understanding pointers is necessary for understanding how data structures actually work in memory.

> [!warning] "bool is stored as 1 bit"
> A boolean is conceptually 1 bit, but almost always stored as 1 byte for memory alignment reasons.

---

## Practice Problems

1. What is the range of a signed 16-bit integer? Derive from first principles — Classic — Easy
2. Why does `0.1 + 0.2 != 0.3` in Python? Explain using floating-point representation — Classic — Easy
3. Given a struct with fields `char`, `int`, `double` — calculate its size in memory accounting for alignment — Classic — Medium
4. Implement a simple enum in C and use it in a weekday calculator to eliminate magic numbers — Classic — Easy
5. Compare memory usage of storing 1000 booleans as `bool[]` vs packing them into `int[]` with bitwise operations — Classic — Medium

---

## Cheat Sheet

| | Primitive | Non-Primitive |
|---|---|---|
| Built from | Hardware/language | Other types |
| Examples | int, float, char, pointer | array, struct, class, string |
| Memory | Fixed, known at compile time | Variable or computed |
| Operations | CPU-native, $O(1)$ | Depends on structure |

**Key integer formulas:**
$$\text{Signed } n\text{-bit range: } -2^{n-1} \text{ to } 2^{n-1} - 1$$
$$\text{Unsigned } n\text{-bit range: } 0 \text{ to } 2^n - 1$$

**Float gotcha:** Never compare with `==`. Use $|a - b| < \epsilon$.

**Pointer arithmetic:** `ptr + k` moves forward $k \times \text{sizeof(type)}$ bytes.
