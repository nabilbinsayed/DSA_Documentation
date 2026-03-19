---
title: Pointers
draft: false
tags:
---


  

> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

  

Pointers are the mechanism by which programs talk directly to memory. Every data structure you will ever implement — linked lists, trees, graphs, stacks — is ultimately built on pointers. Understanding them is not optional; it is the foundation everything else rests on.

  

This note covers pointers from first principles, then systematically walks through every notation and usage pattern you will encounter, and finally shows how they appear in each major data structure.

  

---

  

## What is a Pointer?

  

A **pointer** is a variable that stores a **memory address** — the location in RAM where another value lives.

  

When you declare an ordinary variable:

  

```cpp

int x = 42;

```

  

The value `42` is stored somewhere in memory, say at address `0x7ffd3a10`. A pointer captures that address:

  

```cpp

int* p = &x;   // p holds the address of x

```

  

Now `p` does not hold `42`. It holds `0x7ffd3a10` — the *location* of `42`.

  

```

Memory:

Address     Value

0x7ffd3a10  42       ← x lives here

0x7ffd3a14  0x7ffd3a10  ← p lives here, stores address of x

```

  

The analogy: `x` is a house. `p` is a piece of paper with the house's street address written on it. The paper is not the house — but following the address leads you to it.

  

---

  

## Why Pointers Exist

  

Without pointers, every function receives a **copy** of its arguments. Modifying the copy does not affect the original. Pointers solve this by letting you pass the *address* of a variable instead of its value — so the function can reach through the address and modify the original directly.

  

Beyond functions, pointers enable:

  

- **Dynamic memory allocation** — creating data structures whose size is not known at compile time

- **Linked structures** — nodes that reference other nodes, forming lists, trees, graphs

- **Efficient passing of large objects** — pass an address (8 bytes) instead of copying a 10MB struct

  

---

  

## Pointer Notation in C++

  

### Declaration: `int* p`

  

The `*` in a declaration means "this variable is a pointer to the given type."

  

```cpp

int* p;      // p is a pointer to int

double* d;   // d is a pointer to double

char* c;     // c is a pointer to char

```

  

The `*` can be written next to the type or next to the variable name — both are equivalent:

  

```cpp

int* p;   // common style: * with type

int *p;   // alternative: * with variable name

```

  

When declaring multiple pointers on one line, each variable needs its own `*`:

  

```cpp

int* a, *b;   // a and b are both pointers

int* a, b;    // a is a pointer, b is a plain int — common mistake

```

  

### Address-of Operator: `&`

  

The `&` operator returns the memory address of a variable.

  

```cpp

int x = 10;

int* p = &x;   // p now holds the address of x

  

cout << x;    // prints 10       (the value)

cout << &x;   // prints 0x7ffd.. (the address)

cout << p;    // prints 0x7ffd.. (same address, stored in p)

```

  

### Dereference Operator: `*`

  

The `*` operator on an existing pointer means "go to the address stored in this pointer and read/write the value there."

  

```cpp

int x = 10;

int* p = &x;

  

cout << *p;   // prints 10  — dereference: read value at address

*p = 99;      // write 99 to the address p points to

cout << x;    // prints 99  — x was modified through p

```

  

Think of `*p` as "follow the address in p and give me what's there."

  

### `*` in Declaration vs `*` as Dereference

  

These are the same symbol used in two completely different contexts:

  

```cpp

int* p = &x;   // * here means "p is a pointer" — declaration

*p = 42;       // * here means "go to address in p" — dereference

```

  

Context determines meaning. In a declaration, `*` is part of the type. Everywhere else, `*` is the dereference operator.

  

---

  

## Pointer to Pointer: `**`

  

A pointer can point to another pointer. This creates a chain of indirection.

  

```cpp

int x = 5;

int* p = &x;    // p points to x

int** pp = &p;  // pp points to p

  

cout << x;    // 5

cout << *p;   // 5   (dereference once: reach x)

cout << **pp; // 5   (dereference twice: reach x through p)

  

**pp = 100;

cout << x;    // 100 — modified through two levels of indirection

```

  

```

pp → p → x

      ↓

    address of x

```

  

`**` is used when a function needs to modify a pointer itself (not just the value it points to), and in 2D dynamic arrays.

  

---

  

## Reference to Pointer: `*&`

  

