# Types of Data Structures — Linear and Nonlinear

> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

A **data structure** is a way of organizing data in memory so that it can be used efficiently. The choice of data structure is one of the most consequential decisions in program design — it determines what operations are cheap, what operations are expensive, and what kinds of problems can be solved at all.

Data structures divide into two fundamental categories based on the **relationship** between their elements: **linear** and **nonlinear**.

---

## The Core Distinction

The classification is about how elements relate to each other — not about how they are stored in physical memory.

In a **linear** structure, every element has at most one predecessor and at most one successor. The elements form a single, unbroken sequence. You can always define a "first" and "last" element, and a clear ordering between every pair of adjacent elements.

In a **nonlinear** structure, elements can have **multiple predecessors or multiple successors** — or both. The relationships form a branching, networked, or hierarchical shape that cannot be flattened into a single sequence without losing information.

> [!note] Linear vs nonlinear is a logical distinction, not physical
> A binary heap is stored as a contiguous array in memory, but its logical structure is a tree — nonlinear. The classification is about the *logical relationship* between elements, not their physical layout in memory.

---

## Linear Data Structures

### What Makes a Structure Linear?

A structure is linear if its elements can be arranged such that each element (except the first and last) has exactly one predecessor and one successor. The elements form a **chain**.

Real-world analogy: a train. Each car is connected to exactly one car in front and one behind. There are no branches. The first car has no predecessor; the last has no successor.

---

### Array

A list of a finite $n$ number of **similar** data items stored in **contiguous memory**. The simplest of all data structures.

```
Index:   0    1    2    3    4
       [ 12 | 45 | 7  | 89 | 3 ]
         ^                   ^
       base              base + 4×size
```

Address of element $K$:

$$\text{LOC}(A[K]) = \text{Base}(A) + w(K - LB)$$

Where $w$ is the word size (bytes per element) and $LB$ is the lower bound. This formula makes access $O(1)$ regardless of position — the CPU computes the address arithmetically in a single instruction.

**Three notations for subscripted variables:**
- Subscript: $A_k$
- Parenthesis: $A(k)$
- Bracket: $A[k]$ *(mostly used)*

**Limitations:**
- Fixed size — must be declared at creation
- Insertion and deletion are expensive — shifting required

**Strengths:** Instant $O(1)$ access by index, cache-friendly (contiguous memory), simple.

---

### Linked List

A linear collection of data elements, called **nodes**, where each node contains:

- A value/data element
- A link/pointer to the address of the next node

```
START
  |
  v
[Data | •]——>[Data | •]——>[Data | •]——>[Data | NULL]
```

`START` holds the address of the first node. The last node's link is `NULL`.

Unlike arrays, nodes can be scattered anywhere in memory. Order is maintained through the pointer chain, not memory position. Size is dynamic — no shifting on insert or delete.

**Strengths:** Dynamic size, $O(1)$ insertion/deletion at known position.
**Weaknesses:** No random access ($O(n)$ to reach element $i$), extra memory for pointers, poor cache locality.

---

### Stack

A linear list in which insertions and deletions can take place **only at one end**, called the **top**. Also called **Last-In-First-Out (LIFO)**.

```
     TOP
      |
      v
    [ C ]   ← most recently pushed
    [ B ]
    [ A ]   ← first pushed, buried at bottom
```

- **Push** — insert at the top: $O(1)$
- **Pop** — delete from the top: $O(1)$
- **Peek** — read top without removing: $O(1)$

Real-world analogy: a stack of plates. You always take from the top; new plates go on top.

Use cases: function call stack, undo history, expression evaluation (infix → postfix), backtracking.

---

### Queue

A linear list in which insertions take place **only at one end** (the **rear**) and deletions take place **only at the other end** (the **front**). Also called **First-In-First-Out (FIFO)**.

```
FRONT                           REAR
  |                               |
[ A ]——>[ B ]——>[ C ]——>[ D ]
  ↑ dequeue                enqueue ↑
```

- **Enqueue** — insert at rear: $O(1)$
- **Dequeue** — remove from front: $O(1)$

Real-world analogy: a line at a ticket counter. First person in is first served.

Use cases: scheduling, BFS traversal, buffering, print queues.

---

### Comparison of Linear Structures

