# One-Dimensional Arrays: Memory Layout, Indexing Math, and Partition Stability

The one-dimensional array is the most fundamental data structure in computer science. Almost all complex data structures—such as array-lists, heaps, hash tables, and matrices—are built upon it. To use arrays effectively, developers must understand not just how to loop through them, but how they map directly to physical memory addresses, and the algorithmic trade-offs of manipulating their elements.

In this guide, we will explore 1D arrays in C/C++: how contiguous memory enables constant-time $O(1)$ random access, how to optimize a naive $O(N^2)$ equilibrium index search into a linear-time $O(N)$ algorithm using prefix sums, and the trade-offs between Time Complexity, Space Complexity, and **Stability** when partitioning elements in-place.

---

## 1. What is a 1D Array?

### Formal Definition
A **One-Dimensional Array** is a linear data structure that stores a fixed-size, sequential collection of elements of the same data type in contiguous memory locations. Because of this contiguous layout, the address of any element can be computed mathematically using its index, enabling random access.

### Intuitive Explanation
Imagine a row of identical storage lockers at a transit station. 
- All lockers are of the exact same size.
- They are numbered sequentially starting at $0$.
- They are built side-by-side with no gaps.

If you know the physical location of the very first locker (Locker $0$) and the width of a single locker, you can calculate the exact location of Locker $5$ without opening or counting lockers $1$ through $4$. You simply start at Locker $0$ and walk exactly $5$ locker-widths forward. This is how a computer accesses array indices.

### The Storage Locker Analogy (Address Offset Mapping)
Let's map this physical layout to computer memory. Consider an array of integers `int arr[4]` starting at memory address `1000`. In C, an `int` occupies $4$ bytes of memory:

```
Index:         0           1           2           3
Address:    [1000]      [1004]      [1008]      [1012]
Value:     [  -7  ]    [   1  ]    [   5  ]    [   2  ]
```

To access `arr[2]`, the CPU does not traverse indices $0$ and $1$. It uses the **Address Offset Formula**:
$$\text{Address}(arr[i]) = \text{BaseAddress} + i \times \text{SizeOfElement}$$
$$\text{Address}(arr[2]) = 1000 + 2 \times 4 = 1008$$
Because the CPU can perform addition and multiplication in a single instruction cycle, finding the address takes the exact same amount of time regardless of whether the index is $2$ or $20,000,000$. This is the magic of $O(1)$ constant-time random access.

---

## 2. The Core Idea

### Prefix Sums & The Equilibrium Index
An **Equilibrium Index** of an array is an index $i$ such that the sum of elements at lower indices is equal to the sum of elements at higher indices:
$$\sum_{j=0}^{i-1} arr[j] = \sum_{k=i+1}^{N-1} arr[k]$$

#### **The Naive Approach ($O(N^2)$)**
A naive approach loops through each index $i$, and for each index, runs two nested loops: one to sum everything on the left, and another to sum everything on the right. If the sums match, it returns $i$. Because of the nested loops, this runs in quadratic $O(N^2)$ time.

#### **The Optimized Prefix-Sum Approach ($O(N)$)**
We can optimize this to linear $O(N)$ time by maintaining a running sum:
1. First, compute the `total_sum` of the entire array in a single linear pass.
2. Maintain a variable `left_sum`, initialized to $0$.
3. Iterate through the array. At index $i$, the sum of elements to the right can be computed in constant $O(1)$ time:
   $$\text{right\_sum} = \text{total\_sum} - \text{left\_sum} - arr[i]$$
4. If `left_sum == right_sum`, then $i$ is the equilibrium index.
5. If not, add $arr[i]$ to `left_sum` and continue.

By using the prefix sum trick, we eliminate nested loops completely, reducing the time complexity to $O(N)$.

---

### The Partitioning Problem: Time, Space, and Stability
Partitioning involves rearranging array elements so that elements meeting a certain condition (e.g., even numbers) appear before elements that do not (e.g., odd numbers). 

When designing a partition algorithm, we must manage three competing properties:
1. **Time Complexity**: The number of operations ($O(N)$ vs $O(N^2)$).
2. **Space Complexity**: The auxiliary memory allocated ($O(1)$ in-place vs $O(N)$ out-of-place).
3. **Stability**: Whether the algorithm preserves the relative order of elements within the partitioned groups.

#### **The Three-Way Trade-off Matrix**
| Algorithm Strategy | Time | Space (Auxiliary) | Stable? |
|---|---|---|---|
| **Two-Pointer Partition** | $O(N)$ | $O(1)$ (In-place) | **No** (Elements are swapped from ends, breaking order) |
| **Buffer-Array Partition** | $O(N)$ | $O(N)$ (Out-of-place) | **Yes** (Copies evens first, then odds) |
| **Adjacent-Swap Partition** | $O(N^2)$| $O(1)$ (In-place) | **Yes** (Bubble-shifts elements to preserve order) |