`*&` means "a reference to a pointer." It lets a function modify the caller's pointer variable directly — not just what it points to, but the pointer itself.

  

```cpp

void allocate(int*& p) {

    p = new int(42);   // modifies the caller's pointer

}

  

int* ptr = nullptr;

allocate(ptr);

cout << *ptr;   // 42 — ptr was changed by the function

```

  

Without the `&`, the function receives a copy of the pointer. Changing the copy does not affect the caller's pointer:

  

```cpp

void allocate(int* p) {       // p is a copy

    p = new int(42);           // only the copy changes

}

  

int* ptr = nullptr;

allocate(ptr);

cout << *ptr;   // CRASH — ptr is still nullptr

```

  

This is the most important notation in linked list implementations. Every function that modifies `head` must take `Node*& head`, not `Node* head`.

  

```cpp

void insertFront(Node*& head, int val) {

    Node* newNode = new Node(val);

    newNode->next = head;

    head = newNode;           // modifies caller's head — works because of *&

}

```

  

---

  

## `nullptr` vs `NULL` vs `0`

  

In modern C++, always use `nullptr` to represent a pointer that points to nothing.

  

```cpp

int* p = nullptr;   // correct — type-safe null pointer

int* q = NULL;      // old C style — avoid in C++

int* r = 0;         // also works but ambiguous

```

  

`nullptr` is typed — it cannot accidentally be passed as an integer. `NULL` is just `#define NULL 0`, which can cause ambiguous overload resolution in C++.

  

```cpp

if (p == nullptr) { /* pointer is empty */ }

if (p != nullptr) { /* pointer is valid */ }

```

  

---

  

## `const` and Pointers

  

`const` can appear in different positions relative to `*`, and each position means something different.

  

```cpp

int x = 10, y = 20;

  

const int* p = &x;    // pointer to const int — can't change *p, can change p

int* const q = &x;    // const pointer to int — can change *q, can't change q

const int* const r = &x; // const pointer to const int — can't change either

```

  

Rule of thumb: read right-to-left from the variable name.

  

- `const int* p` → p is a pointer, to a const int

- `int* const q` → q is a const pointer, to an int

  

```cpp

const int* p = &x;

*p = 99;    // ERROR — cannot modify through a pointer-to-const

p = &y;     // OK — the pointer itself can change

  

int* const q = &x;

*q = 99;    // OK — the value can be modified

q = &y;     // ERROR — the pointer cannot be reassigned

```

  

---

  

## Pointer Arithmetic

  

Adding or subtracting an integer from a pointer moves it by that many *elements* (not bytes).

  

```cpp

int arr[] = {10, 20, 30, 40, 50};

int* p = arr;   // p points to arr[0]

  

cout << *p;       // 10

cout << *(p + 1); // 20  — moves forward by sizeof(int) = 4 bytes

cout << *(p + 4); // 50

```

  

This works because arrays are contiguous. The formula:

  

$$\text{address}(p + k) = \text{address}(p) + k \times \text{sizeof}(\text{type})$$

  

Incrementing/decrementing a pointer:

  

```cpp

p++;   // advance to next element

p--;   // go back one element

```

  

Pointer arithmetic is only valid within the bounds of an array. Going out of bounds is undefined behavior.

  

```cpp

int* start = arr;

int* end = arr + 5;   // one past the last element

  

while (start != end) {

    cout << *start << " ";

    start++;

}

// prints: 10 20 30 40 50

```

  

---

  

## Dynamic Memory Allocation

  

### `new` and `delete`

  

`new` allocates memory on the **heap** at runtime and returns a pointer to it.

  

```cpp

int* p = new int;       // allocate one int

*p = 42;

  

int* arr = new int[10]; // allocate array of 10 ints

arr[3] = 99;

```

  

`delete` frees the memory. Every `new` must be paired with a `delete`:

  

```cpp

delete p;       // free single allocation

delete[] arr;   // free array allocation — [] is required for arrays

```

  

Failing to `delete` causes a **memory leak** — the memory remains allocated but unreachable for the rest of the program's lifetime.

  

After deleting, set the pointer to `nullptr` to prevent **dangling pointer** usage:

  

```cpp

delete p;

p = nullptr;   // safe — subsequent checks catch this

```

  

### Heap vs Stack

  

