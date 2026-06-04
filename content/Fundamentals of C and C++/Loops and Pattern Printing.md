# Loops and Pattern Printing: Iteration Control, Digit Math, and Nested Grid Layouts

Looping structures are the engines of programming, allowing us to repeat blocks of logic, process collections of data, and generate repetitive visual patterns. However, selecting the right loop structure and coordinating nested loops to print structured outputs requires a firm grasp of both control flow and geometry.

In this guide, we will explore the three main looping constructs in C/C++: `while`, `do-while`, and `for` loops. We will trace digit-manipulation algorithms (counting and reversing integers) to see how conditional loops behave, analyze a common floating-point bug when using `pow()` in loops, and walk through the nested loop mechanics of printing a centered star pyramid.

---

## 1. What is Loops and Pattern Printing?

### Formal Definition
**Loops** are control structures that repeatedly execute a block of statements as long as a specified condition remains `true`. **Pattern Printing** is the use of nested loops to map 2D coordinates into a grid of characters, where the outer loop iterates over the vertical rows (Y-axis) and the inner loops iterate over the horizontal columns (X-axis).

### Intuitive Explanation
A loop is like a treadmill. You step on it and keep running (repeating steps) until the timer stops (the condition becomes `false`), at which point you step off. 
- A **while loop** checks the condition *before* you start running. If it's already false, you never run.
- A **do-while loop** guarantees you run *at least once* before checking the condition.
- A **for loop** is a structured treadmill that tracks exactly how many steps you take using a counter.

When we nest loops (put one inside another), we create a grid. Think of a typewriter or a loom weaving fabric: the machine moves row-by-row (outer loop). For each row, it prints characters from left to right (inner loops), and then prints a newline to slide down to the next row. By mathematical coordinating character counts across rows, we can print grids, triangles, diamonds, and pyramids.

### The Typist Loom Analogy (Mechanical Mapping)
Let's map this nested mechanics directly to a loom weaving a pattern. Suppose we want to weave a right-angled triangle of stars:

```
Row 1: *
Row 2: * *
Row 3: * * *
Row 4: * * * *
```

The loom operates on two coordinates:
1. **Outer Crank (Row Index $i$):** Sets the current row, moving vertically downward from $1$ to $4$.
2. **Inner Shuttle (Column Index $j$):** Shoots the shuttle across the row to print stars.
   - For Row 1 ($i=1$), the shuttle shoots $1$ time.
   - For Row 2 ($i=2$), the shuttle shoots $2$ times.
   - For Row $i$, the shuttle shoots exactly $i$ times.
3. At the end of each row, a mechanical carriage return (`\n`) resets the shuttle to the left and feeds the fabric down.

---

## 2. The Core Idea

### The Math of Digit Extraction
Modulo (`%`) and integer division (`/`) on base-10 numbers allow us to slice integers digit-by-digit:
- **`n % 10`** yields the **last digit** of $n$ (e.g., $123 \pmod{10} = 3$).
- **`n / 10`** **removes** the last digit of $n$ (e.g., $\lfloor 123 / 10 \rfloor = 12$ in integer math).

By looping this division until $n = 0$, we can process a number from right to left.

### Why `do-while` Matters for Digits
A common task is counting the digits of an integer. If we write a standard pre-test loop:
```c
while (n > 0) {
    n /= 10;
    count++;
}
```
If the user inputs `0`, the condition `0 > 0` is false. The loop never runs, and the count remains `0`. However, mathematically, the number `0` is a 1-digit number. 

By using a **do-while loop**, we execute the body before testing the condition:
```c
do {
    n /= 10;
    count++;
} while (n > 0);
```
Entering `0` runs the loop body once, divides `0 / 10 = 0`, increments `count` to `1`, and then terminates because `n > 0` is false. The output is correctly `1`.

### Centering a Star Pyramid
To print a centered pyramid of height $H$, each row $i$ (from $1$ to $H$) must consist of two components:
1. **Leading Spaces**: To push the stars to the center, we print spaces. The number of spaces decreases as we move down. For row $i$, the number of spaces is $H - i$.
2. **Stars**: The number of stars increases on an odd number scale: $1, 3, 5, 7, \dots$. For row $i$, the number of stars printed is $2i - 1$.

```
H = 4
Row 1 (i=1): 3 spaces, 1 star  -> [   * ]
Row 2 (i=2): 2 spaces, 3 stars -> [  *** ]
Row 3 (i=3): 1 space,  5 stars -> [ ***** ]
Row 4 (i=4): 0 spaces, 7 stars -> [*******]
```

