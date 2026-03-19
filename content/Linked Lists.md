# Linked Lists

> *CSE-241 | Animesh Chandra Roy & Md. Atiqul Islam Rizvi, CUET*

A **linked list** (also called a **one-way list**) is a linear collection of data elements, called **nodes**. Each node is divided into two parts:

1. The **value/data element** of the node
2. The **link/pointer** to the address of the next node

`START` is a special pointer variable that holds the address of the first node. The link of the last node is set to `NULL` to denote the end of the list.

```
START
  |
  v
[Data | •]——>[Data | •]——>[Data | •]——>[Data | NULL]
```

Unlike arrays, linked lists do not require contiguous memory. Order is maintained through the pointer chain. Size is dynamic — no shifting required on insertion or deletion.

**Real-world analogy:** A scavenger hunt. Each clue tells you where the next clue is hidden. You do not know all locations upfront — you discover each one by following the previous.

---

## Representation of Linked Lists

### Theoretical Representation (Lipschutz)

A linked list `LIST` is maintained in memory by **two linear arrays** and **one variable**:

- `INFO[K]` — contains the actual data element of node $K$
- `LINK[K]` — contains the link/pointer to the next node (0 or NULL = end of list)
- `START` — holds the address of the first node. If `START = NULL`, the list is empty.

**Example:** List containing A → B → C → D

```
Index:   1    2    3    4    5    6
INFO:  [ A  | D  | C  | _  | B  | _ ]
LINK:  [ 5  | 0  | 2  | 7  | 3  | 4 ]

START = 1,  AVAIL = 4
```

Tracing: START=1 → INFO[1]=A, LINK[1]=5 → INFO[5]=B, LINK[5]=3 → INFO[3]=C, LINK[3]=2 → INFO[2]=D, LINK[2]=0 (NULL) ✓

The physical order in memory (1,2,3,4,5,6) is irrelevant. The LINK array defines the logical order.

### C++ Representation

In C++, each node is a class holding the data and a pointer to the next node. This is the direct realization of the theoretical model — `next` is the LINK field, and the `head` pointer is START.

```cpp
class Node {
public:
    int data;
    Node* next;

    Node(int val) : data(val), next(nullptr) {}
};
```

A linked list is then just a `head` pointer:

```cpp
Node* head = nullptr;  // empty list
```

---

## Memory Allocation

Together with the linked list, a special list called the **AVAIL list** (free-storage list) is maintained. It holds the addresses of unused/available nodes and is implemented the same way as a linked list.

- **Overflow** — when a new node must be inserted but `AVAIL = NULL` (no free memory)
- **Underflow** — when one tries to delete from an empty list

When a node is deleted from a list, it is **returned to the AVAIL list** rather than discarded. The OS may periodically collect all deleted space into the free-storage list — this is called **garbage collection**, done in two steps:

1. Tag memory cells as active based on current use
2. Collect all untagged (inactive) space into the free-storage list

In C++, memory is managed explicitly with `new` and `delete`. There is no automatic AVAIL list — you allocate with `new Node(val)` and free with `delete node`.

---

## Traversal

**Pseudocode:**
```
Algorithm: TRAVERSE(INFO, LINK, START)

1. Set PTR := START
2. Repeat steps 3 and 4 while PTR ≠ NULL:
3.    Visit INFO[PTR]
4.    Set PTR := LINK[PTR]
   [End of loop]
5. Exit
```

**C++:**
```cpp
void traverse(Node* head) {
    Node* ptr = head;
    while (ptr != nullptr) {
        cout << ptr->data << " ";
        ptr = ptr->next;
    }
    cout << endl;
}
```

Time: $O(n)$. Space: $O(1)$.

---

## Search

### Unsorted Linked List

**Pseudocode:**
```
Algorithm: SEARCH(INFO, LINK, START, ITEM)

1. Set PTR := START
2. Repeat step 3 while PTR ≠ NULL:
3.    If INFO[PTR] = ITEM, then: Set LOC := PTR and Exit
      Else: Set PTR := LINK[PTR]
   [End of loop]
4. Set LOC := NULL and Exit
```