| Structure | Access | Insert (front) | Insert (middle) | Insert (end) | Delete | Size |
|---|---|---|---|---|---|---|
| Array | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)$* | $O(n)$ | Fixed |
| Linked List | $O(n)$ | $O(1)$ | $O(1)$** | $O(n)$ | $O(1)$** | Dynamic |
| Stack | $O(1)$ top only | — | — | $O(1)$ push | $O(1)$ pop | Dynamic |
| Queue | $O(1)$ front/rear | — | — | $O(1)$ enqueue | $O(1)$ dequeue | Dynamic |

\*Amortized $O(1)$ for dynamic arrays.
\*\*Given a pointer to the position.

---

## Nonlinear Data Structures

### What Makes a Structure Nonlinear?

A structure is nonlinear if its elements have relationships that cannot be represented as a single sequence. An element may have multiple successors (a node with two children in a tree), multiple predecessors (a node with two parents in a graph), or relationships that cycle back on themselves.

Real-world analogy: a road network. A city connects to multiple other cities. You cannot arrange all cities in a line and preserve all road connections.

---

### Tree

A **nonlinear hierarchical** structure used to represent and organize data for easier access. Made up of **nodes** connected by **edges**, with no cycles. There is exactly one designated **root** node, and every other node has exactly one parent.

```
            [A]           ← root
           /   \
         [B]   [C]        ← internal nodes
        / \      \
      [D] [E]   [F]       ← leaf nodes
```

Key terminology:
- **Root:** The single top-level node with no parent
- **Parent / Child:** Nodes connected by an edge; the upper one is the parent
- **Leaf:** A node with no children
- **Internal node:** A non-leaf node (has at least one child)
- **Height:** Length of the longest path from root to any leaf
- **Depth of a node:** Length of the path from root to that node

A tree with $n$ nodes has exactly $n - 1$ edges.

**Subtypes:**
- **Binary Tree:** Each node has at most 2 children
- **Binary Search Tree (BST):** Binary tree where left child < parent < right child
- **AVL / Red-Black Tree:** Self-balancing BSTs — guarantee $O(\log n)$ for all operations
- **Heap:** Complete binary tree satisfying the heap property (see below)
- **Trie:** Tree where each edge represents a character, used for string search

Use cases: file systems, expression parsing, database indexing (B-trees), decision trees, XML/HTML DOM.

---

### Heap

A **heap** is a **complete binary tree** satisfying the **heap property**:

- **Max-heap:** Every parent is greater than or equal to its children. The root holds the maximum element.
- **Min-heap:** Every parent is less than or equal to its children. The root holds the minimum element.

```
Max-heap:
        [90]
       /    \
     [70]  [80]
    /   \
  [40] [50]
```

Heaps are almost always stored as **arrays** using the index relationship:

$$\text{parent}(i) = \left\lfloor \frac{i-1}{2} \right\rfloor, \quad \text{left}(i) = 2i+1, \quad \text{right}(i) = 2i+2$$

This means the heap `[90, 70, 80, 40, 50]` implicitly encodes the tree above — no pointers needed. The array representation is both space-efficient and cache-friendly.

**Key operations:**
- Insert: $O(\log n)$ — insert at end, then bubble up to restore heap property
- Extract-max/min: $O(\log n)$ — remove root, replace with last element, bubble down
- Peek max/min: $O(1)$ — just read index 0

> [!note] A heap is not a sorted array
> A heap only guarantees the root is the largest (max-heap) or smallest (min-heap). Other elements are partially ordered — not fully sorted. Heap sort uses repeated extractions to produce a fully sorted array in $O(n \log n)$.

Use cases: priority queues, heap sort, Dijkstra's shortest path algorithm, scheduling.

---

### Hash Table

A hash table maps **keys to values** using a **hash function** that computes an index into an underlying array.

```
hash("alice") → 3
hash("bob")   → 7
hash("carol") → 1

Array: [ _ | "carol" | _ | "alice" | _ | _ | _ | "bob" | _ ]
         0      1      2      3     4   5   6      7     8
```

The hash function $h(k)$ converts key $k$ to an index in $[0, n)$. A good hash function distributes keys uniformly to avoid clustering.

