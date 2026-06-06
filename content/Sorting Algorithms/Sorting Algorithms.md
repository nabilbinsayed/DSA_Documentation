---
title: "Sorting Algorithms: Insertion Sort, Merge Sort, and Quick Sort"
tags: [sorting, divide-and-conquer, algorithms, cpp, c]
---

# Sorting Algorithms: Insertion Sort, Merge Sort, and Quick Sort

Sorting is the computational backbone of virtually every non-trivial program. Before we can binary search, build a BST, merge interval lists, or even render a leaderboard, we must impose order on chaos. This blog post dissects three canonical sorting algorithms — **Insertion Sort**, **Merge Sort**, and **Quick Sort** — from first principles through rigorous complexity proofs, drawing directly from our codebase implementations.

---

## 1. What is a Sorting Algorithm?

**Formal definition:** A sorting algorithm is a procedure that takes a sequence $A = \langle a_1, a_2, \ldots, a_n \rangle$ as input and produces a permutation $A' = \langle a_1', a_2', \ldots, a_n' \rangle$ such that $a_1' \leq a_2' \leq \cdots \leq a_n'$.

**Intuitive explanation:** Sorting is the act of rearranging a collection of items so that they satisfy a total ordering relation (e.g., ascending numerical order, lexicographic string order). The key insight is that *any* permutation of the input is a valid candidate output — there are $n!$ possibilities — and our goal is to find the single correct one efficiently. Different algorithms exploit different structural properties of the data and the computation to achieve this. Some make heavy use of comparison operations; others exploit the mathematical structure of the keys themselves.

**Mechanical analogies:**

- **Insertion Sort** maps to how you sort a hand of playing cards: you pick cards one at a time from the table, and each time you pick one, you slide it into its correct position among the cards already in your hand — shifting the larger ones rightward to make room.

- **Merge Sort** maps to how two office clerks merge two pre-sorted stacks of paper into one sorted stack: each clerk holds a stack and repeatedly places the smaller top-sheet into the output pile, never touching the other stack's internals.

- **Quick Sort** maps to how a librarian partitions books into two piles — "before M" and "after M" in the alphabet — around a chosen pivot letter, then independently sorts each pile, recursively.

---

## 2. Insertion Sort — The Core Idea

### Plain English Steps

1. Start with the second element (index 1); consider the first element a trivially sorted subarray.
2. Hold the current element as a **key**.
3. Scan backwards through the sorted subarray, shifting each element one position right if it is greater than the key.
4. Drop the key into the gap that opened up.
5. The sorted subarray grows by one. Repeat until all elements are processed.

### The "Why" — The Invariant

At the start of each outer-loop iteration for index $j$, the subarray $A[0..j-1]$ contains the same elements that were originally in $A[0..j-1]$, but in **sorted order**. This invariant is established trivially for $j = 1$ (a single element is sorted), maintained by the inner-loop shifting and key insertion, and at termination ($j = n$) it guarantees the entire array is sorted.

### Canonical Walkthrough

Input: `[5, 2, 4, 6, 1, 3]`

| Step | Key | Array State (sorted region | unsorted region) |
|------|-----|----------------------------------------------|
| j=1  | 2   | **[2, 5]** \| 4, 6, 1, 3 |
| j=2  | 4   | **[2, 4, 5]** \| 6, 1, 3 |
| j=3  | 6   | **[2, 4, 5, 6]** \| 1, 3 |
| j=4  | 1   | **[1, 2, 4, 5, 6]** \| 3 |
| j=5  | 3   | **[1, 2, 3, 4, 5, 6]** |

Step j=4 detail (key = 1): 6 > 1 → shift; 5 > 1 → shift; 4 > 1 → shift; 2 > 1 → shift; drop key at index 0.

---

## 3. Insertion Sort — Pseudocode

```
INSERTION-SORT(A, n)
  for j = 1 to n - 1
      key = A[j]
      // Insert A[j] into the sorted sequence A[0..j-1]
      i = j - 1
      while i >= 0 and A[i] > key
          A[i + 1] = A[i]
          i = i - 1
      A[i + 1] = key
```

