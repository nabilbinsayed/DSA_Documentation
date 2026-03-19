---
title: Arrays
draft: false
tags:
---


> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

An **array** is a list of a finite $n$ number of **similar** data items. Also referred to as a **linear array** — it is the simplest of all data structures.

---

## What is an Array?

An array $A$ of size $n$ stores elements in **contiguous memory** — each element occupies adjacent memory cells. Elements are accessed using a **subscripted variable**:

Three notations exist for referring to elements:
- Subscript: $A_k$
- Parenthesis: $A(k)$
- Bracket: $A[k]$ *(mostly used)*

A collection of data elements $A$ is said to be **indexed** if any element $A_K$ can be accessed in a time that is **independent of $K$**. This is the defining property of arrays — direct, $O(1)$ access regardless of position.

**Limitations of arrays:**
- Fixed size of elements (size must be declared at creation)
- Data item insertion and deletion is expensive (shifting required)

Intuition: think of a row of numbered post boxes. Each box has a fixed address, and you can go directly to any box by number — you do not pass through box 1 to reach box 5.

---

## Representation of Linear Arrays

### Address Formula

Given array `LA` with:
- `Base(LA)` — address of the first element
- `LB` — lower bound (starting index)
- `w` — word size (number of bytes per element)

The address of element `LA[K]` is:

$$\text{LOC}(LA[K]) = \text{Base}(LA) + w(K - LB)$$

**Example:** `Base = 200`, `w = 4` (int), `LB = 0`. Address of `LA[5]`:

$$\text{LOC}(LA[5]) = 200 + 4(5 - 0) = 220$$

**Length of array:**

$$\text{Length} = UB - LB + 1$$

where `UB` is the upper bound.

---

## Operations on Linear Arrays

### Traversal

```
Algorithm: TRAVERSE(LA, LB, UB)

1. Repeat for K = LB to UB:
      Visit LA[K].
   [End of loop]
```

Time: $O(n)$. Space: $O(1)$.

### Insertion

```
Algorithm: INSERT(LA, N, K, ITEM)

1. Set J := N
2. Repeat step 3 while J ≥ K:
3.    Set LA[J + 1] := LA[J] and J := J - 1
   [End of loop]
4. Set LA[K] := ITEM and N := N + 1 and Exit
```

Manual trace — insert 25 at position 3 into `[10, 20, 30, 40, _]`:

```
J=4: LA[5] := LA[4] = 40   →  [10, 20, 30, 40, 40]
J=3: LA[4] := LA[3] = 30   →  [10, 20, 30, 30, 40]
J=2: 2 < K=3, loop ends
Set LA[3] := 25             →  [10, 20, 25, 30, 40]
N := 5
```

Time: $O(n)$ worst case (inserting at front shifts all $n$ elements). Space: $O(1)$.

### Deletion

```
Algorithm: DELETE(LA, N, K, ITEM)

1. Set ITEM := LA[K]
2. Repeat for J = K to N - 1:
      Set LA[J] := LA[J + 1]
   [End of loop]
4. Set N := N - 1 and Exit
```

Time: $O(n)$. Space: $O(1)$.

### Sorting — Bubble Sort

```
Algorithm: BUBBLE(LA, N)

1. Repeat steps 2 and 3 for K = 1 to N - 1:
2.    Set P := 1
3.    Repeat while P ≤ N - K:
         a. If LA[P] > LA[P + 1], then: Interchange LA[P] and LA[P + 1]
         b. Set P := P + 1
      [End of inner loop]
   [End of outer loop]
```

Time: $O(n^2)$. Space: $O(1)$ — in-place.

### Search — Linear

```
Algorithm: LINEAR(LA, N, ITEM)

1. Set P := 1
2. Repeat while LA[P] ≠ ITEM and P ≤ N:
      Set P := P + 1
   [End of loop]
3. If P = N + 1, then: Set P := 0
```

`P = 0` signals not found. Time: $O(n)$ worst.

### Search — Binary (sorted arrays only)

```
Algorithm: BINARY(LA, LB, UB, ITEM)

1. Set BEG := LB, END := UB, MID := INT((BEG + END) / 2)
2. Repeat steps 3 and 4 while BEG ≤ END and LA[MID] ≠ ITEM:
3.    If ITEM < LA[MID], then: Set END := MID - 1
      Else: Set BEG := MID + 1
4.    Set MID := INT((BEG + END) / 2)
   [End of loop]
5. If LA[MID] = ITEM, then: Set P := MID
   Else: Set P := 0
```