**Collision:** Two keys map to the same index. Two main strategies to resolve:
- **Chaining:** Each index holds a linked list of entries with that hash. Lookup follows the chain.
- **Open addressing:** Probe adjacent slots (linearly, quadratically, or with a second hash) until an empty slot is found.

**Time complexity:**
- Average case: $O(1)$ insert, search, delete
- Worst case (all keys collide): $O(n)$

The average case relies on a good hash function and a low **load factor** (ratio of entries to table size). When the load factor grows too large, the table is typically resized and rehashed.

Use cases: dictionaries, sets, database indexing, caching, symbol tables in compilers.

---

### Graph

A **nonlinear** structure consisting of a set of **vertices** (nodes) and a set of **edges** (connections), with no restrictions on structure. The most general nonlinear data structure — trees are a special case of graphs.

```
    [A]———[B]
   / |      \
 [E] |      [C]
      \    /
       [D]
```

Unlike a tree, a graph may have:
- **Cycles** — paths that loop back to the starting node
- **Disconnected components** — nodes with no path between them
- **Directed edges** — edges with a specified direction (A → B ≠ B → A)
- **Multiple edges** between the same pair of nodes

**Key types:**
- **Undirected graph:** Edges have no direction. $(u, v) = (v, u)$.
- **Directed graph (digraph):** Edges have direction. $(u, v) \neq (v, u)$.
- **Weighted graph:** Each edge carries a numeric weight (distance, cost, time).
- **DAG (Directed Acyclic Graph):** Directed, no cycles. Used in dependency resolution and topological sorting.

**Representations:**
- **Adjacency matrix:** 2D array of size $n \times n$. $O(n^2)$ space. Edge lookup: $O(1)$. Good for dense graphs.
- **Adjacency list:** Array of lists, one per vertex. $O(n + e)$ space for $e$ edges. Good for sparse graphs.

Use cases: social networks, maps/routing (GPS), dependency graphs, web crawling, network topology.

---

## Common Complexity Classes Across Structures

Listed from most to least efficient growth:

| Class | Name | Doubling $n$ multiplies cost by... | Example |
|---|---|---|---|
| $O(1)$ | Constant | 1× (unchanged) | Array index access, hash lookup |
| $O(\log n)$ | Logarithmic | ~1× (tiny increase) | Binary search, BST/heap operations |
| $O(n)$ | Linear | 2× | Traversal, linear search |
| $O(n \log n)$ | Linearithmic | ~2× (slightly more) | Merge sort, heap sort |
| $O(n^2)$ | Quadratic | 4× | Bubble sort, adjacency matrix traversal |
| $O(n^3)$ | Cubic | 8× | Naive matrix multiplication |
| $O(2^n)$ | Exponential | squares the cost | Brute-force subset enumeration |
| $O(n!)$ | Factorial | catastrophic | Brute-force permutations |

> [!note] The practical cliff
> Algorithms up to $O(n \log n)$ are generally usable at large scale. $O(n^2)$ becomes painful around $n = 10^5$. $O(2^n)$ is only feasible for $n \leq 20$ or so. Knowing this cliff lets you recognize when a brute-force solution will not survive the input constraints.

---

## Linear vs Nonlinear — Full Comparison

| Property | Linear | Nonlinear |
|---|---|---|
| Element relationships | One predecessor, one successor | Multiple predecessors or successors |
| Single-pass traversal covers all? | Yes | Not necessarily — multiple paths exist |
| Memory traversal | Sequential | Multiple paths possible |
| Complexity of operations | Generally simpler | Often more complex |
| Examples | Array, Linked List, Stack, Queue | Tree, Graph, Heap, Hash Table |
| Use case | Sequential data | Hierarchical or networked data |

---

## Choosing a Data Structure

The right structure depends on the operations you need most:

| Primary need | Best structure |
|---|---|
| Fast access by position | Array |
| Frequent insert/delete at arbitrary positions | Linked List |
| LIFO access | Stack |
| FIFO access | Queue |
| Hierarchical data (file systems, XML) | Tree |
| Relationship/network data | Graph |
| Fast min/max retrieval | Heap |
| Fast key-value lookup | Hash Table |

---

## Space-Time Tradeoffs