**C++:**
```cpp
// Returns pointer to the node containing item, or nullptr if not found
Node* search(Node* head, int item) {
    Node* ptr = head;
    while (ptr != nullptr) {
        if (ptr->data == item)
            return ptr;
        ptr = ptr->next;
    }
    return nullptr;
}
```

### Sorted Linked List

For a sorted list, we can exit early once we pass where ITEM would be:

**Pseudocode:**
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

**C++:**
```cpp
Node* searchSorted(Node* head, int item) {
    Node* ptr = head;
    while (ptr != nullptr) {
        if (ptr->data == item)
            return ptr;
        else if (ptr->data < item)
            ptr = ptr->next;
        else
            return nullptr;  // passed where item would be
    }
    return nullptr;
}
```

Time: $O(n)$ worst case, but exits early in average case for sorted lists.

---

## Insertion

### At the Beginning

**Pseudocode:**
```
Algorithm: INSFIRST(INFO, LINK, START, AVAIL, ITEM)

1. If AVAIL = NULL, then: Write OVERFLOW and Exit
2. Set NEW := AVAIL and AVAIL := LINK[AVAIL]
3. Set INFO[NEW] := ITEM
4. Set LINK[NEW] := START and START := NEW
5. Exit
```

```
Before: START——>[A | •]——>[B | NULL]
After:  START——>[X | •]——>[A | •]——>[B | NULL]
```

**C++:**
```cpp
void insertFront(Node*& head, int item) {
    Node* newNode = new Node(item);
    newNode->next = head;
    head = newNode;
}
```

Time: $O(1)$.

### At a Given Location

If `loc = nullptr`, insert at the beginning. Otherwise, insert after the node pointed to by `loc`.

**Pseudocode:**
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

**C++:**
```cpp
void insertAfter(Node*& head, Node* loc, int item) {
    Node* newNode = new Node(item);
    if (loc == nullptr) {
        newNode->next = head;
        head = newNode;
    } else {
        newNode->next = loc->next;  // LINK[NEW] := LINK[LOC] — must come first
        loc->next = newNode;        // LINK[LOC] := NEW
    }
}
```

> [!note] Pointer update order is critical
> `newNode->next = loc->next` must come **before** `loc->next = newNode`. Reversing these two lines loses the reference to the rest of the list — `loc->next` would point to `newNode` before `newNode->next` was set, cutting off everything after `loc`.

### At the End

**Pseudocode:**
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

**C++:**
```cpp
void insertEnd(Node*& head, int item) {
    Node* newNode = new Node(item);
    if (head == nullptr) {
        head = newNode;
        return;
    }
    Node* loc = head;
    while (loc->next != nullptr)
        loc = loc->next;
    loc->next = newNode;
}
```

Time: $O(n)$ — must walk to the end. $O(1)$ if a `tail` pointer is maintained separately.

### Into a Sorted List

ITEM must be inserted so that `INFO[A] < ITEM ≤ INFO[B]`. Find position A using FINDA, then call INSLOC.

**Pseudocode:**
```
Algorithm: INSERT(INFO, LINK, START, AVAIL, ITEM)
1. Call FINDA(INFO, LINK, START, ITEM) to get LOC
2. Call INSLOC(INFO, LINK, START, AVAIL, LOC, ITEM)
3. Exit

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

**C++:**
```cpp
// Returns the node after which ITEM should be inserted,
// or nullptr if ITEM belongs at the front
Node* findA(Node* head, int item) {
    if (head == nullptr || item < head->data)
        return nullptr;
    Node* k = head;
    Node* ptr = head->next;
    while (ptr != nullptr) {
        if (item <= ptr->data)
            return k;
        k = ptr;
        ptr = ptr->next;
    }
    return k;
}

void insertSorted(Node*& head, int item) {
    Node* loc = findA(head, item);
    insertAfter(head, loc, item);
}
```

---

## Deletion

### At Location LOC (Known Position)

`LOCP` is the predecessor of LOC. If `LOCP = NULL`, LOC is the first node.

**Pseudocode:**
```
Algorithm: DEL(INFO, LINK, START, AVAIL, LOC, LOCP)

1. If START = NULL, then: Write UNDERFLOW and Exit
2. If LOCP = NULL, then: Set START := LINK[START]
   Else: Set LINK[LOCP] := LINK[LOC]