---

## 4. Insertion Sort — Implementation

### C Implementation

The codebase does not contain a classic Insertion Sort in isolation, but `sorted_insertion.c` reveals the core *inner-loop mechanism* of Insertion Sort — the rightward-shift-and-drop pattern — applied to insert a new element into an already-sorted array at the position found via binary search.

```c
// From: CPP/DSA_Restart/sorted_insertion.c
// Inserts 'element' at 'index' by shifting everything right — the
// same inner loop that Insertion Sort runs on every outer iteration.

int indInsert(int arr[], int *size, int capacity, int element, int index)
{
    if (*size >= capacity) {
        return -1;  // No space left in the fixed-capacity array
    }
    // Shift all elements from index onward one position to the right
    for (int i = *size - 1; i >= index; i--) {
        arr[i + 1] = arr[i];
    }
    arr[index] = element;   // Place element in the freed slot
    *size = *size + 1;
    return 1;
}
```

The complete standalone Insertion Sort in C looks like this (completing the pattern from the codebase):

```c
// Complete Insertion Sort — extending the codebase pattern to a full sort
#include <stdio.h>

void insertion_sort(int arr[], int n)
{
    for (int j = 1; j < n; j++) {
        int key = arr[j];
        int i = j - 1;
        // Shift elements of arr[0..j-1] that are greater than key
        while (i >= 0 && arr[i] > key) {
            arr[i + 1] = arr[i];  // The same shift seen in indInsert
            i--;
        }
        arr[i + 1] = key;  // Drop key into the correct position
    }
}

int main(void)
{
    int arr[] = {5, 2, 4, 6, 1, 3};
    int n = (int)(sizeof(arr) / sizeof(arr[0]));
    insertion_sort(arr, n);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\n");
    return 0;
}
```

### Python Equivalent

```python
def insertion_sort(arr: list[int]) -> None:
    for j in range(1, len(arr)):
        key = arr[j]
        i = j - 1
        while i >= 0 and arr[i] > key:
            arr[i + 1] = arr[i]
            i -= 1
        arr[i + 1] = key

arr = [5, 2, 4, 6, 1, 3]
insertion_sort(arr)
print(arr)  # [1, 2, 3, 4, 5, 6]
```

---

## 5. Insertion Sort — Complexity Analysis

| Case | Time Complexity | Space Complexity |
|---|---|---|
| Best Case | $O(n)$ | $O(1)$ |
| Average Case | $O(n^2)$ | $O(1)$ |
| Worst Case | $O(n^2)$ | $O(1)$ |

**Step-by-step proof:**

For outer iteration $j$ (from 1 to $n-1$), the inner while-loop executes at most $j$ comparisons and shifts. The total work across all iterations is bounded by:

$$T(n) \leq \sum_{j=1}^{n-1} j = \frac{(n-1)n}{2} = \frac{n^2 - n}{2} = O(n^2)$$

In the **worst case** (reverse-sorted input), every element must be shifted all the way to position 0 — the inner loop runs $j$ times for each $j$. This gives exactly $\frac{n(n-1)}{2}$ shifts: $O(n^2)$.

In the **best case** (already sorted input), the while-loop condition `arr[i] > key` fails immediately for every $j$ since `arr[j-1] ≤ arr[j]`. The inner loop runs 0 times, and the total cost is $\Theta(n)$ — just $n-1$ comparisons.

**Space overhead:** Insertion Sort is **in-place**. The only auxiliary memory is the `key` variable and loop index `i` — $O(1)$ extra space. This makes it exceptional for memory-constrained systems.

**In-place status:** Yes. No auxiliary array is ever allocated. All work happens by shifting elements within the original array using $O(1)$ temporary variables.

---

## 6. Merge Sort — The Core Idea

Merge Sort is a **divide-and-conquer** algorithm. The lab note from our repository (`4thMayLab02/note.md`) captures the blueprint cleanly:

> **Steps:**
> 1. Make sub-problems
> 2. Solve sub-problems
> 3. Merge and solve the original problem

Applied to sorting:

1. **Divide:** Split the array at the midpoint: $\text{mid} = \text{low} + \lfloor \frac{\text{high} - \text{low}}{2} \rfloor$. This overflow-safe computation (versus the naïve `(low + high) / 2`) prevents integer overflow when `low` and `high` are large.
2. **Conquer:** Recursively sort the left half $A[\text{low}..\text{mid}]$ and the right half $A[\text{mid}+1..\text{high}]$.
3. **Merge:** Use a temporary buffer to merge the two sorted halves back into $A[\text{low}..\text{high}]$ in sorted order.

### The "Why" — The Invariant

At the beginning of each call to `MS(arr, low, high)`, after the two recursive calls return, both `arr[low..mid]` and `arr[mid+1..high]` are individually sorted. The `merge_arr` procedure then exploits this: since both halves are sorted, it can always determine the globally smallest remaining element by inspecting only the current front of each half. This is the key structural property that makes the merge step $O(n)$ rather than $O(n^2)$.

### Canonical Walkthrough

Input: `[38, 27, 43, 3, 9, 82, 10]`

```
Divide:
[38, 27, 43, 3] | [9, 82, 10]
[38, 27] | [43, 3] | [9, 82] | [10]
[38]|[27] | [43]|[3] | [9]|[82] | [10]

Conquer (merge up):
[27, 38] | [3, 43] | [9, 82] | [10]
[3, 27, 38, 43] | [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

Merge of `[27, 38]` and `[3, 43]` in detail:
- Compare 27 vs 3 → take 3; right pointer advances
- Compare 27 vs 43 → take 27; left pointer advances
- Compare 38 vs 43 → take 38; left pointer advances
- Left exhausted → drain remaining: 43
- Result: `[3, 27, 38, 43]`

---

## 7. Merge Sort — Pseudocode

```
MERGE-SORT(A, low, high)
  if low >= high
      return
  mid = low + floor((high - low) / 2)
  MERGE-SORT(A, low, mid)
  MERGE-SORT(A, mid + 1, high)
  MERGE(A, low, mid, high)

MERGE(A, low, mid, high)
  temp = new empty array
  left = low
  right = mid + 1
  while left <= mid and right <= high
      if A[left] <= A[right]
          append A[left] to temp; left++
      else
          append A[right] to temp; right++
  while left <= mid
      append A[left] to temp; left++
  while right <= high
      append A[right] to temp; right++
  for i = low to high
      A[i] = temp[i - low]
```

---

## 8. Merge Sort — Implementation

### C++ Implementation (from codebase)

```cpp
// From: Algorithm_Design_and_Analysis/4thMayLab02/merge_sort.cpp
#include <bits/stdc++.h>
using namespace std;

// Forward declarations
void MS(vector<int> &arr, int low, int high);
void merge_arr(vector<int> &arr, int low, int mid, int high);
void merge_sort(vector<int> &arr, int n);

void merge_arr(vector<int> &arr, int low, int mid, int high)
{
    vector<int> temp;        // Auxiliary buffer — O(n) space cost
    int left = low;
    int right = mid + 1;

    // Phase 1: Compare front elements of each half and drain smaller
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) {
            temp.push_back(arr[left]);
            left++;
        } else {
            temp.push_back(arr[right]);
            right++;
        }
    }
    // Phase 2: Drain any remaining elements from the left half
    while (left <= mid) {
        temp.push_back(arr[left]);
        left++;
    }
    // Phase 3: Drain any remaining elements from the right half
    while (right <= high) {
        temp.push_back(arr[right]);
        right++;
    }
    // Write sorted result back into the original array segment
    for (int i = low; i <= high; i++) {
        arr[i] = temp[i - low];  // temp is 0-indexed, arr segment starts at 'low'
    }
}

void MS(vector<int> &arr, int low, int high)
{
    if (low >= high)   // Base case: single element or empty range
        return;
    int mid = low + (high - low) / 2;  // Overflow-safe midpoint
    MS(arr, low, mid);
    MS(arr, mid + 1, high);
    merge_arr(arr, low, mid, high);
}

