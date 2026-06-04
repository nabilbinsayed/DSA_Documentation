# Control Flow and Selection Statements: Branching Logic, Short-Circuiting, and Switch Jumps

When a program runs, execution starts at the first line and moves sequentially downward. However, for a program to do anything useful, it must make decisions. It must take different paths depending on user input, calculations, or system states. This decision-making is controlled by **Selection Statements**.

In this guide, we will explore selection statements in C/C++: standard and cascaded `if-else` branching, logical operators, the mechanics of short-circuit evaluation, and `switch-case` jumps. We will study concrete examples, such as calculating sliding commissions, formatting legal calendar dates, and leveraging short-circuiting to prevent division-by-zero crashes.

---

## 1. What is Control Flow and Selection Statements?

### Formal Definition
**Control Flow** refers to the order in which individual statements, instructions, or function calls of an imperative program are executed or evaluated. **Selection Statements** (or conditionals) are control structures that direct execution along one of multiple paths based on the boolean evaluation of a condition (e.g., `if`, `if-else`, and `switch`).

### Intuitive Explanation
Think of your program's execution as a train traveling down a track. If the tracks are straight, the train visits every station in order. This is sequential execution. 

Selection statements act as **railway switches** (or track splits). When the train reaches a split, the switch lever shifts left or right depending on a specific condition (e.g., "Is the transaction value under $2500?"). The train takes the corresponding track, completely skipping the stations on the other track. Once the branch completes, the tracks merge back together, and sequential execution resumes.

### The Railway Switch Analogy (Mechanical Mapping)
Let’s map this mechanics directly to code. Consider a railroad track that splits into three paths:

```
                  /---> [ Track A: Value < 2500 ] ---\
--- [ Train ] --->----> [ Track B: Value < 6250 ] ----+---> [ Resume main line ]
                  \---> [ Track C: Default ] ---------/
```

- When the train approaches, a sensor checks the train's value. 
- If the value is under $2500, the track switches to **Track A**. The train travels through Track A, bypasses Tracks B and C entirely, and rejoins the main line.
- Each track represents a block of code inside an `if` or `else if` branch. The switch mechanism ensures that **one and only one** track is traveled by the train.

---

## 2. The Core Idea

### Cascaded Conditionals (`if-else` cascades)
When we have multiple mutually exclusive conditions, we stack them into a cascade:
```c
if (condition_1) {
    // Path 1
} else if (condition_2) {
    // Path 2
} else {
    // Fallback Path
}
```
The program tests conditions sequentially from top to bottom. As soon as one condition evaluates to `true` (non-zero in C), its block runs, and the entire remainder of the cascade is skipped.

### The Switch Statement and Jump Tables
A `switch` statement is a specialized selection structure that compares a single integer (or character) expression against multiple constant values (`case` labels). 

Unlike a cascaded `if-else` which evaluates each condition one by one, a `switch` is often optimized by the compiler into a **Jump Table**—an array of instruction addresses. Instead of comparing $N$ times, the program performs a single mathematical offset calculation to jump directly to the matching case label in $O(1)$ constant time.

#### **The Fall-Through Mechanism and `break`**
When the program jumps to a case label, it executes that case's code. However, it will **continue executing** subsequent cases automatically (falling through) unless it hits a `break` statement. This fall-through behavior is extremely useful for grouping multiple inputs that share the same output (e.g., matching days 1, 21, and 31 to the "st" suffix).

### Logical Operators and Short-Circuit Evaluation
In C/C++, logical expressions are evaluated from left to right using **short-circuit evaluation**:
- **AND (`&&`)**: If the left operand is `false` (0), the entire expression is guaranteed to be `false`. The compiler **does not evaluate** the right operand.
- **OR (`||`)**: If the left operand is `true` (non-zero), the entire expression is guaranteed to be `true`. The compiler **does not evaluate** the right operand.

This is not just a performance optimization; it is a critical safety tool. We can place a safety guard on the left to prevent a fatal crash on the right:
```c
if (i != 0 && j / i > 0)
```
If `i == 0`, the left side is `false`. The right side—which would cause a division-by-zero crash—is never executed.

---

## 3. Pseudocode (CLRS Style)

Below is the pseudocode showing how logical short-circuiting guards division operations.