3. Set LINK[LOC] := AVAIL and AVAIL := LOC
4. Exit
```

```
Before: [A | •]——>[B | •]——>[C | NULL]    (delete B: LOC=B, LOCP=A)
After:  [A | •]——>[C | NULL]              (B freed)
```

**C++:**
```cpp
// loc: node to delete, locp: its predecessor (nullptr if loc is head)
void deleteNode(Node*& head, Node* loc, Node* locp) {
    if (head == nullptr) {
        cout << "Underflow: list is empty" << endl;
        return;
    }
    if (locp == nullptr)
        head = loc->next;        // deleting the first node
    else
        locp->next = loc->next;  // bypass loc
    delete loc;
}
```

### By Value

**Pseudocode:**
```
Algorithm: DELETE(INFO, LINK, START, AVAIL, ITEM)
1. Call FINDB(INFO, LINK, START, ITEM) to get LOC and LOCP
2. If LOC = NULL, then: Write ITEM not in list and Exit
3. If LOCP = NULL, then: Set START := LINK[START]
   Else: Set LINK[LOCP] := LINK[LOC]
4. Set LINK[LOC] := AVAIL and AVAIL := LOC
5. Exit

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

**C++:**
```cpp
void deleteByValue(Node*& head, int item) {
    if (head == nullptr) {
        cout << "Underflow: list is empty" << endl;
        return;
    }
    if (head->data == item) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    Node* k = head;
    Node* ptr = head->next;
    while (ptr != nullptr) {
        if (ptr->data == item) {
            k->next = ptr->next;
            delete ptr;
            return;
        }
        k = ptr;
        ptr = ptr->next;
    }
    cout << item << " not found in list" << endl;
}
```

> [!note] Why linked list deletion is $O(1)$ at a known pointer
> Deleting from an array requires shifting up to $n$ elements. Deleting from a linked list changes only two pointer fields regardless of list size. The rest of the structure is completely untouched.

---

## Header Linked Lists

A **header linked list** always contains a special **header node** at the beginning of the list. Two types:

- **Grounded header list** — last node contains a null pointer
- **Circular header list** — last node points back to the header node

Empty list conditions:
- Grounded: `LINK[START] = NULL`
- Circular: `LINK[START] = START`

> [!note] "Node" refers to ordinary nodes only
> In a header list, the term *node* refers to the non-header nodes. The header node is separate.

There are also other variations:
- A list whose last node points back to the **first ordinary node** (not header) — called a **circular linked list**
- A list with both a **header node** at the beginning and a **trailer node** at the end

### Traversal of a Circular Header Linked List

Circular header lists are frequently preferred over ordinary lists because:
- NULL pointer is never used — all pointers contain valid addresses
- Every ordinary node has a predecessor, so the first node may not require a special case

**Pseudocode:**
```
Algorithm: TRAVERSE(INFO, LINK, START)

1. Set PTR := LINK[START]
2. Repeat steps 3 and 4 while PTR ≠ START:
3.    Visit INFO[PTR]
4.    Set PTR := LINK[PTR]
   [End of loop]
5. Exit
```

**C++:**
```cpp
void traverseCircularHeader(Node* header) {
    Node* ptr = header->next;
    while (ptr != header) {
        cout << ptr->data << " ";
        ptr = ptr->next;
    }
    cout << endl;
}
```

### Search in a Circular Header Linked List

**Pseudocode:**
```
Algorithm: SRCHL(INFO, LINK, START, ITEM)

1. Set PTR := LINK[START]
2. Repeat while INFO[PTR] ≠ ITEM and PTR ≠ START:
      Set PTR := LINK[PTR]
   [End of loop]
3. If INFO[PTR] = ITEM, then: Set LOC := PTR
   Else: Set LOC := NULL
4. Exit
```

**C++:**
```cpp
Node* searchCircularHeader(Node* header, int item) {
    Node* ptr = header->next;
    while (ptr != header && ptr->data != item)
        ptr = ptr->next;
    return (ptr != header) ? ptr : nullptr;
}
```

### Deletion in a Circular Header Linked List

