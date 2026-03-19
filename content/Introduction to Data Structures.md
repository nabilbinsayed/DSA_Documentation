
**Data management** is the discipline of organizing, storing, and manipulating data in a way that makes it accessible and usable by programs. Before studying specific data structures, it helps to understand _why_ we organize data at all — and what properties of data drive the choice of how to organize it.

---

## What is Data Management?

A computer program, at its most basic, takes data as input, processes it, and produces output. The way data is arranged in memory — its **structure** — directly determines how efficiently it can be stored, retrieved, and modified.

Data management is the set of decisions and techniques that govern:

- How data is represented in memory
- How it is grouped or related to other data
- What operations can be performed on it, and at what cost

Poor data organization forces programs to do unnecessary work. A phone book stored as a random pile of entries forces you to read every entry to find one name. The same data stored alphabetically lets you open to the right section immediately. The data is identical — the structure changes everything.

> [!note] Structure determines cost Every data structure is a tradeoff. It makes certain operations fast and others slow. Choosing the right structure for a problem is often more impactful than any other optimization.

---

## What is Data?

**Data** is any raw fact or value that can be recorded and processed. In computing, data takes many forms — numbers, characters, logical values, addresses — and understanding these forms is the starting point for understanding how to organize them.

---

## Data Types

A **data type** defines:

1. The set of values a piece of data can take
2. The set of operations that can be performed on it
3. How it is represented in memory

Data types are divided into two broad categories: **primitive** and **non-primitive**.

---

### Primitive Data Types

Primitive data types are the basic building blocks provided directly by the hardware or the language runtime. They represent single, indivisible values.

|Type|Description|Example Values|
|---|---|---|
|Integer|Whole numbers, positive or negative|$-3, 0, 42$|
|Float / Real|Numbers with fractional parts|$3.14, -0.001$|
|Character|A single symbol from a character set|`'A'`, `'z'`, `'3'`|
|Boolean|Logical true or false|`true`, `false`|
|Pointer|A memory address pointing to another value|`0x7ffd3a`|

Primitive types are stored in a fixed amount of memory (typically 1–8 bytes) and are manipulated directly by CPU instructions. They have no internal structure — an integer is just an integer.

> [!note] Pointer as a primitive The pointer type is sometimes overlooked, but it is fundamental. Almost every non-primitive data structure is built on top of pointers — they are the mechanism by which structures refer to each other in memory.

---

### Non-Primitive Data Types

Non-primitive data types are constructed from primitive types (and other non-primitive types). They group multiple values together into a single named entity.

They are further divided into:

**Linear non-primitive types** — elements arranged in sequence:

- Arrays
- Linked Lists
- Stacks
- Queues

**Non-linear non-primitive types** — elements with hierarchical or network relationships:

- Trees
- Graphs

**User-defined types** — defined by the programmer:

- Structures / Records (grouping named fields of different types)
- Classes (structures with associated behavior)
- Enumerations (a named set of integer constants)

The key distinction between primitive and non-primitive types is **composability**: non-primitive types are made of other types, and they expose structure that can be navigated or manipulated.

---

## Types of Data Structures

A **data structure** is a concrete implementation of a way to organize and store data in memory. It defines not just how data is laid out, but also the operations that work on that layout.

Data structures divide into two fundamental categories: **linear** and **nonlinear**.

---

### Linear Data Structures

In a linear data structure, elements are arranged in a **sequential order** — each element has exactly one predecessor and one successor (except the first and last).

Think of it as a line. Every person in the line has one person in front and one behind. There are no branches, no loops, no shortcuts.

|Structure|Access Pattern|Key Property|
|---|---|---|
|Array|Random (by index)|Fixed size, contiguous memory|
|Linked List|Sequential|Dynamic size, scattered memory|
|Stack|LIFO (Last In, First Out)|Restricted access — top only|
|Queue|FIFO (First In, First Out)|Restricted access — front and rear|

Linear structures are simpler to implement and reason about. They are the foundation everything else is built on.

---

### Nonlinear Data Structures

In a nonlinear data structure, elements can have **multiple predecessors or successors**. The relationship between elements is hierarchical or arbitrary, not sequential.

There is no single "next" element — an element may connect to many others, or be connected to by many others.