```cpp

int x = 10;         // stack — automatically freed when scope ends

int* p = new int;   // heap  — lives until you call delete

```

  

Stack memory is managed automatically but limited in size. Heap memory must be managed manually but can be arbitrarily large and can outlive the scope that created it.

  

---

  

## Pointers in Functions

  

### Pass by Pointer

  

```cpp

void increment(int* p) {

    (*p)++;   // dereference, then increment the value

}

  

int x = 5;

increment(&x);

cout << x;   // 6

```

  

Note `(*p)++` vs `*p++` — the latter increments the pointer, not the value. Use parentheses to be explicit.

  

### Return a Pointer

  

```cpp

int* createArray(int size) {

    return new int[size];   // caller must delete[]

}

  

int* arr = createArray(5);

// ... use arr ...

delete[] arr;

```

  

Never return a pointer to a local variable — it is destroyed when the function returns:

  

```cpp

int* badFunction() {

    int x = 42;

    return &x;   // WRONG — x is destroyed, pointer is dangling

}

```

  

---

  

## Pointers in C#

  

C# handles memory management automatically via garbage collection, so raw pointers are rarely needed. Instead, C# uses **references** — which behave like safe, managed pointers.

  

### References (Managed Pointers)

  

In C#, all class instances are reference types. When you assign one to a variable, you are copying a reference (address), not the object itself.

  

```csharp

class Node {

    public int data;

    public Node next;

    public Node(int val) { data = val; next = null; }

}

  

Node a = new Node(10);

Node b = a;           // b holds the same reference as a

b.data = 99;

Console.WriteLine(a.data);  // 99 — a and b point to the same object

```

  

This is conceptually identical to C++ pointer behavior, but without explicit `*` syntax.

  

### `ref` — Equivalent to `*&`

  

`ref` passes a variable by reference, allowing a function to modify the caller's variable — analogous to C++'s `*&`.

  

```csharp

void InsertFront(ref Node head, int val) {

    Node newNode = new Node(val);

    newNode.next = head;

    head = newNode;   // modifies caller's head

}

  

Node head = null;

InsertFront(ref head, 10);

InsertFront(ref head, 20);

// list: 20 → 10 → null

```

  

Without `ref`, assigning to `head` inside the function would only change the local copy.

  

### `out` — Uninitialized `ref`

  

`out` is like `ref` but the parameter does not need to be initialized before the call. Used when a function produces a new value.

  

```csharp

void FindNode(Node head, int item, out Node result) {

    result = null;

    while (head != null) {

        if (head.data == item) { result = head; return; }

        head = head.next;

    }

}

  

Node found;

FindNode(myList, 30, out found);

```

  

### `unsafe` and Raw Pointers in C#

  

C# does support raw pointers in `unsafe` blocks, with the same `*` and `&` notation as C++. This is rarely used in application code but appears in performance-critical or interop scenarios.

  

```csharp

unsafe {

    int x = 42;

    int* p = &x;

    *p = 99;

    Console.WriteLine(x);  // 99

}

```

  

Must compile with `/unsafe` flag. For most DSA purposes, `ref` and class references are sufficient.

  

### Null Checks in C#

  

```csharp

Node p = null;

  

if (p == null) { /* pointer is empty */ }

  

// Modern C# null-conditional operator

int? val = p?.data;   // null if p is null, p.data otherwise

  

// Null coalescing

Node current = head ?? new Node(0);  // use head if non-null, else new node

```

  

---

  

## Pointers in Data Structures

  

This section shows how every pointer notation appears in actual data structure implementations.

  

### Singly Linked List

  

The linked list is the canonical pointer data structure. Every operation revolves around following and modifying `next` pointers.

  

```cpp

class Node {

public:

    int data;

    Node* next;

    Node(int val) : data(val), next(nullptr) {}

};

```

  

**Traversal — following `*` through a chain:**

  

```cpp

void traverse(Node* head) {       // head is a pointer to the first node

    Node* ptr = head;             // ptr is a pointer that walks the list

    while (ptr != nullptr) {

        cout << ptr->data << " "; // ptr->data is (*ptr).data — dereference + field access

        ptr = ptr->next;          // advance: ptr now holds the address of the next node

    }

}

```

  

`ptr->data` is shorthand for `(*ptr).data` — dereference the pointer, then access the field.

  