Complexity does not exist in isolation — time and space often trade against each other. A common pattern: use extra memory to avoid redundant computation.

**Without memoization — Fibonacci:**
$$T(n) = O(2^n), \quad S(n) = O(n)$$

**With memoization — Fibonacci:**
$$T(n) = O(n), \quad S(n) = O(n)$$

By storing previously computed values (spending space), we eliminate redundant recursive calls (saving time). This is the core idea behind dynamic programming.

> [!note] There is no universally better choice
> In memory-constrained environments (embedded systems, mobile), an $O(n^2)$ in-place algorithm may be preferable to an $O(n \log n)$ algorithm requiring $O(n)$ auxiliary space. Always evaluate both time and space relative to your actual constraints.

---

## Common Misconceptions

> [!warning] "Linear means elements are stored linearly in memory"
> Linear refers to the logical relationship between elements, not physical memory layout. A linked list is logically linear but its nodes are scattered across memory. An array-backed heap is physically contiguous but logically a tree — nonlinear.

> [!warning] "Trees are just a special case of graphs"
> Mathematically yes — a tree is a connected, acyclic, undirected graph. But in data structures, trees come with additional constraints (single root, strict parent-child hierarchy) that make them a distinct category with different algorithms and use cases.

> [!warning] "Nonlinear means harder to implement"
> A binary heap has a beautifully simple array representation with no pointers at all. A hash table gives $O(1)$ average operations with a straightforward implementation. Nonlinear does not imply complicated.

> [!warning] "You should always pick the most efficient structure"
> The most efficient structure for one operation may be terrible for another. A sorted array gives $O(\log n)$ search but $O(n)$ insertion. A linked list gives $O(1)$ insertion but $O(n)$ search. Always choose based on the full set of operations and their relative frequencies.

> [!warning] "A heap is a sorted structure"
> A heap only guarantees the root is the min or max. The remaining elements are partially ordered — not fully sorted. To get a sorted sequence from a heap, you must repeatedly extract the root, which takes $O(n \log n)$ total.

> [!warning] "Hash tables always give $O(1)$ performance"
> $O(1)$ is the *average* case, assuming a good hash function and a low load factor. Worst case — when all keys collide into the same slot — degrades to $O(n)$. A bad hash function or an overfull table causes significant real-world degradation.

---

## Practice Problems

1. Given a list of operations (insert at front, search, delete from back), recommend a data structure and justify — Classic — Easy
2. Explain why a call stack uses LIFO behavior, not FIFO — Classic — Easy
3. Draw the adjacency matrix and adjacency list for a graph with 5 vertices and 6 edges — Classic — Medium
4. Show that a tree with $n$ nodes has exactly $n - 1$ edges — Classic — Medium
5. Given a scheduling problem where tasks have priorities and must be processed in priority order, choose and justify a data structure — Classic — Medium

---

## Cheat Sheet

**Linear — one chain:**
- Array: $O(1)$ access, $O(n)$ insert/delete (middle), fixed size
- Linked List: $O(n)$ access, $O(1)$ insert/delete (at pointer), dynamic
- Stack: LIFO — push/pop $O(1)$
- Queue: FIFO — enqueue/dequeue $O(1)$

**Nonlinear — branching/networked:**
- Tree: hierarchy, $n$ nodes → $n-1$ edges, no cycles, single root
- Heap: complete binary tree + ordering property; root = max or min; stored as array
- Hash Table: $O(1)$ average lookup by key; collisions handled by chaining or open addressing
- Graph: arbitrary connections, may cycle, directed or undirected

**Heap index formulas (0-indexed array):**
$$\text{parent}(i) = \lfloor(i-1)/2\rfloor, \quad \text{left}(i) = 2i+1, \quad \text{right}(i) = 2i+2$$

**Doubling rule of thumb:**

| Class | Double $n$ → cost... |
|---|---|
| $O(1)$ | Unchanged |
| $O(\log n)$ | +1 step |
| $O(n)$ | ×2 |
| $O(n \log n)$ | ~×2 |
| $O(n^2)$ | ×4 |
| $O(2^n)$ | Squared |

**Classification test:** Can you number all elements $1, 2, \ldots, n$ such that each consecutive pair is adjacent in the structure? If yes → linear. If no → nonlinear.