Time: $O(\log n)$. Space: $O(1)$.

---

## Representation of 2D Arrays

An $M \times N$ array is denoted $A[J, K]$ with $M$ rows and $N$ columns.

It can be stored in memory in two ways:

### Row-Major Order (used by C, C++)

Rows are stored consecutively. All of row 1 first, then row 2, etc.

$$\text{LOC}(A[J, K]) = \text{Base}(A) + w(N(J - LB) + (K - LB))$$

### Column-Major Order (used by Fortran, MATLAB)

Columns are stored consecutively. All of column 1 first, then column 2, etc.

$$\text{LOC}(A[J, K]) = \text{Base}(A) + w(M(K - LB) + (J - LB))$$

> [!note] Row-major vs column-major matters for cache performance
> Modern CPUs cache contiguous memory. Traversing a row in row-major layout accesses contiguous addresses — fast. Traversing a column in row-major layout accesses addresses $N \times w$ bytes apart — a cache miss at every step. For large matrices, this can slow inner loops by 10× or more.

---

## Representation of n-Dimensional Arrays

For an array $B[K_1, K_2, \ldots, K_n]$ with dimensions $M_1 \times M_2 \times \cdots \times M_n$:

Let $E_i = K_i - LB$.

**Row-major:**

$$\text{LOC}(B[K_1, K_2, \ldots, K_n]) = \text{Base}(B) + w\Big(\cdots\big((E_1 L_2 + E_2)L_3 + E_3\big)L_4 + \cdots + E_{n-1}\Big)L_n + E_n\Big)$$

**Column-major:**

$$\text{LOC}(B[K_1, K_2, \ldots, K_n]) = \text{Base}(B) + w\Big(\cdots\big((E_n L_{n-1} + E_{n-1})L_{n-2}\big) + \cdots + E_3\Big)L_2 + E_2\Big)L_1 + E_1\Big)$$

Each dimension's index is multiplied by the product of all smaller dimensions' sizes.

---

## Pointers and Arrays

A variable $P$ is called a **pointer** if $P$ contains the address of an element. A **pointer array** is a collection of pointers — each element is a pointer (memory address), not a direct value.

```c
int a = 10;           int a[5] = {1, 2, 3, 4, 5};
int *p;               int *p;
```

For pointer arrays, increment/decrement operations are valid — `p + 1` moves to the next element.

**Pointer equivalent of 2D array access:**

$$A[J, K] \equiv \text{*(*}(A + (J - LB)) + (K - LB)\text{)}$$

### Why Pointer Arrays?

**Variable-size elements.** When array elements vary in size (strings of different lengths), store pointers to them. Each pointer is the same size; the data can be anywhere.

**Cheap reordering.** Sorting a pointer array only moves the pointers — the actual data stays in place.

**Building linked structures.** The LINK array in a linked list *is* a pointer array. `LINK[i]` holds the index (address) of the next node, not the data itself.

---

## Matrices

A **matrix** is a 2D array of numbers arranged in $m$ rows and $n$ columns:

$$A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}$$

### Types of Matrices

| Type | Definition |
|---|---|
| Row matrix | $1 \times n$ — single row |
| Column matrix | $m \times 1$ — single column |
| Square matrix | $m = n$ |
| Diagonal matrix | $a_{ij} = 0$ for $i \neq j$ |
| Identity matrix $I$ | Diagonal with all 1s; $AI = IA = A$ |
| Zero matrix | All $a_{ij} = 0$ |
| Symmetric matrix | $a_{ij} = a_{ji}$ — equals its own transpose |
| Upper triangular | $a_{ij} = 0$ for $i > j$ |
| Lower triangular | $a_{ij} = 0$ for $i < j$ |
| Sparse matrix | Most elements are zero |

### Matrix Multiplication

To multiply $M \times P$ matrix $A$ by $P \times N$ matrix $B$:

$$c_{ij} = \sum_{k=1}^{P} a_{ik} \times b_{kj}$$

```
Algorithm: MATMUL(A, B, M, P, N)

1. Repeat steps 2 to 4 for I = 1 to M:
2.    Repeat steps 3 to 4 for J = 1 to N:
3.       Set C[I, J] := 0
4.       Repeat for K = 1 to P:
            C[I, J] := C[I, J] + A[I, K] * B[K, J]
         [End inner loop]
      [End step 2 loop]
   [End outer loop]
```