```text
DIVIDE-SAFE(numerator, denominator)
1  if denominator != 0 and (numerator / denominator) > 1
2      print "Fraction is greater than 1"
3  else
4      print "Fraction is invalid or less than or equal to 1"
```

---

## 4. Implementation

### C Implementation
This includes the logic from our codebase demonstrating cascaded conditionals, switch case labels, and short-circuit evaluation.
```c
#include <stdio.h>

// Demonstrates a cascaded if-else (from chap_5/broker.c)
float calculate_commission(float value)
{
    float comm;
    if (value < 2500.0f)
        comm = 30.0f + 0.017f * value;
    else if (value < 6250.0f)
        comm = 56.0f + 0.0066f * value;
    else if (value < 20000.0f)
        comm = 76.0f + 0.0034f * value;
    else
        comm = 100.0f + 0.0022f * value;

    if (comm < 39.0f)
        comm = 39.0f; // Minimum commission limit

    return comm;
}

// Demonstrates switch-case grouping (from chap_5/date_legal_form.c)
void print_day_suffix(int day)
{
    switch (day)
    {
        case 1:  case 21: case 31:
            printf("st");
            break;
        case 2:  case 22:
            printf("nd");
            break;
        case 3:  case 23:
            printf("rd");
            break;
        default:
            printf("th");
            break;
    }
}

// Demonstrates short-circuit safety (from chap_5/short_circuit.c)
void test_short_circuit(int i, int j)
{
    int safe_result;
    // The left check (i != 0) guards against division-by-zero on the right (j / i > 0)
    safe_result = (i != 0) && (j / i > 0);
    printf("Short-circuit result for i=%d: %d\n", i, safe_result);
}

int main()
{
    printf("Commission for $3000 trade: $%.2f\n", calculate_commission(3000.0f));
    
    printf("Dated this 22");
    print_day_suffix(22);
    printf(" day of June.\n");
    
    test_short_circuit(0, 5); // Safe! Will not crash
    return 0;
}
```

### C++ Implementation
C++ uses the same selection syntax, but allows declaration of variables directly within the condition block since C++17.
```cpp
#include <iostream>
#include <string>

void testCppSwitch(char code)
{
    // C++17 allows init-statements inside if/switch
    switch (char upperCode = toupper(code); upperCode)
    {
        case 'A':
            std::cout << "Action Approved" << std::endl;
            break;
        case 'D':
            std::cout << "Action Denied" << std::endl;
            break;
        default:
            std::cout << "Unknown Status" << std::endl;
            break;
    }
}

int main()
{
    testCppSwitch('a');
    return 0;
}
```

### Python Implementation
Python does not use curly braces `{}` or `switch` statements (instead using `if-elif-else` and the `match-case` pattern introduced in Python 3.10). Python also uses readable operators `and`, `or`, and `not` which behave with the same short-circuit logic.
```python
def calculate_commission(value: float) -> float:
    if value < 2500.0:
        comm = 30.0 + 0.017 * value
    elif value < 6250.0:
        comm = 56.0 + 0.0066 * value
    else:
        comm = 100.0 + 0.0022 * value
        
    return max(comm, 39.0)

def match_day_suffix(day: int) -> str:
    # Python 3.10+ Pattern Matching
    match day:
        case 1 | 21 | 31:
            return "st"
        case 2 | 22:
            return "nd"
        case 3 | 23:
            return "rd"
        case _:
            return "th"

def test_short_circuit(i: int, j: int):
    # 'and' short-circuits in python exactly like C's '&&'
    safe_result = (i != 0) and (j // i > 0)
    print(f"Python short-circuit result: {safe_result}")

if __name__ == "__main__":
    print(f"Commission: ${calculate_commission(3000.0)}")
    print(f"Dated this 22{match_day_suffix(22)} day of June.")
    test_short_circuit(0, 5)
```

---

## 5. Complexity Analysis

| Statement Type | Time Complexity | Space Complexity |
|---|---|---|
| Single `if-else` | $O(1)$ | $O(1)$ |
| Cascaded `if-else` ($N$ conditions) | $O(N)$ (Worst Case) / $O(1)$ (Average Case) | $O(1)$ |
| `switch-case` (with Jump Table) | $O(1)$ | $O(1)$ |

