---
title: Linked List Revisited
draft: false
tags:
  - DSA
  - CSE241
  - CPP
  - LinkedList
---


---

## 1. Definition

A **linked list** is a linear data structure where elements (nodes) are stored non-contiguously in memory. Each node holds two things: a value (`val`) and a pointer to the next node (`next`). The last node's `next` points to `nullptr`.

Unlike arrays, there is no index-based random access. You navigate by following pointers.

---

## 2. Core Idea

The key insight: **a pointer to the head is the entire list.** Every operation takes `head` as input and returns a (possibly new) `head`.

A node is just two fields:

```cpp
class Node {
public:
    int val;
    Node *next;

    Node(int val) { this->val = val; next = nullptr; }
    Node(int val, Node *next) { this->val = val; this->next = next; }
    Node() { this->next = nullptr; }
};
```

The three-constructor pattern covers the three natural ways you build a node: with a value only, with a value and explicit next pointer (used in `insertAtHead`), or empty.

---

## 3. Core Operations

### Building from an array

```cpp
Node *array_to_LL(vector<int> arr) {
    if (arr.empty()) return nullptr;

    Node *head = new Node(arr[0]);
    Node *temp = head;

    for (int i = 1; i < arr.size(); i++) {
        Node *newNode = new Node(arr[i]);
        temp->next = newNode;
        temp = temp->next;
    }
    return head;
}
```

A `temp` pointer walks forward while `head` stays anchored at the start. This pattern (anchor + walker) recurs everywhere.

---

### Insertion

**At head** — O(1): wrap the new node around the old head.

```cpp
Node *insertAtHead(Node *head, int newData) {
    Node *newNode = new Node(newData, head);
    return newNode;
}
```

The two-arg constructor does all the work: `newNode->next = head` in one shot.

---

**At tail** — O(n): walk to the last node, then append.

```cpp
Node *insertAtEnd(Node *head, int newData) {
    if (head == nullptr) return new Node(newData);

    Node *temp = head;
    while (temp->next != nullptr)
        temp = temp->next;

    temp->next = new Node(newData);
    return head;
}
```

---

**At k-th position** — O(k): walk to position `k-1`, splice in.

```cpp
Node *insert_at_Kth_position(Node *head, int k, int newData) {
    if (k == 0) return insertAtHead(head, newData);

    Node *temp = head;
    int cnt = 0;
    bool flag = false;

    while (temp->next != nullptr) {
        if (cnt == k - 1) { flag = true; break; }
        temp = temp->next;
        cnt++;
    }

    if (flag) {
        Node *newNode = new Node(newData, temp->next);
        temp->next = newNode;
    }
    return head;
}
```

Stop at `k-1` so you can set `newNode->next = temp->next` before overwriting `temp->next`.

---

### Deletion

**Head** — O(1):

```cpp
Node *delete_head(Node *head) {
    if (head == nullptr) return head;
    Node *temp = head;
    head = head->next;
    delete temp;
    return head;
}
```

Save old head, advance, free. Always `delete` what you `new`.

---

**Tail** — O(n): walk to the second-to-last node.

```cpp
Node *delete_tail(Node *head) {
    if (head == nullptr) return head;
    if (head->next == nullptr) { delete head; return nullptr; }

    Node *temp = head;
    while (temp->next->next != nullptr)
        temp = temp->next;

    delete temp->next;
    temp->next = nullptr;
    return head;
}
```

`temp->next->next != nullptr` is the key condition — stops one node before the tail.

---

**k-th element** — O(k):

```cpp
Node *delete_Kth_element(Node *head, int k) {
    if (k == 0) return delete_head(head);

    Node *temp = head;
    int cnt = 0;
    bool flag = false;

    while (temp->next != nullptr) {
        if (cnt == k - 1) { flag = true; break; }
        temp = temp->next;
        cnt++;
    }

    if (flag) {
        if (temp->next->next == nullptr) return delete_tail(head);
        Node *nodeToDelete = temp->next;
        temp->next = nodeToDelete->next;
        delete nodeToDelete;
    }
    return head;
}
```

---

**By value** — O(n): scan until you find it.

```cpp
Node *delete_by_value(Node *head, int val) {
    if (head->val == val) return delete_head(head);

    Node *temp = head;
    while (temp->next != nullptr) {
        if (temp->next->val == val) {
            Node *nodeToDelete = temp->next;
            temp->next = nodeToDelete->next;
            delete nodeToDelete;
            return head;
        }
        temp = temp->next;
    }
    return head;
}
```

---

### Merging two sorted lists

This is the elegant one. Recursive, clean, minimal code:

```cpp
Node *merge_sorted_LLs(Node *l1, Node *l2) {
    if (l1 == nullptr) return l2;
    if (l2 == nullptr) return l1;

    if (l1->val <= l2->val) {
        l1->next = merge_sorted_LLs(l1->next, l2);
        return l1;
    } else {
        l2->next = merge_sorted_LLs(l2->next, l1);
        return l2;
    }
}
```

At each step: pick the smaller head, recursively merge the rest. Base case handles exhaustion of either list.

Example: merging `{1,3,5,7,10}` and `{2,3,100}` → `1 2 3 3 5 7 10 100`.

---

## 4. Complexity

| Operation | Time | Space |
|---|---|---|
| Insert at head | O(1) | O(1) |
| Insert at tail | O(n) | O(1) |
| Insert at k | O(k) | O(1) |
| Delete head | O(1) | O(1) |
| Delete tail | O(n) | O(1) |
| Delete by value | O(n) | O(1) |
| Merge sorted | O(m+n) | O(m+n) stack |
| Print / search | O(n) | O(1) |

The recursive merge uses O(m+n) stack space — iterative version uses O(1).

---

## 5. Common Misconceptions

**"Deleting a node frees it automatically."**  
No. In C++, `new` allocates on the heap. You must `delete` manually or you leak memory.

**"You can insert at k without checking the flag."**  
If `k` exceeds the list length, `flag` stays false and you skip the insertion silently. This is intentional — guard against out-of-bounds k.

**"The recursive merge copies nodes."**  
It doesn't. It *rewires* existing nodes' `next` pointers. No new memory is allocated; the original nodes are mutated.

**"Two-arg constructor is unnecessary."**  
It's a convenience specifically for `insertAtHead`. `new Node(newData, head)` is cleaner than constructing then setting next separately.

---

## 6. Practice Problems

- Reverse a singly linked list (iterative + recursive)
- Detect a cycle (Floyd's algorithm)
- Find the middle node (slow/fast pointer)
- Remove nth node from end
- Merge k sorted lists (extension of the above)
- Check if a linked list is a palindrome

---

## 7. Cheat Sheet

```
Insert head:     new Node(val, head)           → O(1)
Insert tail:     walk to last, append          → O(n)
Insert at k:     walk to k-1, splice           → O(k)
Delete head:     head = head->next; delete old → O(1)
Delete tail:     walk to n-2, null out next    → O(n)
Delete by val:   walk, check next->val         → O(n)
Merge sorted:    pick smaller head, recurse    → O(m+n)

Pattern: anchor (head stays) + walker (temp moves)
Pattern: stop at k-1 to splice, stop at n-2 to delete tail
```