**Insertion — why `*&` is essential:**

  

```cpp

void insertFront(Node*& head, int val) {  // *& — reference to pointer

    Node* newNode = new Node(val);

    newNode->next = head;   // new node points to current first node

    head = newNode;         // head itself is reassigned — only works because of *&

}

```

  

If `head` were `Node* head` (no `&`), the assignment `head = newNode` would only change the local copy. The caller's `head` would remain unchanged. The `&` makes `head` an alias for the caller's variable.

  

**C# equivalent:**

  

```csharp

class Node {

    public int data;

    public Node next;

    public Node(int val) { data = val; next = null; }

}

  

void InsertFront(ref Node head, int val) {

    Node newNode = new Node(val);

    newNode.next = head;

    head = newNode;

}

```

  

---

  

### Doubly Linked List

  

Two pointers per node — `forw` and `back`. Deletion is $O(1)$ because `back` gives the predecessor directly.

  

```cpp

class DNode {

public:

    int data;

    DNode* forw;

    DNode* back;

    DNode(int val) : data(val), forw(nullptr), back(nullptr) {}

};

  

void deleteNode(DNode*& head, DNode* loc) {

    if (loc->back != nullptr)

        loc->back->forw = loc->forw;  // predecessor's forward skips loc

    else

        head = loc->forw;             // deleting head — update head pointer via *&

  

    if (loc->forw != nullptr)

        loc->forw->back = loc->back;  // successor's back skips loc

  

    delete loc;   // free the memory

}

```

  

**C# equivalent:**

  

```csharp

class DNode {

    public int data;

    public DNode forw;

    public DNode back;

    public DNode(int val) { data = val; forw = null; back = null; }

}

  

void DeleteNode(ref DNode head, DNode loc) {

    if (loc.back != null)

        loc.back.forw = loc.forw;

    else

        head = loc.forw;

  

    if (loc.forw != null)

        loc.forw.back = loc.back;

    // No delete needed — GC handles it

}

```

  

---

  

### Stack (using linked list)

  

Push and pop are both front-insertion and front-deletion — both require `*&` on the top pointer.

  

```cpp

class Node {

public:

    int data;

    Node* next;

    Node(int val) : data(val), next(nullptr) {}

};

  

void push(Node*& top, int val) {

    Node* newNode = new Node(val);

    newNode->next = top;

    top = newNode;         // top moves to new node — needs *&

}

  

int pop(Node*& top) {

    if (top == nullptr) { cout << "Underflow\n"; return -1; }

    int val = top->data;

    Node* temp = top;

    top = top->next;       // top moves forward — needs *&

    delete temp;

    return val;

}

```

  

**C# equivalent:**

  

```csharp

void Push(ref Node top, int val) {

    Node newNode = new Node(val);

    newNode.next = top;

    top = newNode;

}

  

int Pop(ref Node top) {

    if (top == null) { Console.WriteLine("Underflow"); return -1; }

    int val = top.data;

    top = top.next;

    return val;

}

```

  

---

  

### Binary Tree

  

Two pointers per node — `left` and `right`. Recursive traversal follows these pointers naturally.

  

```cpp

class TreeNode {

public:

    int data;

    TreeNode* left;

    TreeNode* right;

    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}

};

  

// Inorder traversal — left, root, right

void inorder(TreeNode* root) {

    if (root == nullptr) return;      // base case — null pointer = empty subtree

    inorder(root->left);              // recurse left

    cout << root->data << " ";        // visit

    inorder(root->right);             // recurse right

}

  

// Insert into BST

void insert(TreeNode*& root, int val) {   // *& needed — root itself may change

    if (root == nullptr) {

        root = new TreeNode(val);          // create node, assign to caller's pointer

        return;

    }

    if (val < root->data)

        insert(root->left, val);           // recurse — root->left may be reassigned

    else

        insert(root->right, val);

}

```

  

Note that `insert` takes `TreeNode*& root`. Each recursive call passes `root->left` or `root->right` by reference — if a subtree is null, the recursion creates a new node and assigns it directly to `root->left` or `root->right` of the parent. Without `*&`, the parent's child pointer would never be updated.

  

**C# equivalent:**

  

