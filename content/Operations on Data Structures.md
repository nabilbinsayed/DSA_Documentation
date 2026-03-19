---
title: Operations on Data Structures
draft: false
tags:
---


> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

A data structure is defined equally by the **operations** it supports and the cost of those operations. Two structures that store the same data but support different operations at different costs are fundamentally different tools.

---

## The Six Operations

Data items in a data structure are processed by the following operations:

1. **Traversing** — access each data item exactly once (also called *visiting*)
2. **Searching** — finding the location of a certain data item
3. **Insertion** — adding new data items
4. **Deletion** — removing existing data items
5. **Sorting** — arranging data items in some logical order
6. **Merging** — combining data items of two similar data structures

Every operation has a **precondition** (what must be true before it executes), a **postcondition** (what is guaranteed after), and a **cost** (time and space as a function of $n$).

---

## 1. Traversal

**Traversal** means visiting every element exactly once, in defined order, and applying some process to each.

### Traversal on a Linear Array

```
1. Repeat for K = LB to UB:
      Visit LA[K].
   [End of loop]
```

Every element from index `LB` to `UB` is visited once. Time: $O(n)$. Space: $O(1)$.

### Traversal on a Linked List

```
1. Set PTR := START
2. Repeat steps 3 and 4 while PTR ≠ NULL
3.    Visit INFO[PTR]
4.    Set PTR := LINK[PTR]
      [End of loop]
5. Exit
```

Manual trace on A → B → C:
```
PTR = START → visit A → PTR = LINK[A]
PTR = node B → visit B → PTR = LINK[B]
PTR = node C → visit C → PTR = LINK[C] = NULL
Loop exits.
```

Time: $O(n)$. Space: $O(1)$.

---

## 2. Search

**Search** finds whether a specific value exists in a structure, and if so, returns its location.

### Linear Search

Check every element in order until the target is found or the list is exhausted.

```
Algorithm: LINEAR(LA, N, ITEM)

1. Set P := 1
2. Repeat while LA[P] ≠ ITEM and P ≤ N:
      Set P := P + 1
   [End of loop]
3. If P = N + 1, then: Set P := 0
```

If `P = N + 1` at the end, the element was not found, so `P` is set to 0 (not found).

| Case | Condition | Time |
|---|---|---|
| Best | Target is first element | $O(1)$ |
| Average | Target is in middle | $O(n)$ |
| Worst | Target is last or absent | $O(n)$ |

Space: $O(1)$.

### Binary Search

Requires a **sorted array**. Exploits ordering to eliminate half the remaining candidates each step.

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

Manual trace — searching for 45 in `[7, 12, 30, 45, 89]` (LB=1, UB=5):

```
BEG=1, END=5, MID=3 → LA[3]=30 < 45 → BEG=4
BEG=4, END=5, MID=4 → LA[4]=45 = 45 → P=4 (FOUND)
```

| Case | Condition | Time |
|---|---|---|
| Best | Target is the middle element | $O(1)$ |
| Average | Target found after $\log n / 2$ steps | $O(\log n)$ |
| Worst | Target absent or at extremes | $O(\log n)$ |

Space: $O(1)$ iterative, $O(\log n)$ recursive.

> [!note] Why $O(\log n)$?
> Each step halves the search space: $n \to n/2 \to n/4 \to \cdots \to 1$. The number of halvings needed to reach 1 from $n$ is $\log_2 n$. 30 steps suffice to search one billion elements.

### Search on a Linked List (Unsorted)

```
Algorithm: SEARCH(INFO, LINK, START, ITEM)

1. Set PTR := START
2. Repeat step 3 while PTR ≠ NULL:
3.    If INFO[PTR] = ITEM, then: Set LOC := PTR and Exit
      Else: Set PTR := LINK[PTR]
   [End of loop]
4. Set LOC := NULL and Exit
```

### Search on a Linked List (Sorted)

For a sorted linked list, we can stop early once we pass the potential location of ITEM:

```
Algorithm: SEARCHSL(INFO, LINK, START, ITEM)

1. Set PTR := START
2. Repeat step 3 while PTR ≠ NULL:
3.    If INFO[PTR] = ITEM, then: Set LOC := PTR and Exit
      Else If INFO[PTR] < ITEM, then: Set PTR := LINK[PTR]
      Else: Set LOC := NULL and Exit
   [End of loop]
4. Set LOC := NULL and Exit
```

This is more efficient in practice — we do not traverse past where the item could exist.

---

## 3. Insertion

**Insertion** adds a new element to the structure while maintaining its defining properties.

### Insertion into a Linear Array

Inserting at position $K$ requires shifting elements from $K$ to $N$ one position right:

```
Algorithm: INSERT(LA, N, K, ITEM)

1. Set J := N
2. Repeat step 3 while J ≥ K:
3.    Set LA[J + 1] := LA[J] and J := J - 1
   [End of loop]
4. Set LA[K] := ITEM and N := N + 1 and Exit
```

Manual trace — insert 25 at position 3 in `[10, 20, 30, 40, _]`:

```
J=4: LA[5]=LA[4]=40  → [10,20,30,40,40]
J=3: LA[4]=LA[3]=30  → [10,20,30,30,40]
J=2: loop ends (J < K=3)
Set LA[3] := 25      → [10,20,25,30,40]
```

Time: $O(n)$ worst case. Space: $O(1)$.

### Insertion at Beginning of Linked List

```
Algorithm: INSFIRST(INFO, LINK, START, AVAIL, ITEM)

1. If AVAIL = NULL, then: Write OVERFLOW and Exit
2. Set NEW := AVAIL and AVAIL := LINK[AVAIL]
3. Set INFO[NEW] := ITEM
4. Set LINK[NEW] := START and START := NEW
5. Exit
```

Diagram:
```
Before: START——>[A | •]——>[B | NULL]

After:  START——>[X | •]——>[A | •]——>[B | NULL]
                 ↑
              new node
```

Time: $O(1)$. Space: $O(1)$.

### Insertion at Given Location in Linked List

```
Algorithm: INSLOC(INFO, LINK, START, AVAIL, LOC, ITEM)

1. If AVAIL = NULL, then: Write OVERFLOW and Exit
2. Set NEW := AVAIL and AVAIL := LINK[AVAIL]
3. Set INFO[NEW] := ITEM
4. If LOC = NULL, then:
      Set LINK[NEW] := START and START := NEW
   Else:
      Set LINK[NEW] := LINK[LOC] and LINK[LOC] := NEW
5. Exit
```

> [!note] Order of pointer updates is critical
> `LINK[NEW] := LINK[LOC]` must come **before** `LINK[LOC] := NEW`. Reversing these two steps loses the reference to the rest of the list.

### Insertion at End of Linked List

```
Algorithm: INSEND(INFO, LINK, START, AVAIL, ITEM)

1. If AVAIL = NULL, then: Write OVERFLOW and Exit
2. Set NEW := AVAIL and AVAIL := LINK[AVAIL]
3. Set INFO[NEW] := ITEM
4. If START = NULL, then:
      Set LINK[NEW] := START and START := NEW and Exit
   Else:
      Set LOC := START and PTR := LINK[START]
5. Repeat while PTR ≠ NULL:
6.    Set LOC := PTR and PTR := LINK[PTR]
7. Set LINK[NEW] := LINK[LOC] and LINK[LOC] := NEW
8. Exit
```

### Insertion into a Sorted Linked List

For a sorted list, we must find position $A$ such that `INFO[A] < ITEM ≤ INFO[B]` and insert between them.

```
Algorithm: INSERT(INFO, LINK, START, AVAIL, ITEM)

1. Call FINDA(INFO, LINK, START, ITEM) to get LOC
2. Call INSLOC(INFO, LINK, START, AVAIL, LOC, ITEM)
3. Exit
```

```
Algorithm: FINDA(INFO, LINK, START, ITEM)

1. If START = NULL, then: Set LOC := NULL and Return
2. If ITEM < INFO[START], then: Set LOC := NULL and Return
3. Set K := START and PTR := LINK[START]
4. Repeat steps 5 and 6 while PTR ≠ NULL:
5.    If ITEM ≤ INFO[PTR], then: Set LOC := K and Return
6.    Set K := PTR and PTR := LINK[PTR]
   [End of loop]
7. Set LOC := K and Return
```

---

## 4. Deletion

**Deletion** removes an element from the structure and restores structural integrity.

### Deletion from a Linear Array

Deleting at position $K$ requires shifting subsequent elements left:

```
Algorithm: DELETE(LA, N, K, ITEM)

1. Set ITEM := LA[K]
2. Repeat for J = K to N - 1:
      Set LA[J] := LA[J + 1]
   [End of loop]
4. Set N := N - 1 and Exit
```

Time: $O(n)$. Space: $O(1)$.

### Deletion from a Linked List (At Location LOC)

```
Algorithm: DEL(INFO, LINK, START, AVAIL, LOC, LOCP)

1. If START = NULL, then: Write UNDERFLOW and Exit
2. If LOCP = NULL, then: Set START := LINK[START]
   Else: Set LINK[LOCP] := LINK[LOC]
3. Set LINK[LOC] := AVAIL and AVAIL := LOC
4. Exit
```

Diagram — deleting B (LOC=B, LOCP=A):
```
Before: [A | •]——>[B | •]——>[C | NULL]

LINK[A] := LINK[B] = C

After:  [A | •]——>[C | NULL]       B returned to AVAIL
```