---

## 3. Pseudocode (CLRS Style)

Below is the pseudocode showing how nested loops print a centered pyramid.

```text
PRINT-PYRAMID(rows)
1  for i = 1 to rows
2      // Print leading spaces
3      for j = 1 to rows - i
4          print " "
5      // Print odd-scaled stars
6      for k = 1 to 2 * i - 1
7          print "*"
8      print newline
```

---

## 4. Implementation

### C Implementation
This includes our codebase examples showing digit manipulation, the `do-while` safety structure, and nested loop coordinate layout.
```c
#include <stdio.h>
#include <math.h>

// Counts digits safely (from chap_6/num_digits.c)
int count_digits(unsigned long long int n)
{
    int digits = 0;
    do {
        n = n / 10;
        digits++;
    } while (n > 0);
    return digits;
}

// Reverses digits (revising chap_6/num_reversal.c to avoid pow() cast errors)
unsigned long long int reverse_digits(unsigned long long int n)
{
    unsigned long long int rev = 0;
    while (n > 0)
    {
        rev = rev * 10 + (n % 10);
        n /= 10;
    }
    return rev;
}

// Prints centered star pyramid (from chap_6/Nested_Loops/pyramid.c)
void print_pyramid(int rows)
{
    for (int i = 1; i <= rows; i++)
    {
        // Inner loop 1: Spaces
        for (int j = 1; j <= rows - i; j++)
        {
            printf("  ");
        }
        // Inner loop 2: Stars (spaced out for cleaner grid alignment)
        for (int k = 1; k <= 2 * i - 1; k++)
        {
            printf("* ");
        }
        printf("\n");
    }
}

int main()
{
    unsigned long long int num = 12045;
    printf("Number: %llu\n", num);
    printf("Digits: %d\n", count_digits(num));
    printf("Reversed: %llu\n\n", reverse_digits(num));

    printf("Pyramid of 5 rows:\n");
    print_pyramid(5);
    return 0;
}
```

### C++ Implementation
C++ loops have the same syntax, but allow inline loop variable declarations (which limit loop variables to the loop scope).
```cpp
#include <iostream>

void printPyramidCpp(int rows)
{
    for (int i = 1; i <= rows; ++i)
    {
        for (int j = 1; j <= rows - i; ++j)
            std::cout << "  ";
        for (int k = 1; k <= 2 * i - 1; ++k)
            std::cout << "* ";
        std::cout << "\n";
    }
}

int main()
{
    printPyramidCpp(4);
    return 0;
}
```

### Python Implementation
Python uses indentation instead of curly braces. Python `for` loops iterate over a `range` object, which is half-open (excludes the upper bound).
```python
def reverse_digits(n: int) -> int:
    rev = 0
    while n > 0:
        rev = (rev * 10) + (n % 10)
        n //= 10
    return rev

def print_pyramid(rows: int):
    for i in range(1, rows + 1):
        # Python allows string multiplication to print spaces/stars cleanly
        spaces = "  " * (rows - i)
        stars = "* " * (2 * i - 1)
        print(spaces + stars)

if __name__ == "__main__":
    print(f"Reversed: {reverse_digits(12045)}")
    print("Pyramid:")
    print_pyramid(5)
```

---

## 5. Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | In-place? |
|---|---|---|---|
| Digit Count / Reversal | $O(\log_{10} n)$ | $O(1)$ | Yes |
| Pyramid Print ($R$ rows) | $O(R^2)$ | $O(1)$ | Yes |

### Mathematical Proof of Digit Loop Complexity
In digit counting and reversal, the loop performs integer division:
$$n_{k+1} = \lfloor \frac{n_k}{10} \rfloor$$
Let $k$ be the number of steps. The loop terminates when the value reaches $0$.
$$\frac{n}{10^k} < 1 \implies n < 10^k$$
Taking the base-10 logarithm:
$$\log_{10}(n) < k$$
Thus, the loop executes exactly $\lfloor \log_{10}(n) \rfloor + 1$ times. Since each iteration performs a constant number of arithmetic operations ($O(1)$), the total time complexity is logarithmic:
$$\text{Time Complexity} = O(\log_{10} n)$$

### Space Complexity Analysis
All variations shown run in **$O(1)$ auxiliary space**. The variables allocated (`i`, `j`, `k`, `digits`, `rev`) are primitive integer registers. They do not grow with the input value or number of rows.