**Pseudocode:**
```
Algorithm: DELETECHL(INFO, LINK, START, AVAIL, ITEM)
1. Call FINDBCHL(INFO, LINK, START, ITEM) to get LOC and LOCP
2. If LOC = NULL, then: Write ITEM not in list and Exit
3. Set LINK[LOCP] := LINK[LOC]
4. Set LINK[LOC] := AVAIL and AVAIL := LOC
5. Exit

Algorithm: FINDBCHL(INFO, LINK, START, ITEM)
1. Set K := START and PTR := LINK[START]
2. Repeat while INFO[PTR] ≠ ITEM and PTR ≠ START:
      Set K := PTR and PTR := LINK[PTR]
   [End of loop]
3. If INFO[PTR] = ITEM, then: Set LOC := PTR and LOCP := K
   Else: Set LOC := NULL and LOCP := K
4. Return
```

**C++:**
```cpp
void deleteCircularHeader(Node* header, int item) {
    Node* k = header;
    Node* ptr = header->next;
    while (ptr != header && ptr->data != item) {
        k = ptr;
        ptr = ptr->next;
    }
    if (ptr == header) {
        cout << item << " not found in list" << endl;
        return;
    }
    k->next = ptr->next;
    delete ptr;
}
```

> [!note] No special case for first node in circular header list
> Because every ordinary node has a predecessor (the header node precedes the first ordinary node), deletion never needs to check for `LOCP = NULL`. This uniformity simplifies the algorithm compared to an ordinary singly linked list.

---

## Two-Way Lists (Doubly Linked Lists)

A **two-way list** is a linear collection of nodes where each node is divided into **three parts**:

1. Value/data element
2. `FORW` — link/pointer to the address of the **next** node
3. `BACK` — link/pointer to the address of the **previous** node

```
NULL←—[• | A | •]<——>[• | B | •]<——>[• | C | •]<——>[• | D | •]——>NULL
         ^                                               ^
       FIRST                                           LAST
```

Maintained in memory by **three arrays** and **two variables**:
- `INFO[K]` — actual data
- `FORW[K]` — forward link (next node)
- `BACK[K]` — backward link (previous node)
- `FIRST` — address of the first node
- `LAST` — address of the last node

The advantages of two-way lists and circular header lists may be combined — in that case, only **one pointer variable** is required.

**C++ node class:**
```cpp
class DNode {
public:
    int data;
    DNode* forw;
    DNode* back;

    DNode(int val) : data(val), forw(nullptr), back(nullptr) {}
};
```

### Deletion from a Two-Way List

Because each node stores its own predecessor via `BACK`, deletion does not require finding `LOCP` separately — a key advantage over singly linked lists.

**Pseudocode:**
```
Algorithm: DELTWL(INFO, FORW, BACK, START, AVAIL, LOC)

1. Set FORW[BACK[LOC]] := FORW[LOC] and
      BACK[FORW[LOC]] := BACK[LOC]
2. Set FORW[LOC] := AVAIL and AVAIL := LOC
3. Exit
```

**C++:**
```cpp
void deleteDoubly(DNode*& head, DNode* loc) {
    if (loc->back != nullptr)
        loc->back->forw = loc->forw;  // FORW[BACK[LOC]] := FORW[LOC]
    else
        head = loc->forw;             // deleting the first node

    if (loc->forw != nullptr)
        loc->forw->back = loc->back;  // BACK[FORW[LOC]] := BACK[LOC]

    delete loc;
}
```

### Insertion into a Two-Way List

Insert a new node between `loca` and `locb`:

**Pseudocode:**
```
Algorithm: INSTWL(INFO, FORW, BACK, START, AVAIL, LOCA, LOCB, ITEM)

1. If AVAIL = NULL, then: Write OVERFLOW and Exit
2. Set NEW := AVAIL, AVAIL := FORW[AVAIL]
3. Set INFO[NEW] := ITEM
4. Set FORW[LOCA] := NEW and FORW[NEW] := LOCB,
      BACK[LOCB] := NEW and BACK[NEW] := LOCA
5. Exit
```

