---
title: Performance Analysis and Measurement
draft: false
tags:
Resources: https://takeuforward.org/time-complexity/time-and-space-complexity-strivers-a2z-dsa-course
---


Draft: 
	**Complexity**: The function which gives the running time and/or space in terms of the input size (n). 
	
	Time complexity is usually analyzed more (than space complexity). It is computed in terms of order of magnitude. So n and n/2 can be considered similar, as for large n the difference wouldn't be significant. But changes in order is significant, as in n vs n^2, e.g., 1000 vs 1000000. Thus for expressions like an^2, 'a' is discarded and only n^2 is taken into account. In polynomials, only the term of the highest power is considered in complexity, as the other terms will grow insignificant for large n. e.g., if the ax^2 +bx+c ~ x^2 for large x. 



---

## Complexity Analysis

**Complexity analysis** is the study of how the resource requirements of an algorithm — time and memory — grow as a function of input size. It is the primary framework for comparing algorithms in a way that is independent of hardware, programming language, or implementation details.

---

### What is Complexity?

When we ask "how efficient is this algorithm?", we are not asking for a runtime in milliseconds — that depends on the machine, the compiler, the load on the CPU at that moment. We are asking something more fundamental: _as the input grows, how does the cost grow?_

Complexity captures this growth behavior. It gives us a mathematical language for saying things like "this algorithm scales gracefully" or "this will become unusable at large inputs" — and backing those claims up rigorously.

There are two primary dimensions of complexity:

- **Time complexity** — how the number of operations scales with input size $n$
- **Space complexity** — how the memory consumption scales with input size $n$

Both matter. An algorithm that runs in $O(n)$ time but requires $O(2^n)$ space is just as unusable at scale as one that takes $O(2^n)$ time.

---

### Mathematical Foundation

#### Formal Definition of Big-O

Let $T(n)$ be the number of elementary operations an algorithm performs on an input of size $n$. We say $T(n) = O(f(n))$ if there exist positive constants $c$ and $n_0$ such that:

$$T(n) \leq c \cdot f(n) \quad \text{for all } n \geq n_0$$

In plain terms: beyond some threshold $n_0$, the function $f(n)$ scaled by some constant $c$ is always an upper bound on $T(n)$. Big-O describes the **worst-case growth ceiling**.

#### The Three Standard Notations

|Notation|Name|Meaning|Use|
|---|---|---|---|
|$O(f(n))$|Big-O|Upper bound|Worst case|
|$\Omega(f(n))$|Big-Omega|Lower bound|Best case|
|$\Theta(f(n))$|Big-Theta|Tight bound|Exact growth rate|

$\Theta$ is the most precise — it says the algorithm grows _exactly like_ $f(n)$, neither faster nor slower asymptotically. In practice, Big-O is used most often because we typically care about the worst case.

> [!note] Why upper bounds matter most In engineering, you want guarantees. Knowing the best case is nice, but you need to know the worst case to make promises about your system's behavior under load. Big-O gives you that ceiling.

#### Asymptotic Analysis

Complexity is _asymptotic_ — it describes behavior as $n \to \infty$, not for any fixed $n$. This is why:

**Constants are dropped.** For $T(n) = 5n$, we write $O(n)$. The constant $5$ scales the function but does not change how it grows. At large $n$, a constant factor is irrelevant compared to the growth class.

**Lower-order terms are dropped.** For polynomials:

$$ax^k + bx^{k-1} + \cdots + c \rightarrow O(x^k)$$

At $x = 10^6$, with $k = 2$:

$$x^2 = 10^{12}, \qquad bx \leq 10^9, \qquad c \ll 10^9$$

The lower terms are at least three orders of magnitude smaller. They are noise at scale.

> [!note] What "dropping" really means We are not pretending constants don't exist. We are saying: for the purpose of understanding growth behavior at large $n$, they do not change the answer to the question we are asking. A more precise analysis would keep them — but complexity analysis deliberately trades precision for generality.

---

### Time Complexity

Time complexity measures how the number of operations an algorithm performs scales with $n$. It is computed by identifying the dominant operation — the one that runs most frequently — and counting how many times it executes as a function of $n$.

#### How to Compute It

**Single loop:**

```
for i from 0 to n-1:
    do something    ← runs n times
```

$T(n) = n \rightarrow O(n)$

**Nested loops:**

```
for i from 0 to n-1:
    for j from 0 to n-1:
        do something    ← runs n × n times
```

$T(n) = n^2 \rightarrow O(n^2)$