### Deletion from a Linked List (By Value)

```
Algorithm: DELETE(INFO, LINK, START, AVAIL, ITEM)

1. Call FINDB(INFO, LINK, START, ITEM) to get LOC and LOCP
2. If LOC = NULL, then: Write ITEM not in list and Exit
3. If LOCP = NULL, then: Set START := LINK[START]
   Else: Set LINK[LOCP] := LINK[LOC]
4. Set LINK[LOC] := AVAIL and AVAIL := LOC
5. Exit
```

```
Algorithm: FINDB(INFO, LINK, START, ITEM)

1. If START = NULL, then: Set LOC := NULL and LOCP := NULL and Return
2. If INFO[START] = ITEM, then: Set LOC := START and LOCP := NULL and Return
3. Set K := START and PTR := LINK[START]
4. Repeat steps 5 and 6 while PTR ≠ NULL:
5.    If INFO[PTR] = ITEM, then: Set LOC := PTR and LOCP := K and Return
6.    Set K := PTR and PTR := LINK[PTR]
   [End of loop]
7. Set LOC := NULL and Return
```

> [!note] Why linked list deletion is $O(1)$ at the pointer
> Deleting from an array requires shifting up to $n$ elements. Deleting from a linked list at a known position changes only two pointers — `LINK[LOCP]` and `LINK[LOC]`. The rest of the structure is untouched.

---

## 5. Sorting

**Sorting** rearranges elements into a defined order. The lecture covers **Bubble Sort** and **Quicksort**.

### Bubble Sort

Repeatedly compare adjacent pairs and swap if out of order. After each pass, the largest unsorted element "bubbles" to its correct position.

```
Algorithm: BUBBLE(LA, N)

1. Repeat steps 2 and 3 for K = 1 to N - 1:
2.    Set P := 1
3.    Repeat while P ≤ N - K:
         a. If LA[P] > LA[P+1], then: Interchange LA[P] and LA[P+1]
         b. Set P := P + 1
      [End of inner loop]
   [End of outer loop]
```

Manual trace on `[5, 3, 8, 1]`:

```
Pass 1 (K=1): compare to N-1=3
  P=1: 5>3 → swap → [3,5,8,1]
  P=2: 5<8 → no swap
  P=3: 8>1 → swap → [3,5,1,8]   (8 is in place)

Pass 2 (K=2): compare to N-2=2
  P=1: 3<5 → no swap
  P=2: 5>1 → swap → [3,1,5,8]   (5 in place)

Pass 3 (K=3): compare to N-3=1
  P=1: 3>1 → swap → [1,3,5,8]   (done)
```

| Case | Condition | Time |
|---|---|---|
| Best | Already sorted (with early exit) | $O(n)$ |
| Average | Random order | $O(n^2)$ |
| Worst | Reverse sorted | $O(n^2)$ |

Space: $O(1)$ — in-place.

### Quicksort

Partitions the array around a **pivot** element (LOC), placing all smaller elements to its left and all larger to its right, then recursively sorts each partition.

```
Algorithm: QUICK(A, N, BEG, END, LOC)

1. Set LEFT := BEG, RIGHT := END and LOC := BEG
2. a) Repeat while A[LOC] ≤ A[RIGHT] and LOC ≠ RIGHT:
         RIGHT := RIGHT - 1
   [End loop]
   b) If LOC = RIGHT, then: Return
   c) If A[LOC] > A[RIGHT], then:
      i)   Interchange A[LOC] and A[RIGHT]
      ii)  Set LOC := RIGHT
      iii) Goto Step 3
3. a) Repeat while A[LEFT] ≤ A[LOC] and LEFT ≠ LOC:
         LEFT := LEFT + 1
   [End loop]
   b) If LOC = LEFT, then: Return
   c) If A[LEFT] > A[LOC], then:
      i)   Interchange A[LEFT] and A[LOC]
      ii)  Set LOC := LEFT
      iii) Goto Step 2
```

The full algorithm manages the recursion using a stack:

```
Algorithm: Quicksort(A, N)

1. TOP := NULL
2. If N > 1, then: TOP := TOP + 1, LOWER[TOP] := 1, UPPER[TOP] := N
3. Repeat steps 4 to 7 while TOP ≠ NULL:
4.    Set BEG := LOWER[TOP], END := UPPER[TOP], TOP := TOP - 1
5.    Call QUICK(A, N, BEG, END, LOC)
6.    If BEG < LOC - 1, then:
         TOP := TOP + 1, LOWER[TOP] := BEG, UPPER[TOP] := LOC - 1
7.    If LOC + 1 < END, then:
         TOP := TOP + 1, LOWER[TOP] := LOC + 1, UPPER[TOP] := END
   [End of step 3 loop]
```