### Mathematical and Compiler Optimization Analysis
- **Cascaded `if-else` Time Complexity**: In the worst-case, the program must evaluate every condition in the cascade. If there are $N$ branches, it takes $O(N)$ comparisons.
- **`switch-case` Time Complexity**: When the case labels are dense (e.g., integers ranging sequentially from 1 to 12), the compiler generates a **jump table**. The program retrieves the jump destination in a single array indexing step:
  $$\text{Address} = \text{TableBase} + \text{ExpressionValue} \times \text{WordSize}$$
  This offset calculation takes constant $O(1)$ time, making the execution speed independent of the number of cases. If the cases are highly sparse, the compiler falls back to a binary search tree of comparisons, yielding $O(\log N)$ time.
- **Space Complexity**: Selection statements only allocate local evaluation stack memory, running in $O(1)$ constant space.

---

## 6. Worked Examples

### Example 1: The Broker's sliding commission scale
In `C_Through/C_Prog/chap_5_selection_statements/broker.c`, we read a transaction size and compute a sliding commission fee.
The critical design decision is the ordering of the conditionals:
```c
if (value < 2500)      // Range 1
    ...
else if (value < 6250) // Range 2
    ...
```
Because the conditionals are cascaded, we do not need to write double boundaries like `value >= 2500 && value < 6250`. If the program reaches the second check (`value < 6250`), it has already failed the first check, meaning `value >= 2500` is implicitly guaranteed. This simplifies our code logic.

### Example 2: Ordinal Date formatting
In `C_Through/C_Prog/chap_5_selection_statements/date_legal_form.c`, we format day numbers with their ordinal suffixes (`st`, `nd`, `rd`, `th`). We group cases to avoid duplication:
```c
switch (dd) {
  case 1:
  case 21:
  case 31:
    printf("st");
    break;
```
If `dd` matches `1`, `21`, or `31`, execution jumps to the corresponding case label. Because there is no code or `break` between `case 1:` and `case 31:`, the program falls through to line 34, prints "st", and exits the switch at the `break`.

### Example 3: Safe Division via Short-Circuiting
In `C_Through/C_Prog/chap_5_selection_statements/short_circuit.c`, we test the logical expression:
```c
int i = 0;
int j = 2;
k = (i != 0) && (j / i > 0);
```
When this code executes:
1. `i != 0` evaluates to `0` (false).
2. The compiler detects that the left side of the `&&` operator is false.
3. The right side `(j / i > 0)` is completely ignored.
4. The program prints `0` and exits safely.
If the compiler did not support short-circuiting, it would attempt to evaluate `2 / 0`, causing an immediate hardware exception (division by zero) and crashing the program.

---

## 7. Practice Problems

1. **Verify Logical Equivalence (De Morgan's Laws):**
   Write a C program that prompts the user for two boolean inputs ($A$ and $B$). Show that `!(A && B)` is logically identical to `!A || !B` under every combination of inputs.
2. **Leap Year Check with Single Branching:**
   A year is a leap year if it is divisible by $4$, except for years divisible by $100$, unless they are also divisible by $400$. Write a function `int is_leap_year(int year)` that returns `1` if it is a leap year and `0` otherwise, using only a single logical expression within one `if` statement.
3. **Menu Jump table implementation:**
   Create an interactive calculator program. The user inputs two floating point numbers and selects an operator (`+`, `-`, `*`, `/`). Implement the selection routing using a `switch` statement on the operator character. Include error checking for invalid operators and division by zero.

---

## 8. Cheat Sheet

### Selection Operators Summary
```text
&&  (Logical AND)  -> Evaluates true only if BOTH operands are true. Short-circuits on FALSE.
||  (Logical OR)   -> Evaluates true if AT LEAST ONE operand is true. Short-circuits on TRUE.
!   (Logical NOT)  -> Reverses the boolean truth value of its operand.
==  (Equality)     -> Evaluates true if operands are equal (Warning: do not confuse with assignment '=').
```

### Jump Statement Checklist
- Always end case blocks with `break;` unless you explicitly intend to use the fall-through behavior.
- Document intentional fall-through blocks using comments (e.g. `// Intentional Fall-through`) to prevent future developers from inserting accidental breaks.
- A `switch` statement expression must resolve to an integer, char, or enum. You cannot switch on floating-point numbers (`double` or `float`) or string variables.