void merge_sort(vector<int> &arr, int n)
{
    MS(arr, 0, n - 1);
}
```

### Python Equivalent

```python
def merge_sort(arr: list[int], low: int, high: int) -> None:
    if low >= high:
        return
    mid = low + (high - low) // 2
    merge_sort(arr, low, mid)
    merge_sort(arr, mid + 1, high)
    merge(arr, low, mid, high)

def merge(arr: list[int], low: int, mid: int, high: int) -> None:
    temp = []
    left, right = low, mid + 1
    while left <= mid and right <= high:
        if arr[left] <= arr[right]:
            temp.append(arr[left]); left += 1
        else:
            temp.append(arr[right]); right += 1
    while left <= mid:
        temp.append(arr[left]); left += 1
    while right <= high:
        temp.append(arr[right]); right += 1
    for i, val in enumerate(temp):
        arr[low + i] = val
```

---

## 9. Merge Sort — Complexity Analysis

| Case | Time Complexity | Space Complexity |
|---|---|---|
| Best Case | $O(n \log n)$ | $O(n)$ |
| Average Case | $O(n \log n)$ | $O(n)$ |
| Worst Case | $O(n \log n)$ | $O(n)$ |

**Step-by-step proof (Recurrence analysis):**

Let $T(n)$ be the runtime on an array of size $n$. The algorithm does:
- Two recursive calls on halves of size $\lfloor n/2 \rfloor$ and $\lceil n/2 \rceil$
- One `merge_arr` call that processes exactly $n$ elements (two linear scans + one linear write-back): $\Theta(n)$

This gives the recurrence:

$$T(n) = 2T\!\left(\frac{n}{2}\right) + \Theta(n)$$

By the **Master Theorem** (Case 2): $a = 2$, $b = 2$, $f(n) = \Theta(n)$.

$$n^{\log_b a} = n^{\log_2 2} = n^1 = n$$

Since $f(n) = \Theta(n^{\log_b a}) = \Theta(n)$ (Case 2 of Master Theorem):

$$T(n) = \Theta(n \log n)$$

Alternatively, by the recursion tree: at depth $k$, there are $2^k$ subproblems each of size $n / 2^k$. Each subproblem at depth $k$ costs $\Theta(n / 2^k)$ in the merge step. Total cost at depth $k$: $2^k \cdot \Theta(n/2^k) = \Theta(n)$. The tree has $\log_2 n$ levels (depth terminates when subproblem size is 1). Total: $\Theta(n) \cdot \log_2 n = \Theta(n \log n)$.

**Space overhead:** Merge Sort is **not in-place**. The `temp` vector inside `merge_arr` requires $O(n)$ auxiliary space at any given level of the recursion. Additionally, the recursive call stack uses $O(\log n)$ space for the $\log n$ active stack frames. Total auxiliary space: $O(n)$ (dominated by the merge buffer).

**In-place status:** No. The linear auxiliary buffer is the price paid for the optimal, guaranteed $O(n \log n)$ runtime across all input distributions.

---

## 10. Quick Sort — The Core Idea

Quick Sort is also a divide-and-conquer algorithm, but it divides by **value** rather than by **position**. The key operation is **partitioning**: rearrange the array around a chosen **pivot** element such that:
- Every element to the left of the pivot is ≤ the pivot.
- Every element to the right of the pivot is ≥ the pivot.
- The pivot itself is in its final sorted position.

We then recursively sort the left and right sub-arrays (without needing a merge step — the partition invariant does all the work).

**Two variants in the codebase:**
1. **Deterministic Quick Sort** (`quick_sort.cpp`): Always uses the last element as pivot. Fast in practice but vulnerable to $O(n^2)$ behavior on already-sorted or reverse-sorted inputs.
2. **Randomized Quick Sort** (`quick_sort_random_pivot.cpp`): Randomly selects a pivot, swaps it to the last position, then applies the same Lomuto partition scheme. Eliminates worst-case adversarial inputs with high probability.

### The Lomuto Partition Scheme

The codebase uses Lomuto partitioning (as opposed to Hoare's). It maintains:
- `i`: the index of the **last confirmed element ≤ pivot** (starts at `low - 1`)
- `j`: the scanning pointer (moves from `low` to `high - 1`)

When `arr[j] ≤ pivot`, we expand the "small" region by incrementing `i` and swapping `arr[i]` with `arr[j]`. After the scan, we swap the pivot from `arr[high]` into position `i + 1`.

### Canonical Walkthrough

Input: `[3, 6, 8, 10, 1, 2, 1]`, pivot = arr[6] = 1

```
pivot = 1, i = -1, j scans 0..5:
  j=0: arr[0]=3 > 1 → no swap
  j=1: arr[1]=6 > 1 → no swap
  j=2: arr[2]=8 > 1 → no swap
  j=3: arr[3]=10 > 1 → no swap
  j=4: arr[4]=1 ≤ 1 → i=0, swap(arr[0], arr[4]): [1, 6, 8, 10, 3, 2, 1]
  j=5: arr[5]=2 > 1 → no swap