**Complexity:** $C(n) = M \times N \times P \rightarrow O(n^3)$ for square $n \times n$ matrices.

### Sparse Matrix Representation

A matrix is **sparse** if most of its elements are zero. Storing it as a full 2D array wastes memory. Use a **triplet list** instead — store only non-zero elements as $(row, col, value)$:

```
Matrix:              Triplet list:
0  0  3  0           (0, 2, 3)
0  4  0  0    →      (1, 1, 4)
0  0  0  7           (2, 3, 7)
5  0  0  0           (3, 0, 5)
```

Space: $O(k)$ where $k$ is the number of non-zero elements, vs $O(mn)$ for full storage.

---

## Complexity Analysis

| Operation | Time | Space | Notes |
|---|---|---|---|
| Access `LA[K]` | $O(1)$ | — | Direct address formula |
| Traversal | $O(n)$ | $O(1)$ | |
| Linear search | $O(n)$ | $O(1)$ | |
| Binary search | $O(\log n)$ | $O(1)$ | Sorted arrays only |
| Insert at position $K$ | $O(n)$ | $O(1)$ | Shifts $n - K$ elements |
| Delete at position $K$ | $O(n)$ | $O(1)$ | Shifts $n - K - 1$ elements |
| Bubble sort | $O(n^2)$ | $O(1)$ | In-place |
| Matrix multiply ($n \times n$) | $O(n^3)$ | $O(n^2)$ | Naive algorithm |

---

## Common Misconceptions

> [!warning] "Arrays are always faster than linked lists"
> Arrays are faster for access ($O(1)$ vs $O(n)$) and have better cache performance. But linked lists are faster for insertion and deletion at arbitrary positions ($O(1)$ vs $O(n)$). The right choice depends on which operations dominate.

> [!warning] "Binary search works on any array"
> Binary search requires the array to be **sorted**. Applying it to an unsorted array gives incorrect results silently — no error is raised.

> [!warning] "The address formula is always Base + i × w"
> This assumes 0-based indexing (`LB = 0`). The general formula is $\text{Base}(LA) + w(K - LB)$. For 1-indexed arrays (`LB = 1`): $\text{Base} + w(K - 1)$. Always check what LB is.

> [!warning] "A 2D array is stored as an array of arrays"
> A true 2D array `int A[M][N]` in C is stored as a **single contiguous block** of $M \times N$ integers — not $M$ separate arrays. An array of pointers `int *A[M]` is different and has a separate memory layout. These are not interchangeable.

---

## Practice Problems

1. Given `Base = 200`, `w = 4`, `LB = 0` — find the address of `LA[7]` — Classic — Easy
2. For a $4 \times 5$ matrix at base 1000, `w = 2`, find `LOC(A[2][3])` in both row-major and column-major order — Classic — Easy
3. Trace the INSERT algorithm to insert 15 at position 2 in `[10, 20, 30, 40]` — Classic — Easy
4. Trace BINARY search on `[3, 7, 11, 15, 19, 23, 27, 31]` for target 19, showing BEG, END, MID at each step — Classic — Medium
5. Multiply $\begin{bmatrix}1&2\\3&4\end{bmatrix} \times \begin{bmatrix}5&6\\7&8\end{bmatrix}$ by hand and verify with MATMUL — Classic — Medium

---

## Cheat Sheet

**Address formulas:**

1D: $\quad\text{LOC}(LA[K]) = \text{Base}(LA) + w(K - LB)$

2D row-major: $\quad\text{LOC}(A[J,K]) = \text{Base}(A) + w(N(J-LB) + (K-LB))$

2D col-major: $\quad\text{LOC}(A[J,K]) = \text{Base}(A) + w(M(K-LB) + (J-LB))$

Length: $\quad UB - LB + 1$

**Operation costs:**
- Access: $O(1)$
- Search unsorted: $O(n)$
- Binary search (sorted): $O(\log n)$
- Insert/Delete at $K$: $O(n)$ shifts
- Sort (bubble): $O(n^2)$
- Matrix multiply: $O(n^3)$

**Pointer array:** Array of addresses. Same size per element. Used when elements vary in size or for cheap reordering.

**Sparse matrix:** Use triplet $(row, col, value)$ when zeros dominate. Saves $O(mn - k)$ space.