| Case | Condition | Time |
|---|---|---|
| Worst | $n^2/2 \to O(n^2)$ | Pivot is always smallest or largest element |
| Average | $O(n \log n)$ | Random or well-distributed data |

Space: $O(\log n)$ average for recursion stack.

### Sorting Algorithm Comparison

| Algorithm | Best | Average | Worst | Space | In-place? |
|---|---|---|---|---|---|
| Bubble Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Quicksort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Yes |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | No |

---

## 6. Merging

**Merging** combines two sorted structures into one sorted structure.

```
A: [ 1 | 3 | 5 | 7 ]
B: [ 2 | 4 | 6 | 8 ]

Merged: [ 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ]
```

```
Algorithm: MERGE(A, B, C, M, N)

1. Set I := 1, J := 1, K := 1
2. Repeat while I ≤ M and J ≤ N:
      If A[I] ≤ B[J], then:
         Set C[K] := A[I] and I := I + 1
      Else:
         Set C[K] := B[J] and J := J + 1
      Set K := K + 1
   [End of loop]
3. Repeat while I ≤ M:
      Set C[K] := A[I], I := I + 1, K := K + 1
   [End of loop]
4. Repeat while J ≤ N:
      Set C[K] := B[J], J := J + 1, K := K + 1
   [End of loop]
5. Exit
```

Time: $O(m + n)$. Space: $O(m + n)$.

---

## Operation Cost Summary

| Operation | Array | Linked List | BST (avg) |
|---|---|---|---|
| Traversal | $O(n)$ | $O(n)$ | $O(n)$ |
| Search (unsorted) | $O(n)$ | $O(n)$ | — |
| Search (sorted/BST) | $O(\log n)$ | $O(n)$ | $O(\log n)$ |
| Insert at front | $O(n)$ | $O(1)$ | — |
| Insert at end | $O(1)$ | $O(n)$ | — |
| Delete | $O(n)$ | $O(1)$* | $O(\log n)$ |

\*Given pointer to node and its predecessor.

---

## Common Misconceptions

> [!warning] "Deletion from a linked list is always $O(1)$"
> Deletion is $O(1)$ only if you already have both LOC and LOCP. Finding them by value requires $O(n)$ traversal. The total cost of "delete a given value" is $O(n)$.

> [!warning] "Binary search works on linked lists"
> Binary search requires random access — jumping directly to the middle element. A linked list requires $O(n)$ hops to reach position $n/2$, eliminating the $O(\log n)$ advantage entirely. Binary search only works on arrays.

> [!warning] "Quicksort is always faster than Bubble Sort"
> Quicksort is $O(n^2)$ in the worst case (already sorted or reverse sorted input with naive pivot selection). Bubble sort with early termination is $O(n)$ on already-sorted data. Quicksort is better *on average*, not always.

> [!warning] "Insertion into a linked list is always $O(1)$"
> Insertion *at a given pointer* is $O(1)$. But finding that position by index $k$ requires walking $k$ nodes from START — $O(k)$ work. The full cost of "insert at position k" is $O(k)$.

---

## Practice Problems

1. Trace LINEAR search on `[4, 7, 2, 9, 1]` for target 9 — Classic — Easy
2. Trace BINARY search on `[3, 7, 11, 15, 19, 23, 27, 31]` for target 19, showing BEG, END, MID at each step — Classic — Easy
3. Insert 35 into `[10, 20, 30, 40, 50]` at position 4 using the INSERT algorithm, showing each shift — Classic — Easy
4. Trace BUBBLE sort on `[64, 34, 25, 12, 22, 11, 90]` and count total comparisons — Classic — Medium
5. Show the FINDB trace when deleting value 30 from the list 10→20→30→40→NULL — Classic — Medium

---

## Cheat Sheet

**Traversal:** Always $O(n)$. Arrays use index loop. Linked lists follow LINK until NULL.

**Search:**
- Linear: $O(n)$, works anywhere
- Binary: $O(\log n)$, sorted arrays only — requires random access

**Insert/Delete:**
- Array: $O(n)$ due to shifting
- Linked List: $O(1)$ at known pointer; $O(n)$ to find pointer

**Sort complexities:**
- Bubble: $O(n^2)$ avg/worst, $O(1)$ space
- Quicksort: $O(n \log n)$ avg, $O(n^2)$ worst
- Merge: $O(n \log n)$ all cases, $O(n)$ space

**Merge (sorted):** $O(m + n)$ time, $O(m + n)$ space.

**AVAIL list:** Free storage. OVERFLOW = AVAIL is NULL. UNDERFLOW = list is empty.
