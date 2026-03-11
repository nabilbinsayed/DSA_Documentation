---
title: Two Pointer Method
draft: false
tags:
---

# 🧭 Two Pointers Technique — The Beginner's Complete Guide

> **Exam Focus:** One of the most frequently tested DSA patterns. Master this and you'll crack a wide range of array/string problems in O(n) time.

---

## 📌 What Is the Two Pointers Technique?

The **Two Pointers** technique uses two index variables that traverse a data structure — usually an array or string — simultaneously. Instead of using nested loops (O(n²)), you move two pointers smartly to solve problems in **O(n)**.

**Two main variants:**

- **Opposite ends:** One pointer starts at the left, another at the right — they move toward each other.
- **Same direction (Slow & Fast):** Both pointers start at the left but move at different speeds.

---

## 🌍 Real-World Analogy

Imagine you're searching for two students in a **sorted class register** whose roll numbers add up to a target (say, 100).

- **Brute force:** Check every pair — slow.
- **Two Pointers:** Start with the first and last student. If their sum is too high, move the last pointer left. If too low, move the first pointer right. You find the pair in a single pass!

---

## 🔑 Core Idea — Pseudocode

```
function twoPointers(arr, target):
    left  ← 0
    right ← len(arr) - 1

    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            return (left, right)          // Found!
        else if current_sum < target:
            left ← left + 1              // Need a bigger value
        else:
            right ← right - 1            // Need a smaller value

    return -1                             // Not found
```

---

## 💻 Code Implementations

### C++

```cpp
#include <vector>
using namespace std;

pair<int,int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)  return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {-1, -1};
}
```

### Python

```python
def two_sum(arr: list[int], target: int) -> tuple[int, int]:
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return (left, right)
        elif total < target:
            left += 1
        else:
            right -= 1
    return (-1, -1)
```

### "C#"

```csharp
public (int, int) TwoSum(int[] arr, int target) {
    int left = 0, right = arr.Length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target)  return (left, right);
        else if (sum < target) left++;
        else right--;
    }
    return (-1, -1);
}
```

---

## ⏱️ Time & Space Complexity

|Approach|Time Complexity|Space Complexity|Notes|
|---|---|---|---|
|Brute Force (nested loop)|O(n²)|O(1)|Check every pair|
|Two Pointers|**O(n)**|**O(1)**|Single pass, no extra space|
|Hash Map (unsorted)|O(n)|O(n)|Extra space for the map|

> ✅ **Two Pointers wins** when the array is sorted — O(n) time AND O(1) space.

---

## 🧪 LeetCode Examples

### Example 1 — [LC 167: Two Sum II (Sorted Array)](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

**Problem:** Given a 1-indexed sorted array, return indices of two numbers that add up to `target`.

```
Input:  numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
```

**Approach:** Classic opposite-end pointers on the already-sorted array.

```python
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:   return [left+1, right+1]
        elif s < target:  left += 1
        else:             right -= 1
```

**Edge Cases to watch:**

- `[1, 1]` with target `2` → both pointers on the same value, but `left < right` guards this correctly.
- Large arrays — two pointers still runs in O(n), no overflow risk in logic.

---

### Example 2 — [LC 125: Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**Problem:** Check if a string is a palindrome, considering only alphanumeric characters.

```
Input:  "A man, a plan, a canal: Panama"
Output: true
```

**Approach:** Shrink from both ends, skip non-alphanumeric characters.

```python
def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

**Edge Cases to watch:**

- Empty string `""` → returns `True` (vacuously palindrome).
- All special characters `"!!!"` → both pointers meet without mismatch → `True`.
- Single character `"a"` → `left` never `< right` → `True`.

---

## ⚠️ Common Mistakes

1. **Using two pointers on an unsorted array** for sum problems — the logic breaks without sorted order. Always sort first if needed (adds O(n log n)).
    
2. **Moving both pointers at once** — only move the pointer whose side needs adjustment, not both.
    
3. **Off-by-one on loop condition** — use `left < right`, not `left <= right`. When they meet, there's no valid pair to check.
    
4. **Forgetting to handle duplicates** — in problems like 3Sum, you must skip duplicate values to avoid repeated results.
    
5. **Applying this to unsorted linked lists** — two pointers work on arrays easily; linked lists need extra care since you can't go backwards.
    

---

## 🏋️ Practice Problems (Sorted by Difficulty)

|#|Problem|Difficulty|Variant|
|---|---|---|---|
|1|LC 167 — Two Sum II|🟢 Easy|Opposite ends|
|2|LC 125 — Valid Palindrome|🟢 Easy|Opposite ends|
|3|LC 283 — Move Zeroes|🟢 Easy|Same direction|
|4|LC 11 — Container With Most Water|🟡 Medium|Opposite ends|
|5|LC 15 — 3Sum|🟡 Medium|Opposite ends + sorting|
|6|LC 42 — Trapping Rain Water|🔴 Hard|Opposite ends|

---

## 🎯 Quick Exam Cheat Sheet

```
Sorted array + find pair/triplet    → Two Pointers (opposite ends)
Remove duplicates / partition       → Two Pointers (same direction)
Palindrome / string check           → Two Pointers (opposite ends)
Sliding window problems             → Two Pointers (same direction, fast/slow)

Time:  O(n)   ✅
Space: O(1)   ✅
Prerequisite: Array must be SORTED for sum-based problems
```

---