```csharp

class TreeNode {

    public int data;

    public TreeNode left;

    public TreeNode right;

    public TreeNode(int val) { data = val; left = null; right = null; }

}

  

void Inorder(TreeNode root) {

    if (root == null) return;

    Inorder(root.left);

    Console.Write(root.data + " ");

    Inorder(root.right);

}

  

void Insert(ref TreeNode root, int val) {

    if (root == null) { root = new TreeNode(val); return; }

    if (val < root.data) Insert(ref root.left, val);

    else Insert(ref root.right, val);

}

```

  

---

  

### Dynamic Array (pointer arithmetic)

  

Pointer arithmetic is what makes array indexing work under the hood.

  

```cpp

int* arr = new int[5] {10, 20, 30, 40, 50};

  

// These are all equivalent:

cout << arr[2];       // 30 — index notation

cout << *(arr + 2);   // 30 — pointer arithmetic

cout << *(2 + arr);   // 30 — addition is commutative

  

// Iterating with a pointer instead of index:

int* ptr = arr;

int* end = arr + 5;

while (ptr != end) {

    cout << *ptr << " ";

    ptr++;

}

  

delete[] arr;

```

  

---

  

### Graph (adjacency list)

  

An adjacency list is an array of pointers, each pointing to a linked list of neighbors.

  

```cpp

class AdjNode {

public:

    int vertex;

    AdjNode* next;

    AdjNode(int v) : vertex(v), next(nullptr) {}

};

  

class Graph {

public:

    int V;

    AdjNode** adjList;   // array of pointers — each element is a Node*

  

    Graph(int v) : V(v) {

        adjList = new AdjNode*[V];   // allocate array of V pointers

        for (int i = 0; i < V; i++)

            adjList[i] = nullptr;    // initialize all to null

    }

  

    void addEdge(int u, int v) {

        // insert v into u's adjacency list

        AdjNode* newNode = new AdjNode(v);

        newNode->next = adjList[u];

        adjList[u] = newNode;

    }

};

```

  

`AdjNode**` is a pointer to a pointer — the outer `*` is the array of pointers, the inner `*` is each adjacency list head.

  

**C# equivalent:**

  

```csharp

class AdjNode {

    public int vertex;

    public AdjNode next;

    public AdjNode(int v) { vertex = v; next = null; }

}

  

class Graph {

    int V;

    AdjNode[] adjList;   // array of references — no ** needed

  

    public Graph(int v) {

        V = v;

        adjList = new AdjNode[V];   // all initialized to null automatically

    }

  

    public void AddEdge(int u, int v) {

        AdjNode newNode = new AdjNode(v);

        newNode.next = adjList[u];

        adjList[u] = newNode;

    }

}

```

  

---

  

## Pointer Notations — Complete Reference

  

| Notation | Context | Meaning |

|---|---|---|

| `int* p` | Declaration | `p` is a pointer to `int` |

| `&x` | Expression | Address of variable `x` |

| `*p` | Expression | Value at the address stored in `p` |

| `p->field` | Expression | `(*p).field` — dereference and access field |

| `int*& p` | Parameter | Reference to a pointer — function can change `p` itself |

| `int** p` | Declaration | Pointer to a pointer to `int` |

| `**p` | Expression | Dereference twice — value through two levels of indirection |

| `new T` | Expression | Allocate one `T` on heap, return `T*` |

| `new T[n]` | Expression | Allocate array of `n` `T`s, return `T*` |

| `delete p` | Statement | Free memory allocated by `new T` |

| `delete[] p` | Statement | Free memory allocated by `new T[n]` |

| `nullptr` | Literal | Null pointer — points to nothing |

| `const int* p` | Declaration | Pointer to const — value cannot be changed through `p` |

| `int* const p` | Declaration | Const pointer — `p` cannot be reassigned |

  

| C++ | C# Equivalent | Notes |

|---|---|---|

| `T* p` | `T p` (class type) | C# class variables are references implicitly |

| `*p` | `p.field` | No explicit dereference needed in C# |

| `T*& p` parameter | `ref T p` parameter | Both allow modifying the caller's pointer/reference |

| `new T()` | `new T()` | Identical syntax, different memory model |

| `delete p` | (none) | GC handles deallocation in C# |

| `nullptr` | `null` | Same concept, different keyword |

| `unsafe int* p` | `unsafe int* p` | Raw pointers available in unsafe blocks |

  