Final swap(arr[i+1], arr[high]): swap(arr[1], arr[6]): [1, 1, 8, 10, 3, 2, 6]
Pivot (value 1) is now at index 1 — its final position.
```

Recurse on `[0..0]` (trivial) and `[2..6] = [8, 10, 3, 2, 6]`.

---

## 11. Quick Sort — Pseudocode

```
QUICKSORT(A, low, high)
  if low >= high
      return
  pi = PARTITION(A, low, high)
  QUICKSORT(A, low, pi - 1)
  QUICKSORT(A, pi + 1, high)

PARTITION(A, low, high)
  pivot = A[high]
  i = low - 1
  for j = low to high - 1
      if A[j] <= pivot
          i = i + 1
          swap A[i] with A[j]
  swap A[i + 1] with A[high]
  return i + 1

RANDOMIZED-PARTITION(A, low, high)
  rand_idx = RANDOM(low, high)
  swap A[rand_idx] with A[high]
  return PARTITION(A, low, high)
```

---

## 12. Quick Sort — Implementation

### C++ Implementation — Deterministic (from codebase)

```cpp
// From: Algorithm_Design_and_Analysis/4thMayLab02/quick_sort.cpp
#include <bits/stdc++.h>
using namespace std;

// Lomuto partition: places pivot (arr[high]) at its correct index
// and returns that index.
int partition(vector<int> &arr, int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;           // Tracks boundary of the "≤ pivot" region
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);  // Grow the ≤-pivot region
        }
    }
    swap(arr[i + 1], arr[high]);   // Move pivot to its sorted position
    return i + 1;
}

void QS(vector<int> &arr, int low, int high)
{
    if (low >= high)  // Base case: single element or empty
        return;
    int pi = partition(arr, low, high);
    QS(arr, low, pi - 1);   // Sort left of pivot
    QS(arr, pi + 1, high);  // Sort right of pivot
}

void quick_sort(vector<int> &arr, int n)
{
    QS(arr, 0, n - 1);
}
```

### C++ Implementation — Randomized (from codebase)

```cpp
// From: Algorithm_Design_and_Analysis/4thMayLab02/quick_sort_random_pivot.cpp
// Identical partition logic, but pivot is randomly selected first.