|Structure|Relationship|Key Property|
|---|---|---|
|Tree|Hierarchical (parent → children)|Acyclic, single root|
|Graph|Arbitrary (any node → any node)|May have cycles, no required root|
|Heap|Hierarchical + ordering property|Efficient min/max retrieval|
|Hash Table|Key → value mapping|Near-constant access time|

Nonlinear structures are more expressive — they can represent relationships that linear structures cannot. A family tree, a road network, a dependency graph — these are all inherently nonlinear.

> [!note] Linear vs nonlinear is about relationships, not memory A tree stored as an array (as in a binary heap) is still a nonlinear structure. The classification is about the logical relationship between elements, not their physical arrangement in memory.

---

### Choosing Between Them

|If you need...|Consider...|
|---|---|
|Sequential access in order|Array or Linked List|
|Last-in-first-out behavior|Stack|
|First-in-first-out behavior|Queue|
|Hierarchical data (file systems, XML)|Tree|
|Network or relationship data|Graph|
|Fast lookup by key|Hash Table|

---

## Operations on Data Structures

Every data structure supports a set of **operations** — actions that read or modify the data. Regardless of the specific structure, most operations fall into these categories:

### 1. Traversal

Visiting each element of the structure exactly once. Used for printing, searching, or processing all data.

- Array: iterate from index $0$ to $n-1$
- Linked list: follow LINK pointers from START to NULL
- Tree: depth-first or breadth-first traversal

### 2. Search

Finding whether a specific value exists, and if so, where.

- **Linear search:** check every element — $O(n)$
- **Binary search (sorted array):** halve the search space — $O(\log n)$
- **Hash table lookup:** compute position directly — $O(1)$ average

### 3. Insertion

Adding a new element to the structure.

- Array: $O(1)$ at end, $O(n)$ in middle (shifting required)
- Linked list: $O(1)$ at front or given position, $O(n)$ to find position
- Balanced tree: $O(\log n)$

### 4. Deletion

Removing an existing element.

- Array: $O(n)$ (shifting required after removal)
- Linked list: $O(1)$ if position known, $O(n)$ to find it
- Balanced tree: $O(\log n)$

### 5. Sorting

Rearranging elements into a defined order (ascending, descending, lexicographic).

- Bubble sort: $O(n^2)$
- Merge sort: $O(n \log n)$
- Quick sort: $O(n \log n)$ average, $O(n^2)$ worst

### 6. Merging

Combining two data structures (typically two sorted arrays or lists) into one, preserving order.

- Two sorted arrays of size $m$ and $n$: $O(m + n)$

> [!note] Operation cost depends on structure Insertion into an array is $O(n)$ because elements must be shifted. Insertion into a linked list at a known position is $O(1)$ because only pointers are updated. The data is the same — the structure determines the cost. This is the central lesson of data structures.

---

## Common Misconceptions

> [!warning] "Non-primitive means complex" Non-primitive types are not necessarily complicated. A simple array of integers is non-primitive. The distinction is purely about whether the type is atomic (primitive) or composed of other types (non-primitive).

> [!warning] "Linear structures are simpler and therefore worse" Linear structures are simpler, but simplicity is a virtue when the problem is simple. An array is often the best choice for small, fixed-size datasets. Complexity should match the problem — not exceed it.

> [!warning] "Data structure and algorithm are the same thing" A data structure is an organization of data. An algorithm is a procedure for solving a problem. They are deeply related — the choice of data structure constrains and enables the choice of algorithm — but they are distinct concepts. Merge sort is an algorithm. The array it sorts is a data structure.

> [!warning] "Nonlinear means random or unordered" Nonlinear refers to the _relationship structure_ between elements, not their ordering. A binary search tree is nonlinear and highly ordered. A graph can be weighted, directed, and structured. Nonlinear does not mean chaotic.

---

## Practice Problems

1. Identify Data Types — Classic — Easy
2. Classify a structure given its operations — Classic — Easy
3. Given a problem description, choose the appropriate data structure and justify — Classic — Medium
4. List all operations performed in a simple student record management program and classify each — Classic — Medium
5. Compare the cost of insertion and deletion across arrays, linked lists, and binary search trees — Classic — Medium