**C++:**
```cpp
void insertDoublyBetween(DNode* loca, DNode* locb, int item) {
    DNode* newNode = new DNode(item);
    newNode->forw = locb;
    newNode->back = loca;
    if (loca != nullptr)
        loca->forw = newNode;
    if (locb != nullptr)
        locb->back = newNode;
}
```

---

## Types of Linked Lists — Summary

| Type | Pointers/node | Traversal | Delete (known node) | Key advantage |
|---|---|---|---|---|
| Singly linked | 1 (`next`) | Forward only | $O(n)$ — need predecessor | Simplest |
| Circular singly | 1 (`next`) | Forward, cyclic | $O(n)$ — need predecessor | No NULL — valid addresses always |
| Doubly linked (two-way) | 2 (`forw`, `back`) | Both directions | $O(1)$ — `back` gives predecessor | Bidirectional, easy deletion |
| Header linked | 1 (`next`) | Forward | No LOCP=NULL case | No special case for first node |
| Circular header | 1 (`next`) | Forward, cyclic | No LOCP=NULL case | Combines all advantages |

---

## Linked Lists for Polynomial Representation

A polynomial $P(x) = a_n x^n + a_{n-1} x^{n-1} + \cdots + a_1 x + a_0$ is naturally suited to linked list representation because:

- Terms can be added/removed without shifting
- Sparse polynomials (many zero coefficients) are stored efficiently — only non-zero terms stored

### Node Structure

Each node represents one non-zero term:

```
[ COEF | EXP | LINK ]
```

Example: $P(x) = 3x^5 + 2x^3 - 5x + 7$

```
START
  |
  v
[3 | 5 | •]——>[2 | 3 | •]——>[-5 | 1 | •]——>[7 | 0 | NULL]
```

Terms are stored in **descending order of exponent**.

**C++ node class:**
```cpp
class PolyNode {
public:
    int coef;
    int exp;
    PolyNode* next;

    PolyNode(int c, int e) : coef(c), exp(e), next(nullptr) {}
};
```

### Polynomial Addition

Traverse both lists simultaneously, comparing exponents:
- Equal exponents → add coefficients, insert one node in result (skip if sum is zero)
- $P$'s exponent larger → copy $P$'s term, advance $P$
- $Q$'s exponent larger → copy $Q$'s term, advance $Q$

**Manual trace:**

$P(x) = 3x^4 + 2x^2 + 1$ and $Q(x) = x^4 - 2x^2 + 5x$

```
EXP[P]=4 = EXP[Q]=4 → COEF = 3+1 = 4  → insert [4|4]
EXP[P]=2 = EXP[Q]=2 → COEF = 2-2 = 0  → skip (zero)
EXP[P]=0 < EXP[Q]=1 → copy Q's [5|1]  → insert [5|1], advance Q
Q exhausted, copy P's remaining [1|0]

Result: [4|4|•]——>[5|1|•]——>[1|0|NULL]
R(x) = 4x^4 + 5x + 1 ✓
```

**C++:**
```cpp
void appendTerm(PolyNode*& result, PolyNode*& tail, int coef, int exp) {
    PolyNode* newNode = new PolyNode(coef, exp);
    if (result == nullptr)
        result = tail = newNode;
    else {
        tail->next = newNode;
        tail = newNode;
    }
}

PolyNode* addPolynomials(PolyNode* p, PolyNode* q) {
    PolyNode* result = nullptr;
    PolyNode* tail = nullptr;

    while (p != nullptr && q != nullptr) {
        if (p->exp == q->exp) {
            int sum = p->coef + q->coef;
            if (sum != 0)
                appendTerm(result, tail, sum, p->exp);
            p = p->next;
            q = q->next;
        } else if (p->exp > q->exp) {
            appendTerm(result, tail, p->coef, p->exp);
            p = p->next;
        } else {
            appendTerm(result, tail, q->coef, q->exp);
            q = q->next;
        }
    }
    while (p != nullptr) {
        appendTerm(result, tail, p->coef, p->exp);
        p = p->next;
    }
    while (q != nullptr) {
        appendTerm(result, tail, q->coef, q->exp);
        q = q->next;
    }
    return result;
}
```

Time: $O(m + n)$ where $m$ and $n$ are the number of terms in $P$ and $Q$.

---

## Complexity Analysis