---

  

## Complexity Analysis

  

Pointer operations themselves are all $O(1)$:

  

| Operation | Time | Notes |

|---|---|---|

| Dereference `*p` | $O(1)$ | Single memory read |

| Assignment `p = &x` | $O(1)$ | Copy an address |

| Pointer arithmetic `p + k` | $O(1)$ | Integer addition |

| `new T` | $O(1)$ amortized | Heap allocation |

| `delete p` | $O(1)$ amortized | Heap deallocation |

  

The cost of data structure operations comes from how many pointer dereferences are chained, not from the dereferences themselves.

  

---

  

## Common Misconceptions

  

> [!warning] "`int* a, b` declares two pointers"

> It declares one pointer `a` and one plain int `b`. The `*` binds to the variable name, not the type. To declare two pointers: `int* a, *b`.

  

> [!warning] "`*p++` increments the value pointed to by `p`"

> `*p++` increments the pointer `p` (moving it to the next element) and returns the old value. To increment the value, write `(*p)++`. The postfix `++` has higher precedence than `*`.

  

> [!warning] "Passing a pointer to a function lets the function modify the original pointer"

> Passing `Node* head` gives the function a copy of the pointer. The function can modify what `head` points to, but cannot change which node `head` itself points to. To modify the pointer, use `Node*& head` (C++) or `ref Node head` (C#).

  

> [!warning] "A null pointer and an uninitialized pointer are the same"

> A null pointer (`nullptr`) explicitly points to nothing — you can safely check for it. An uninitialized pointer holds whatever garbage value was in memory. Dereferencing either crashes, but an uninitialized pointer is more dangerous because it may *appear* valid.

  

> [!warning] "C# has no pointers"

> C# class variables are managed references — conceptually identical to pointers. C# also supports raw pointers in `unsafe` blocks. The difference is that C# references are tracked by the garbage collector, while C++ pointers are not.

  

> [!warning] "`delete` sets the pointer to nullptr"

> `delete` frees the memory but does not modify the pointer variable. After `delete p`, `p` still holds the old address — now pointing to freed memory (a **dangling pointer**). Always set `p = nullptr` after deleting.

  

---

  

## Practice Problems

  

1. Write a function `swap(int* a, int* b)` in C++ that swaps two integers using pointers. Explain why `int*` is needed rather than `int` — Classic — Easy

2. Write `insertFront` for a singly linked list in both C++ (using `Node*&`) and C# (using `ref Node`). Explain what happens if you remove the `&` / `ref` — Classic — Easy

3. Implement `insert` for a BST in C++ using `TreeNode*& root`. Trace a call inserting value 15 into the tree `[10, 20]` and show exactly which pointer gets assigned — Classic — Medium

4. Implement a dynamic 2D array using `int**` in C++. Allocate, fill, print, and deallocate it correctly — Classic — Medium

5. Write a graph adjacency list using `AdjNode**` in C++. Add edges (0,1), (0,2), (1,2) and traverse all neighbors of vertex 0 — Classic — Medium

  

---

  

## Cheat Sheet

  

**Declare a pointer:**

```cpp

int* p;           // C++

// (use class reference in C#)

```

  

**Get address / assign pointer:**

```cpp

p = &x;           // C++

// In C#: reference assigned automatically for class types

```

  

**Read/write through pointer:**

```cpp

int val = *p;     // read   (C++)

*p = 42;          // write  (C++)

node->data;       // field  (C++) — same as (*node).data

node.data;        // field  (C#)

```

  

**Modify the pointer itself inside a function:**

```cpp

void f(int*& p)   // C++ — reference to pointer

void F(ref Node p) // C# — ref parameter

```

  

**Dynamic allocation:**

```cpp

T* p = new T(args);    // single — C++

T* arr = new T[n];     // array  — C++

delete p;              // free single

delete[] arr;          // free array

new T(args)            // C# — GC handles deallocation

```

  

**Null pointer:**

```cpp

p = nullptr;      // C++

p = null;         // C#

if (p == nullptr) // check before dereferencing — always

```

  

**Pointer arithmetic:**

```cpp

*(p + k)  ==  p[k]   // equivalent

p++               // advance one element

```

  

**Key rule:** Every `new` needs a `delete`. Every pointer should be checked for `nullptr` before dereferencing.