**Loop that halves each iteration:**

```
i := n
while i > 1:
    i := i / 2    ← runs log₂(n) times
```

$T(n) = \log_2 n \rightarrow O(\log n)$

The base of the logarithm is dropped in Big-O because $\log_a n$ and $\log_b n$ differ only by a constant factor $\log_a b$.

#### Best, Average, and Worst Case

For the same algorithm, complexity can differ depending on the input:

|Case|Meaning|Example (Linear Search)|
|---|---|---|
|Best $\Omega$|Most favorable input|Target is first element: $O(1)$|
|Average $\Theta$|Expected over all inputs|Target is in middle: $O(n/2) = O(n)$|
|Worst $O$|Least favorable input|Target is last or absent: $O(n)$|

When someone says "linear search is $O(n)$" without qualification, they mean the worst case.

---

### Space Complexity

Space complexity measures how the memory usage of an algorithm scales with $n$. It includes:

- **Input space** — memory for the input itself
- **Auxiliary space** — extra memory the algorithm allocates during execution

In most analyses, we focus on **auxiliary space** because the input has to exist regardless of which algorithm we choose.

#### In-Place vs Out-of-Place

An algorithm is **in-place** if it uses $O(1)$ auxiliary space — it operates by rearranging or modifying the input directly, without allocating memory proportional to $n$.

|Algorithm|Time|Auxiliary Space|In-place?|
|---|---|---|---|
|Bubble Sort|$O(n^2)$|$O(1)$|Yes|
|Merge Sort|$O(n \log n)$|$O(n)$|No|
|Binary Search (iterative)|$O(\log n)$|$O(1)$|Yes|
|Binary Search (recursive)|$O(\log n)$|$O(\log n)$|No*|

*Recursive binary search uses $O(\log n)$ stack space for call frames, even though it does not allocate an array.

> [!note] Recursion always costs stack space Every recursive call pushes a frame onto the call stack. A function that recurses $n$ times deep — even if it does nothing else — uses $O(n)$ auxiliary space. This is easy to miss because no array is explicitly allocated.

#### Computing Space Complexity

**Constant space $O(1)$:**

```
sum := 0
for i from 0 to n-1:
    sum := sum + arr[i]
return sum
```

Only one extra variable `sum` is used regardless of $n$.

**Linear space $O(n)$:**

```
result := new array of size n
for i from 0 to n-1:
    result[i] := arr[i] * 2
return result
```

A new array of size $n$ is allocated — space grows linearly.

**Quadratic space $O(n^2)$:**

```
matrix := new 2D array of size n × n
```

Common in dynamic programming problems that store a full $n \times n$ table.

---

### Common Complexity Classes

Listed from most to least efficient:

|Class|Name|Doubling $n$ multiplies cost by...|Example|
|---|---|---|---|
|$O(1)$|Constant|1× (unchanged)|Array index access|
|$O(\log n)$|Logarithmic|~1× (tiny increase)|Binary search|
|$O(n)$|Linear|2×|Linear search|
|$O(n \log n)$|Linearithmic|~2× (slightly more)|Merge sort|
|$O(n^2)$|Quadratic|4×|Bubble sort|
|$O(n^3)$|Cubic|8×|Naive matrix multiplication|
|$O(2^n)$|Exponential|squares the cost|Recursive Fibonacci|
|$O(n!)$|Factorial|catastrophic|Brute-force permutations|

The "doubling" column is a practical intuition: if you double your input and your algorithm takes 4× as long, you are dealing with $O(n^2)$.

> [!note] The practical cliff Algorithms up to $O(n \log n)$ are generally usable at large scale. $O(n^2)$ becomes painful around $n = 10^5$. $O(2^n)$ is only feasible for $n \leq 20$ or so. Knowing where this cliff is lets you recognize when a brute-force solution will not survive the input constraints.

---

### Worked Examples

#### Example 1 — Linear Search

```
for i from 0 to n-1:
    if arr[i] == target:
        return i
return -1
```

- **Best case:** $O(1)$ — target is at index 0
- **Average case:** $O(n)$ — target is somewhere in the middle
- **Worst case:** $O(n)$ — target is last or not present
- **Space:** $O(1)$ — no auxiliary allocation

#### Example 2 — Binary Search (Iterative)

```
low := 0, high := n-1
while low <= high:
    mid := (low + high) / 2
    if arr[mid] == target: return mid
    else if arr[mid] < target: low := mid + 1
    else: high := mid - 1
return -1
```