int partition_rand(vector<int> &arr, int low, int high)
{
    // Pick a uniformly random index in [low, high]
    int rand_idx = low + rand() % (high - low + 1);
    // Swap random element to the last position so the same partition
    // logic from quick_sort.cpp applies without any changes
    swap(arr[rand_idx], arr[high]);

    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void QS_rand(vector<int> &arr, int low, int high)
{
    if (low >= high)
        return;
    int pi = partition_rand(arr, low, high);
    QS_rand(arr, low, pi - 1);
    QS_rand(arr, pi + 1, high);
}

void quick_sort_rand(vector<int> &arr, int n)
{
    srand(time(0));  // Seed RNG with current time for non-determinism
    QS_rand(arr, 0, n - 1);
}
```

### Python Equivalent

```python
import random

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low >= high:
        return
    # Randomized pivot selection
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
    pi = partition(arr, low, high)
    quick_sort(arr, low, pi - 1)
    quick_sort(arr, pi + 1, high)
```

---

## 13. Quick Sort — Complexity Analysis

| Case | Time Complexity | Space Complexity |
|---|---|---|
| Best Case | $O(n \log n)$ | $O(\log n)$ |
| Average Case | $O(n \log n)$ | $O(\log n)$ |
| Worst Case | $O(n^2)$ | $O(n)$ |

**Worst-case proof (deterministic, always-last-element pivot):**

The worst case occurs when every partition call selects the smallest or largest element as pivot, producing splits of size 0 and $n-1$. This happens on an already-sorted or reverse-sorted array. The recurrence becomes:

$$T(n) = T(n-1) + T(0) + \Theta(n) = T(n-1) + \Theta(n)$$

Unrolling:

$$T(n) = \Theta(n) + \Theta(n-1) + \cdots + \Theta(1) = \Theta\!\left(\sum_{k=1}^{n} k\right) = \Theta\!\left(\frac{n(n+1)}{2}\right) = \Theta(n^2)$$

**Average-case proof (randomized pivot):**

With a random pivot, the expected split at each level is balanced on average. If we define the expected rank of the pivot as uniformly distributed over $[1, n]$, then the expected running time satisfies:

$$E[T(n)] = \frac{1}{n} \sum_{q=0}^{n-1} \left(E[T(q)] + E[T(n-q-1)]\right) + \Theta(n)$$

By symmetry, this simplifies to:

$$E[T(n)] = \frac{2}{n} \sum_{q=0}^{n-1} E[T(q)] + \Theta(n)$$

Using the substitution $E[T(n)] \leq c \cdot n \log n$ and verifying the inequality closes, we get $E[T(n)] = O(n \log n)$.

**Space overhead:** Quick Sort is **in-place** for data movement — no auxiliary array is allocated. However, the recursive call stack uses $O(\log n)$ space in the average case (due to balanced splits) and $O(n)$ in the worst case (due to unbalanced splits and deep recursion). The stack frames are the only auxiliary cost.

**In-place status:** Yes, for data. No, for the call stack. The space consumed is purely the function-call overhead, making Quick Sort extremely memory-efficient when splits are balanced.

---

## 14. Worked Examples

### Example 1 — Counting Inversions with Merge Sort

An **inversion** in array $A$ is a pair $(i, j)$ where $i < j$ but $A[i] > A[j]$. The number of inversions is a direct measure of "how unsorted" an array is.

**Key insight:** Every time Merge Sort picks an element from the *right* half during the merge step (i.e., `arr[right] < arr[left]`), the right element is smaller than all remaining elements in the left half — so it contributes exactly `(mid - left + 1)` inversions in a single O(1) observation.

```cpp
// Augmenting merge_sort to count inversions — extends 4thMayLab02/merge_sort.cpp
long long merge_count(vector<int> &arr, int low, int mid, int high)
{
    vector<int> temp;
    int left = low, right = mid + 1;
    long long inv = 0;
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) {
            temp.push_back(arr[left++]);
        } else {
            // arr[right] < all of arr[left..mid] — all (mid - left + 1) pairs are inversions
            inv += (mid - left + 1);
            temp.push_back(arr[right++]);
        }
    }
    while (left <= mid)  temp.push_back(arr[left++]);
    while (right <= high) temp.push_back(arr[right++]);
    for (int i = low; i <= high; i++) arr[i] = temp[i - low];
    return inv;
}