---

## 6. Worked Examples

### Example 1: do-while Digit Counting
In `C_Through/C_Prog/chap_6_Loops/num_digits.c`, we count digits using:
```c
  do {
    n = n / 10;
    digits++;
  } while (n > 0);
```
If we input `0`, execution enters the loop immediately, divides `0 / 10 = 0`, increments `digits` to `1`, and then evaluates `0 > 0` as `false`, exiting. This correctly identifies `0` as having `1` digit, which a standard `while (n > 0)` loop would fail to do.

### Example 2: The Floating-Point `pow()` Cast Bug in Reversal
In `C_Through/C_Prog/chap_6_Loops/num_reversal.c`, we reverse digits using:
```c
  for (int i = digits - 1; i >= 0; i--, m /= 10) {
    rev += (m % 10) * pow(10, i);
  }
```
#### **The Precision Bug:**
While this code runs correctly on many compilers, it contains a dangerous trap. The `pow(x, y)` function from `<math.h>` returns a double-precision floating-point number (`double`). 
Casting a `double` to an `int` or `unsigned long long` truncates the decimal. On some platforms, `pow(10, 2)` may return a floating-point representation of `99.99999999999997` due to precision limits. When cast directly to an integer type, C truncates this to `99` instead of `100`, introducing a severe arithmetic error.

#### **The Fix (Accumulator Method):**
We rewrite the reversal math to use pure integer operations without floating-point libraries. By shifting our accumulator left by one base decimal space (`rev * 10`) and adding the units digit (`n % 10`), we avoid floating-point cast bugs entirely:
```c
unsigned long long int rev = 0;
while (n > 0) {
    rev = rev * 10 + (n % 10);
    n /= 10;
}
```
This version uses only fast integer registers and is free of precision errors.

### Example 3: Spaced Centered Pyramid Layout
In `C_Through/C_Prog/chap_6_Loops/Nested_Loops/pyramid.c`, we coordinate spaces and stars:
```c
  for (int i = 1; i <= rows; i++) {
    for (int j = 1; j <= rows - i; j++) {
      printf("  "); // double space
    }
    for (int k = 1; k <= 2 * i - 1; k++) {
      printf("* "); // star + space
    }
    printf("\n");
  }
```
Notice that we print `"  "` (two spaces) in the first inner loop, and we print `"* "` (a star and a space) in the second inner loop. Because a star and space occupies exactly the same width as two spaces, the layout remains perfectly aligned on the screen. If we printed a single space in the first loop and a single star in the second, the alignment would collapse into an asymmetric, skewed triangle.

---

## 7. Practice Problems

1. **Print an Inverted Pyramid:**
   Write a function `void print_inverted_pyramid(int rows)` that prints a centered star pyramid upside down. For example, if `rows = 3`:
   ```text
   *****
    ***
     *
   ```
2. **Print a Hollow Rectangle:**
   Write a program that takes `height` and `width` as input, and prints a hollow rectangle of stars. Stars should only appear on the boundary lines:
   ```text
   ****
   *  *
   ****
   ```
3. **Calculate GCD (Euclidean Algorithm):**
   Using a `while` loop, implement the Euclidean Algorithm for finding the Greatest Common Divisor (GCD) of two integers. The logic: while $b \neq 0$, update $temp = b$, $b = a \pmod b$, and $a = temp$. Return $a$.

---

## 8. Cheat Sheet

### Loop Syntax Comparison
```c
// 1. While Loop (Check condition first, execute 0 or more times)
while (condition) {
    // statements
}

// 2. Do-While Loop (Execute once, check condition, repeat 1 or more times)
do {
    // statements
} while (condition);

// 3. For Loop (Initialize, check condition, execute, increment)
for (initialization; condition; increment) {
    // statements
}
```

### Loop Direction Rules of Thumb
- **Count-controlled loops:** Use a `for` loop if you know the exact number of iterations beforehand (e.g., looping through array indices).
- **Condition-controlled loops:** Use a `while` loop if the termination condition is dependent on values computed inside the loop (e.g., digit division, menu systems).
- **Guaranteed execution loops:** Use a `do-while` loop if you must execute the statements at least once (e.g., input checking, reading digits).
- **Coordinate coordinate matching:** When printing a grid, remember that the outer loop variable represents the **row number**, and the inner loop variables represent the **column items** on that row.