If our requirements dictate that we **must modify the array in-place** ($O(1)$ space) **and preserve stability**, we are forced to accept an $O(N^2)$ time complexity. This is the exact design trade-off implemented in our codebase's partitioning routine.

---

## 3. Pseudocode (CLRS Style)

### Optimized Equilibrium Index Search ($O(N)$ Time)
```text
OPTIMIZED-EQUILIBRIUM(A)
1  N = A.length
2  total_sum = 0
3  for i = 0 to N - 1
4      total_sum = total_sum + A[i]
5  left_sum = 0
6  for i = 0 to N - 1
7      right_sum = total_sum - left_sum - A[i]
8      if left_sum == right_sum
9          return i
10     left_sum = left_sum + A[i]
11 return -1
```

### Stable In-Place Partition via Adjacent Swaps ($O(N^2)$ Time)
```text
STABLE-IN-PLACE-PARTITION(A)
1  N = A.length
2  while true
3      swapped = false
4      for i = 0 to N - 2
5          // If left element is odd and right is even, swap them
6          if A[i] % 2 == 1 and A[i+1] % 2 == 0
7              swap A[i] with A[i+1]
8              swapped = true
9      if swapped == false
10         break
```

---

## 4. Implementation

### C Implementation
This includes our naive equilibrium search (highlighting how to optimize it) and our stable in-place partitioning algorithm.
```c
#include <stdio.h>
#include <stdbool.h>

// Naive implementation from our codebase (CPP/nab_equilibrium.c)
// Runs in O(N^2) time due to nested summation loops
int find_equilibrium_naive(int arr[], int len)
{
    if (len < 3) return -1;

    for (int i = 1; i < len - 1; i++)
    {
        int left_sum = 0;
        int right_sum = 0;
        for (int j = i - 1; j >= 0; j--)
            left_sum += arr[j];
        for (int k = i + 1; k < len; k++)
            right_sum += arr[k];

        if (left_sum == right_sum)
            return i; // Equilibrium found
    }
    return -1;
}

// Optimized implementation using Prefix Sum logic
// Runs in O(N) time with O(1) space
int find_equilibrium_optimized(int arr[], int len)
{
    if (len < 3) return -1;

    int total_sum = 0;
    for (int i = 0; i < len; i++)
        total_sum += arr[i];

    int left_sum = 0;
    for (int i = 0; i < len; i++)
    {
        int right_sum = total_sum - left_sum - arr[i];
        if (left_sum == right_sum)
            return i;
        left_sum += arr[i];
    }
    return -1;
}

// Stable In-place Partitioning (from CPP/odd_even_ordering.c)
// Runs in O(N^2) time, O(1) auxiliary space, preserving stability
void stable_partition_odd_even(int arr[], int n)
{
    while (1)
    {
        bool swapped = false;
        for (int i = 0; i < n - 1; i++)
        {
            // Swap if an odd number is adjacent to and before an even number
            if (arr[i] % 2 == 1 && arr[i + 1] % 2 == 0)
            {
                int temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped)
            break; // Stop when no more bubble swaps occur
    }
}

int main()
{
    int eq_arr[] = {-7, 1, 5, 2, -4, 3, 0};
    int len = sizeof(eq_arr) / sizeof(eq_arr[0]);
    printf("Naive Equilibrium Index: %d\n", find_equilibrium_naive(eq_arr, len));
    printf("Optimized Equilibrium Index: %d\n\n", find_equilibrium_optimized(eq_arr, len));

    int part_arr[] = {1, 3, 6, 12, 2, 13, 7, 8};
    int n = sizeof(part_arr) / sizeof(part_arr[0]);
    stable_partition_odd_even(part_arr, n);
    
    printf("Stable Partitioned Odd-Even Array:\n");
    for (int i = 0; i < n; i++)
        printf("%d ", part_arr[i]);
    printf("\n");
    return 0;
}
```

### C++ Implementation
```cpp
#include <iostream>
#include <vector>
#include <numeric> // std::accumulate

int findEquilibriumCpp(const std::vector<int> &v)
{
    if (v.size() < 3) return -1;

    // Use std::accumulate to compute total sum in O(N)
    int total_sum = std::accumulate(v.begin(), v.end(), 0);
    int left_sum = 0;

    for (size_t i = 0; i < v.size(); ++i)
    {
        int right_sum = total_sum - left_sum - v[i];
        if (left_sum == right_sum)
            return i;
        left_sum += v[i];
    }
    return -1;
}

int main()
{
    std::vector<int> v = {-7, 1, 5, 2, -4, 3, 0};
    std::cout << "Equilibrium index: " << findEquilibriumCpp(v) << std::endl;
    return 0;
}
```