| Operation | Singly LL | Two-way (Doubly) LL |
|---|---|---|
| Traversal | $O(n)$ | $O(n)$ |
| Search | $O(n)$ | $O(n)$ |
| Insert at front | $O(1)$ | $O(1)$ |
| Insert at end | $O(n)$ | $O(1)$ with `tail` pointer |
| Insert after known node | $O(1)$ | $O(1)$ |
| Delete at known node | $O(n)$* | $O(1)$ |
| Polynomial addition | $O(m+n)$ | — |

\*Singly: must find predecessor by traversal. Doubly: `back` pointer gives it directly in $O(1)$.

---

## Common Misconceptions

> [!warning] "Linked list deletion is always $O(1)$"
> Deletion of a node is $O(1)$ only if you have both LOC and LOCP. Finding them by value requires $O(n)$ traversal. In a singly linked list, even if you have a pointer to the node, finding its predecessor still costs $O(n)$. Doubly linked lists eliminate this — `back` gives the predecessor directly.

> [!warning] "Linked lists use less memory than arrays"
> Linked lists use *more* memory per element — each node stores one or two extra pointers (8 bytes each on a 64-bit system). Their advantage is structural flexibility (dynamic size, cheap insert/delete), not memory efficiency.

> [!warning] "Insertion at position k is $O(1)$ in a linked list"
> Insertion *at a given pointer* is $O(1)$. Walking to position $k$ from head costs $O(k)$. The full cost of "insert at index k" is $O(k)$.

> [!warning] "A circular list loops forever during traversal"
> Only if the termination condition is wrong. Stop when `ptr == head` (circular singly) or `ptr == header` (circular header list). The issue is choosing the right sentinel — not that termination is impossible.

> [!warning] "Polynomial linked lists store all terms including zero-coefficient ones"
> The whole point is to store only *non-zero* terms. A polynomial like $x^{100} + 1$ has degree 100 but only 2 nodes in its linked list. Storing zero terms defeats the space advantage entirely.

---

## Practice Problems

1. Trace traversal of INFO=[A,D,C,_,B,_], LINK=[5,0,2,7,3,4], START=1 — Classic — Easy
2. Insert value 50 after the node containing 30 in 10→20→30→40→NULL, using both pseudocode and C++ — Classic — Easy
3. Delete the node containing 30 from 10→20→30→40→NULL, showing pointer updates in both pseudocode and C++ — Classic — Easy
4. Search for ITEM=30 in the sorted list 10→20→30→40 using SEARCHSL, showing each step — Classic — Easy
5. Add $P(x) = 4x^3 + 3x + 2$ and $Q(x) = 2x^3 - 3x^2 + x - 2$ using the polynomial addition procedure, tracing the algorithm step by step — Classic — Medium

---

## Cheat Sheet

**Singly linked list node (C++):**
```cpp
class Node {
public:
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};
```

**Doubly linked list node (C++):**
```cpp
class DNode {
public:
    int data;
    DNode* forw;
    DNode* back;
    DNode(int val) : data(val), forw(nullptr), back(nullptr) {}
};
```

**Polynomial node (C++):**
```cpp
class PolyNode {
public:
    int coef;
    int exp;
    PolyNode* next;
    PolyNode(int c, int e) : coef(c), exp(e), next(nullptr) {}
};
```

**Key variables:**
- `head` / `START` — pointer to first node
- `nullptr` / `NULL` — end of list
- `new Node(val)` — allocate node (replaces AVAIL mechanism)
- `delete node` — free node

**Insertion pointer order (after loc):**
```cpp
newNode->next = loc->next;  // first
loc->next = newNode;        // second
```

**Deletion:**
```cpp
// if deleting head:
head = head->next;
// otherwise:
locp->next = loc->next;
delete loc;
```

**OVERFLOW:** `new` fails or AVAIL = NULL. **UNDERFLOW:** `head == nullptr`.

**Circular header — empty conditions:**
- Grounded: `LINK[START] = NULL` (C++: `header->next == nullptr`)
- Circular: `LINK[START] = START` (C++: `header->next == header`)

**Polynomial node:** sorted descending by `exp`, zero-coefficient terms omitted.