long long count_inversions(vector<int> &arr, int low, int high)
{
    if (low >= high) return 0;
    int mid = low + (high - low) / 2;
    long long inv = 0;
    inv += count_inversions(arr, low, mid);
    inv += count_inversions(arr, mid + 1, high);
    inv += merge_count(arr, low, mid, high);
    return inv;
}
```

**Test:** `[5, 3, 1, 4, 2]` → Inversions: (5,3),(5,1),(5,4),(5,2),(3,1),(3,2),(4,2) = **7 inversions**

---

### Example 2 — The Worst-Case Pivot Trap (Deterministic vs. Randomized)

This example demonstrates exactly why `quick_sort_random_pivot.cpp` exists alongside `quick_sort.cpp`.

**Input:** A sorted array of size $n = 10$: `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`

With deterministic Quick Sort (last-element pivot):
- First partition: pivot = 10, all elements ≤ 10, so left subarray has size 9, right has size 0.
- Second partition: pivot = 9, left has size 8, right has size 0.
- Pattern: the recursion tree is a single chain of depth 9 — $O(n^2)$ total comparisons.

With randomized Quick Sort:
- Pivot is selected uniformly at random. The probability of consistently picking near-maximum elements diminishes exponentially with array size.
- Expected number of comparisons: $\approx 2n \ln n$ (derivable from the expected number of comparisons between element pairs in random permutation).

The single-line change `int rand_idx = low + rand() % (high - low + 1); swap(arr[rand_idx], arr[high]);` is the entire difference between an $O(n^2)$ deterministic trap and an $O(n \log n)$ expected-time algorithm.

---

## 15. Practice Problems

1. **Sort an array of 0s, 1s and 2s** (Dutch National Flag — essentially a 3-way partition, a direct generalization of Quick Sort's partition step)
2. **Merge K sorted arrays** (extending the merge step from Merge Sort to $K$ sources using a min-heap)
3. **Find the K-th largest element in an unsorted array** (Quickselect — partial Quick Sort that only recurses on one side)
4. **Count the number of inversions in an array** (as worked out above with augmented Merge Sort)
5. **Sort a Linked List** (Merge Sort generalizes naturally to linked lists since we can split without index arithmetic; Quick Sort is awkward without random access)
6. **Minimum number of swaps to sort an array** (requires detecting cycles in the permutation graph — a variation on counting inversions)

---

## 16. Cheat Sheet

### Algorithm Selection Guide

| Condition | Recommended Algorithm |
|---|---|
| Nearly sorted input | Insertion Sort (best-case $O(n)$) |
| Stable sort required | Merge Sort (left-prefers on tie: `arr[left] <= arr[right]`) |
| Memory is constrained | Quick Sort or Insertion Sort (in-place) |
| Worst-case guarantee needed | Merge Sort ($O(n \log n)$ always) |
| Average-case speed priority | Quick Sort with random pivot (low constant factors) |
| Tiny arrays ($n < 16$) | Insertion Sort (cache-friendly, no overhead) |

### Complexity Quick Reference

| Algorithm | Best | Average | Worst | Space | Stable? | In-place? |
|---|---|---|---|---|---|---|
| Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | ✅ Yes | ✅ Yes |
| Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | ✅ Yes | ❌ No |
| Quick Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | ❌ No | ✅ Yes |

### Key Formulas

$$\text{Insertion Sort total shifts} = \sum_{j=1}^{n-1} j = \frac{n(n-1)}{2}$$

$$\text{Merge Sort recurrence} \quad T(n) = 2T\!\left(\frac{n}{2}\right) + \Theta(n) \implies T(n) = \Theta(n \log n)$$

$$\text{Overflow-safe midpoint} \quad \text{mid} = \text{low} + \left\lfloor \frac{\text{high} - \text{low}}{2} \right\rfloor$$

$$\text{Lomuto pivot final index} = i + 1 \quad \text{where } i = |\{j : A[j] \leq \text{pivot},\; \text{low} \leq j < \text{high}\}| + \text{low} - 1$$

### Stability Rule of Thumb

A sort is **stable** if equal elements preserve their original relative order. Merge Sort is stable because we prefer the left element on a tie (`arr[left] <= arr[right]` in `merge_arr`). Quick Sort with Lomuto partitioning is **unstable** because the pivot-placement swap can rearrange equal elements.

### Insertion Sort as an Adaptive Algorithm

Insertion Sort's runtime is precisely $\Theta(n + I)$ where $I$ is the number of inversions in the input. On nearly-sorted data with $I = O(n)$ inversions, it runs in $\Theta(n)$. This makes it the preferred choice as a base case in hybrid algorithms like **Timsort** (Python's built-in sort) and **Introsort** (C++'s `std::sort`), which fall back to Insertion Sort for subarrays below a threshold (typically 16–32 elements).