### Python Implementation
```python
def find_equilibrium(arr: list[int]) -> int:
    if len(arr) < 3:
        return -1
        
    total_sum = sum(arr)
    left_sum = 0
    
    for idx, num in enumerate(arr):
        right_sum = total_sum - left_sum - num
        if left_sum == right_sum:
            return idx
        left_sum += num
        
    return -1

def stable_partition_odd_even(arr: list[int]) -> list[int]:
    # Stable partition in Python can be done in O(N) time and space
    evens = [x for x in arr if x % 2 == 0]
    odds = [x for x in arr if x % 2 == 1]
    return evens + odds

if __name__ == "__main__":
    arr = [-7, 1, 5, 2, -4, 3, 0]
    print(f"Equilibrium Index: {find_equilibrium(arr)}")
    
    unsorted = [1, 3, 6, 12, 2, 13, 7, 8]
    print(f"Stable Partition: {stable_partition_odd_even(unsorted)}")
```

---

## 5. Complexity Analysis

### Time Complexity Proof of Partition Bubble-Shifts
In the stable in-place partition using adjacent swaps, the worst-case scenario occurs when all odd numbers appear before all even numbers in the array:
$$A = [1, 3, 5, 2, 4, 6] \quad (\text{all odds before evens})$$

For each even number to slide past all odd numbers:
- The first even number must be swapped with every odd number to its left.
- If there are $M$ odd numbers and $K$ even numbers (where $M + K = N$), each even number performs up to $M$ adjacent swaps.
- The total number of comparisons and swaps is bounded by:
  $$\text{Swaps} \le M \times K \le \frac{N}{2} \times \frac{N}{2} = \frac{N^2}{4}$$
- In Big-O notation, constant factors are dropped:
  $$\text{Time Complexity} = O(N^2)$$

This confirms that stable in-place partition using adjacent bubble swaps takes quadratic time.

---

## 6. Worked Examples

### Example 1: Comparing Naive and Optimized Equilibrium Index
In `CPP/nab_equilibrium.c`, our original implementation used a nested loop structure:
```c
  for (int i = 1; i < len - 1; i++) {
    int sumback = 0;
    int sumfront = 0;
    for (int j = i - 1; j >= 0; j--) {
      sumback += arr[j];
    }
    for (int k = i + 1; k < len; k++) {
      sumfront += arr[k];
    }
    ...
```
For an input array of $100,000$ elements, this naive nested loop executes roughly $5,000,000,000$ operations, causing the program to hang.
By changing the logic to our running sum (prefix sum) technique:
```c
    int total_sum = 0;
    for (int i = 0; i < len; i++) total_sum += arr[i];
    int left_sum = 0;
    for (int i = 0; i < len; i++) {
        int right_sum = total_sum - left_sum - arr[i];
        if (left_sum == right_sum) return i;
        left_sum += arr[i];
    }
```
We scan the array of $100,000$ elements exactly twice (200,000 operations), which executes in a fraction of a millisecond.

### Example 2: Stable Odd-Even Partition
In `CPP/odd_even_ordering.c`, we rearrange elements so that evens appear before odds while maintaining their relative ordering:
Input: `arr = {1, 3, 6, 12, 2, 13, 7, 8}`
1. The loop scans from left to right.
2. It encounters `3` (odd) and `6` (even). Since they are adjacent and mismatched, it swaps them: `arr` becomes `{1, 6, 3, 12, 2, 13, 7, 8}`.
3. On the next pass, it finds `3` (odd) and `12` (even), swapping them: `{1, 6, 12, 3, 2, 13, 7, 8}`.
4. This continues until all evens have bubbled to the left.
Output: `{6, 12, 2, 8, 1, 3, 13, 7}`
Notice that the even numbers (`6, 12, 2, 8`) and odd numbers (`1, 3, 13, 7`) preserve their relative input order. The algorithm runs in $O(N^2)$ time but uses zero auxiliary memory ($O(1)$ space).

---

## 7. Practice Problems

1. **Unstable In-place Partition (Two-Pointer):**
   Implement the unstable in-place partition using a two-pointer technique. Show that it runs in $O(N)$ time and $O(1)$ space, but trace how the relative order of elements is disrupted.
2. **Find the Subarray with Max Sum (Kadane's Algorithm):**
   Given an integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. Implement this in $O(N)$ time.
3. **Move Zeros to the End:**
   Given an array, move all `0`s to the end of it while maintaining the relative order of the non-zero elements in-place. Verify that it executes in $O(N)$ time.

---

## 8. Cheat Sheet

### Array Address Mathematics
- **L-value Offset:** `arr[i]` is syntactic sugar for `*(arr + i)`.
- **Address Retrieval:** `&arr[i]` is identical to `arr + i`.
- **Memory Decay:** When passed to a function, an array decays to a pointer. Therefore, `sizeof(arr)` inside a function returns the size of the pointer (usually $8$ bytes on 64-bit systems), not the size of the array. **Always pass the array length as a separate parameter.**

### Core Array Loop Patterns
- **In-place Reversal Pattern:**
  ```c
  for (int i = 0, j = len - 1; i < j; i++, j--) {
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  ```
- **Running Prefix Sum Pattern:**
  ```text
  left_sum = 0
  right_sum = total_sum - left_sum - current_value
  ```