Each iteration halves the search space. Starting from $n$:

$$n \to \frac{n}{2} \to \frac{n}{4} \to \cdots \to 1$$

This takes $\log_2 n$ steps.

- **Best case:** $O(1)$ — target is the middle element
- **Worst case:** $O(\log n)$ — search space halved until exhausted
- **Space:** $O(1)$ — iterative, no recursion stack

#### Example 3 — Bubble Sort

```
for i from 0 to n-1:
    for j from 0 to n-i-2:
        if arr[j] > arr[j+1]:
            swap arr[j] and arr[j+1]
```

The outer loop runs $n$ times. The inner loop runs $n-1, n-2, \ldots, 1$ times. Total comparisons:

$$\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2} \approx \frac{n^2}{2} \rightarrow O(n^2)$$

- **Best case:** $O(n)$ — with early termination on an already-sorted array
- **Worst case:** $O(n^2)$ — reverse-sorted input
- **Space:** $O(1)$ — in-place

#### Example 4 — Merge Sort

Merge sort splits the array in half recursively, then merges:

$$T(n) = 2T\left(\frac{n}{2}\right) + O(n)$$

By the Master Theorem, this resolves to $T(n) = O(n \log n)$.

- **All cases:** $\Theta(n \log n)$ — splitting and merging always happen
- **Space:** $O(n)$ — auxiliary array needed for merging

> [!note] Why merge sort is always $\Theta(n \log n)$ Unlike bubble sort, merge sort has no early exit. Every call splits and every merge scans — the input shape does not change the structure of the recursion.

---

### Space-Time Tradeoffs

Complexity does not exist in isolation — time and space often trade off against each other. A common pattern is using extra memory to avoid redundant computation:

**Without memoization — Fibonacci:** $$T(n) = O(2^n), \quad S(n) = O(n)$$

**With memoization — Fibonacci:** $$T(n) = O(n), \quad S(n) = O(n)$$

By storing previously computed values (spending space), we eliminate redundant recursive calls (saving time). This is the core idea behind dynamic programming.

> [!note] There is no universally better choice In memory-constrained environments (embedded systems, mobile), an $O(n^2)$ in-place algorithm may be preferable to an $O(n \log n)$ algorithm requiring $O(n)$ space. Always evaluate both dimensions relative to your constraints.

---

### Common Misconceptions and Pitfalls

> [!warning] "Constants never matter" Dropping constants is valid for asymptotic analysis. It does not mean constants are irrelevant in practice. Two $O(n^2)$ algorithms where one has a constant 100× smaller will have dramatically different real-world performance at any fixed $n$. Complexity class tells you about growth behavior — profiling tells you about actual performance.

> [!warning] "Big-O means worst case" Big-O is an upper bound notation. It is _used_ for worst case by convention, but mathematically $O(f(n))$ just means "grows no faster than $f(n)$". You can technically write $O(n^2)$ for an $O(n)$ algorithm — it would be a valid but useless upper bound. When people say "this algorithm is $O(n^2)$" they mean it is a _tight_ upper bound, which is really $\Theta(n^2)$.

> [!warning] "Recursion doesn't use extra space if no array is allocated" Every recursive call consumes stack space for its frame. A function that recurses $n$ levels deep uses $O(n)$ auxiliary space whether or not it allocates any variables. This is one of the most common sources of space complexity errors.

> [!warning] "Lower-order terms can always be dropped" This holds cleanly for polynomials. For mixed expressions, always keep the fastest-growing term. In $n^2 + 2^n$, the exponential dominates — not the polynomial. The rule is: identify the growth class of each term, keep the largest.

> [!warning] "A faster complexity class is always faster in practice" An $O(n \log n)$ algorithm is not necessarily faster than an $O(n^2)$ algorithm for small $n$. Asymptotic analysis describes behavior at large $n$. For small inputs, a simpler $O(n^2)$ algorithm with low constant overhead can outperform a complex $O(n \log n)$ one. Many sorting libraries switch to insertion sort for small subarrays for exactly this reason.

---

### Practice Problems

1. Find the time and space complexity of reversing a string in-place — LeetCode 344 — Easy
2. Analyze the complexity of finding all duplicates in an array — LeetCode 442 — Medium
3. Determine why naive recursive Fibonacci is $O(2^n)$ and rewrite it in $O(n)$ — Classic
4. Compare iterative and recursive implementations of binary search for space complexity — Classic
5. Analyze the complexity of a nested loop where the inner loop runs $\log n$ times — Classic

