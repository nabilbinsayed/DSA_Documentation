# Two-Dimensional Arrays and Matrices: Row-Major Layout, Standard Multiplication, and Strassen's Algorithm

While we visualize a two-dimensional array as a grid of rows and columns, physical computer memory is strictly one-dimensional—a linear sequence of byte addresses. Bridging the gap between our 2D grid visualization and 1D hardware reality requires a mathematical mapping function. 

In this guide, we will explore 2D arrays and matrices in C/C++: how row-major order layout maps grid coordinates to linear memory addresses, the cache locality implications of traversing arrays, the standard $O(N^3)$ matrix multiplication algorithm, and the divide-and-conquer mechanics of Strassen's $O(N^{2.807})$ fast matrix multiplication.

---

## 1. What is a Two-Dimensional Array?

### Formal Definition
A **Two-Dimensional Array** is a grid-like data structure that represents a matrix of elements organized in rows and columns. In computer memory, this 2D structure is flattened into a 1D sequence of elements, typically using **Row-Major Order** in C/C++ (where elements of a row are stored contiguously), or **Column-Major Order** in languages like Fortran.

### Intuitive Explanation
Think of a calendar page representing a single month. 
- The calendar is a grid: rows represent weeks (numbered $0$ to $4$), and columns represent days of the week (Sunday as day $0$, Monday as day $1$, etc.).
- Even though you visualize the calendar as a grid, the dates are printed sequentially on paper. If you wrote all the dates in a single line, it would read: `May 1, May 2, May 3...`

Row-major order behaves exactly like writing the calendar dates in a single line: you write all the days of Week $0$, followed immediately by Week $1$, then Week $2$. 

### The Row-Major Memory Mapping (Address Math)
Let’s see how a C compiler flattens a $3 \times 4$ integer array (3 rows, 4 columns) starting at Base Address `1000`:
$$\text{int arr[3][4]}$$

```
                Column 0    Column 1    Column 2    Column 3
Row 0:           [1000]      [1004]      [1008]      [1012]
Row 1:           [1016]      [1020]      [1024]      [1028]
Row 2:           [1032]      [1036]      [1040]      [1044]
```

To flatten this grid into linear memory, the compiler stacks the rows sequentially:
```
Linear Memory: [ Row 0 (4 elements) ] [ Row 1 (4 elements) ] [ Row 2 (4 elements) ]
Address:       1000 1004 1008 1012    1016 1020 1024 1028    1032 1036 1040 1044
```

To locate element `arr[i][j]` (where $i$ is the row and $j$ is the column) in an array with $C$ columns, the CPU uses the **Row-Major Mapping Formula**:
$$\text{Address}(arr[i][j]) = \text{BaseAddress} + (i \times C + j) \times \text{SizeOfElement}$$
For `arr[1][2]` (Row 1, Column 2) in our $3 \times 4$ array (number of columns $C = 4$):
$$\text{Address}(arr[1][2]) = 1000 + (1 \times 4 + 2) \times 4 = 1000 + 6 \times 4 = 1024$$
This allows the CPU to calculate the address of any 2D grid cell in $O(1)$ constant time.

---

## 2. The Core Idea

### Cache Locality and Traversal Order
Because arrays are stored in row-major order in C/C++, accessing elements row-by-row is significantly faster than accessing them column-by-column. 
- **Row-by-Row (Cache-friendly):** Accessing `arr[0][0]`, `arr[0][1]`, `arr[0][2]` reads memory locations sequentially (`1000`, `1004`, `1008`). The CPU loads these adjacent blocks into high-speed **cache memory** in advance. This results in **cache hits**, speeding up execution.
- **Column-by-Column (Cache-unfriendly):** Accessing `arr[0][0]`, `arr[1][0]`, `arr[2][0]` jumps address space (`1000`, `1016`, `1032`). This forces the CPU to constantly fetch new blocks from the slower main RAM, causing **cache misses** and slowing down performance.

---

### Standard Matrix Multiplication ($O(N^3)$)
To multiply two $N \times N$ matrices $A$ and $B$ to form matrix $C$, we calculate each cell $C[i][j]$ as the dot product of row $i$ of $A$ and column $j$ of $B$:
$$C[i][j] = \sum_{k=0}^{N-1} A[i][k] \times B[k][j]$$
This requires three nested loops (iterating over rows $i$, columns $j$, and the dot-product index $k$). Since each loop runs $N$ times, standard matrix multiplication takes:
$$\text{Time Complexity} = O(N^3)$$

---

### Strassen's Algorithm ($O(N^{2.807})$)
Standard block matrix multiplication splits an $N \times N$ matrix into four $\frac{N}{2} \times \frac{N}{2}$ submatrices. Doing this recursively still requires $8$ multiplications of the submatrices:
```
C11 = A11*B11 + A12*B21
C12 = A11*B12 + A12*B22
C21 = A21*B11 + A22*B21
C22 = A21*B12 + A22*B22
```
This yields the recurrence relation $T(N) = 8T(N/2) + O(N^2)$, which evaluates to $O(N^3)$ by the Master Theorem. No performance is gained.

Volker Strassen (1969) discovered a mathematical trick to compute these submatrices using only **7 multiplications** instead of 8, at the cost of performing more additions and subtractions.

#### **The 7 Strassen Products:**
$$P_1 = a_{11} \times (b_{12} - b_{22})$$
$$P_2 = (a_{11} + a_{12}) \times b_{22}$$
$$P_3 = (a_{21} + a_{22}) \times b_{11}$$
$$P_4 = a_{22} \times (b_{21} - b_{11})$$
$$P_5 = (a_{11} + a_{22}) \times (b_{11} + b_{22})$$
$$P_6 = (a_{12} - a_{22}) \times (b_{21} + b_{22})$$
$$P_7 = (a_{11} - a_{21}) \times (b_{11} + b_{12})$$

#### **Reconstructing the Output Submatrices:**
$$c_{11} = P_5 + P_4 - P_2 + P_6$$
$$c_{12} = P_1 + P_2$$
$$c_{21} = P_3 + P_4$$
$$c_{22} = P_5 + P_1 - P_3 - P_7$$

By reducing the recursive multiplications from $8$ to $7$, Strassen's algorithm achieves a lower asymptotic complexity, which becomes faster than standard multiplication on very large matrices.

---

## 3. Pseudocode (CLRS Style)

### Standard Matrix Multiplication
```text
STANDARD-MATRIX-MULTIPLY(A, B)
1  n = A.rows
2  let C be a new n x n matrix, initialized to 0
3  for i = 0 to n - 1
4      for j = 0 to n - 1
5          for k = 0 to n - 1
6              C[i][j] = C[i][j] + A[i][k] * B[k][j]
7  return C
```

### Strassen's Recursive Outline
```text
STRASSEN-MULTIPLY(A, B)
1  n = A.rows
2  if n == 1
3      return A[0][0] * B[0][0]
4  else
5      partition A into A11, A12, A21, A22
6      partition B into B11, B12, B21, B22
7      compute P1 through P7 recursively
8      c11 = P5 + P4 - P2 + P6
9      c12 = P1 + P2
10     c21 = P3 + P4
11     c22 = P5 + P1 - P3 - P7
12     combine c11, c12, c21, c22 into result C
13     return C
```

---

## 4. Implementation

Below is the C++ implementation of Standard and Strassen Matrix Multiplication, adapted directly from our repository `Algorithm_Design_and_Analysis/Asgmt03/matrix_mult_strassen.cpp`.

### C++ Implementation
```cpp
#include <iostream>
#include <vector>

using namespace std;

// Helper function to add two matrices
vector<vector<int>> add(const vector<vector<int>> &a, const vector<vector<int>> &b)
{
    int n = a.size();
    vector<vector<int>> c(n, vector<int>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            c[i][j] = a[i][j] + b[i][j];
    return c;
}

// Helper function to subtract two matrices
vector<vector<int>> sub(const vector<vector<int>> &a, const vector<vector<int>> &b)
{
    int n = a.size();
    vector<vector<int>> c(n, vector<int>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            c[i][j] = a[i][j] - b[i][j];
    return c;
}

// Standard O(N^3) Matrix Multiplication loop
vector<vector<int>> standardMul(const vector<vector<int>> &a, const vector<vector<int>> &b)
{
    int n = a.size();
    vector<vector<int>> c(n, vector<int>(n, 0));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
            for (int k = 0; k < n; ++k)
                c[i][j] += a[i][k] * b[k][j];
    return c;
}

// Recursive Strassen algorithm
vector<vector<int>> strassen(const vector<vector<int>> &a, const vector<vector<int>> &b)
{
    int n = a.size();

    // Base case: Use standard multiplication for small matrices to avoid stack overhead
    if (n <= 64)
    {
        return standardMul(a, b);
    }

    int half = n / 2;
    vector<vector<int>> a11(half, vector<int>(half)), a12(half, vector<int>(half)),
                        a21(half, vector<int>(half)), a22(half, vector<int>(half));
    vector<vector<int>> b11(half, vector<int>(half)), b12(half, vector<int>(half)),
                        b21(half, vector<int>(half)), b22(half, vector<int>(half));

    // Partition matrices into four quadrants
    for (int i = 0; i < half; i++)
    {
        for (int j = 0; j < half; j++)
        {
            a11[i][j] = a[i][j];
            a12[i][j] = a[i][j + half];
            a21[i][j] = a[i + half][j];
            a22[i][j] = a[i + half][j + half];

            b11[i][j] = b[i][j];
            b12[i][j] = b[i][j + half];
            b21[i][j] = b[i + half][j];
            b22[i][j] = b[i + half][j + half];
        }
    }

    // Compute the 7 Strassen products recursively
    vector<vector<int>> p1 = strassen(a11, sub(b12, b22));
    vector<vector<int>> p2 = strassen(add(a11, a12), b22);
    vector<vector<int>> p3 = strassen(add(a21, a22), b11);
    vector<vector<int>> p4 = strassen(a22, sub(b21, b11));
    vector<vector<int>> p5 = strassen(add(a11, a22), add(b11, b22));
    vector<vector<int>> p6 = strassen(sub(a12, a22), add(b21, b22));
    vector<vector<int>> p7 = strassen(sub(a11, a21), add(b11, b12));

    // Combine quadrants to form final matrix
    vector<vector<int>> c11 = sub(add(add(p5, p4), p6), p2);
    vector<vector<int>> c12 = add(p1, p2);
    vector<vector<int>> c21 = add(p3, p4);
    vector<vector<int>> c22 = sub(sub(add(p5, p1), p3), p7);

    // Reconstruct C matrix
    vector<vector<int>> c(n, vector<int>(n));
    for (int i = 0; i < half; i++)
    {
        for (int j = 0; j < half; j++)
        {
            c[i][j] = c11[i][j];
            c[i][j + half] = c12[i][j];
            c[i + half][j] = c21[i][j];
            c[i + half][j + half] = c22[i][j];
        }
    }
    return c;
}

int main()
{
    // Test Strassen with 2x2 matrices
    vector<vector<int>> a = {{1, 2}, {3, 4}};
    vector<vector<int>> b = {{5, 6}, {7, 8}};
    vector<vector<int>> c = strassen(a, b);

    cout << "Strassen result:\n";
    for (const auto &row : c) {
        for (int val : row)
            cout << val << " ";
        cout << "\n";
    }
    return 0;
}
```

### Python Implementation
```python
def add(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    return [[a[i][j] + b[i][j] for j in range(len(a))] for i in range(len(a))]

def sub(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    return [[a[i][j] - b[i][j] for j in range(len(a))] for i in range(len(a))]

def standard_mul(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    n = len(a)
    c = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                c[i][j] += a[i][k] * b[k][j]
    return c

def strassen(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    n = len(a)
    if n <= 2:
        return standard_mul(a, b)
        
    half = n // 2
    # Slicing submatrices in Python
    a11 = [row[:half] for row in a[:half]]
    a12 = [row[half:] for row in a[:half]]
    a21 = [row[:half] for row in a[half:]]
    a22 = [row[half:] for row in a[half:]]
    
    b11 = [row[:half] for row in b[:half]]
    b12 = [row[half:] for row in b[:half]]
    b21 = [row[:half] for row in b[half:]]
    b22 = [row[half:] for row in b[half:]]
    
    p1 = strassen(a11, sub(b12, b22))
    p2 = strassen(add(a11, a12), b22)
    p3 = strassen(add(a21, a22), b11)
    p4 = strassen(a22, sub(b21, b11))
    p5 = strassen(add(a11, a22), add(b11, b22))
    p6 = strassen(sub(a12, a22), add(b21, b22))
    p7 = strassen(sub(a11, a21), add(b11, b12))
    
    c11 = sub(add(add(p5, p4), p6), p2)
    c12 = add(p1, p2)
    c21 = add(p3, p4)
    c22 = sub(sub(add(p5, p1), p3), p7)
    
    # Reassemble final grid
    c = []
    for i in range(half):
        c.append(c11[i] + c12[i])
    for i in range(half):
        c.append(c21[i] + c22[i])
    return c

if __name__ == "__main__":
    a = [[1, 2], [3, 4]]
    b = [[5, 6], [7, 8]]
    print("Python Strassen result:", strassen(a, b))
```

---

## 5. Complexity Analysis

### Standard vs Strassen Recurrences
To mathematically analyze the threshold where Strassen's algorithm outperforms standard multiplication, we compare their recurrence relations using the Master Theorem:
$$T(N) = a T(N/b) + f(N)$$

- **Standard Divide-and-Conquer Multiplication:**
  We perform $8$ recursive multiplications on submatrices of size $N/2$, and perform matrix additions which take $O(N^2)$ time:
  $$T(N) = 8 T(N/2) + O(N^2)$$
  Here, $a = 8, b = 2$.
  $$\log_b a = \log_2 8 = 3$$
  Since $f(N) = O(N^2) = O(N^{\log_b a - \epsilon})$ where $\epsilon = 1$, by Case 1 of the Master Theorem:
  $$\text{Time Complexity} = O(N^3)$$

- **Strassen's Multiplication:**
  We perform $7$ recursive multiplications on submatrices of size $N/2$, alongside matrix additions taking $O(N^2)$ time:
  $$T(N) = 7 T(N/2) + O(N^2)$$
  Here, $a = 7, b = 2$.
  $$\log_b a = \log_2 7 \approx 2.807$$
  By Case 1 of the Master Theorem:
  $$\text{Time Complexity} = O(N^{\log_2 7}) \approx O(N^{2.807})$$

### Space Complexity & Submatrix Allocation
- **Standard Space Complexity:** $O(N^2)$ to store the output matrix. If done iteratively, no recursion stack overhead is introduced.
- **Strassen's Space Complexity:** $O(N^2)$ memory overhead. Even though it is asymptotically $O(N^2)$, the constant factor is high because each recursive level allocates $8$ submatrices ($a_{11}$ through $b_{22}$) and $7$ product matrices ($p_1$ through $p_7$). This is why Strassen is **slower** in practice for small matrix sizes ($N \le 64$) and standard multiplication is preferred.

---

## 6. Worked Examples

### Example 1: Standard Loop Matrix Multiplication
In `Algorithm_Design_and_Analysis/11thMayLab03/matrix_mult.cpp`, standard multiplication is implemented.
The loops are structured as:
```cpp
  for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
      for (int k = 0; k < n; ++k)
        c[i][j] += a[i][k] * b[k][j];
```
This is a standard implementation. However, notice that the innermost loop index accesses `b[k][j]`. 
As `k` changes, the row index of `b` changes. This means we are traversing matrix `b` column-by-column, which results in cache misses.
#### **A Cache-Friendly Optimization:**
We can swap the inner loops ($j$ and $k$) to improve cache locality:
```cpp
  for (int i = 0; i < n; ++i)
    for (int k = 0; k < n; ++k)
      for (int j = 0; j < n; ++j)
        c[i][j] += a[i][k] * b[k][j];
```
In this arrangement, the innermost loop accesses `c[i][j]` and `b[k][j]` consecutively (since `j` is changing). This enables spatial cache locality, speeding up execution significantly on large matrices.

### Example 2: Strassen Quadrant Partitioning
In `Algorithm_Design_and_Analysis/Asgmt03/matrix_mult_strassen.cpp`, submatrix indices are calculated relative to the midpoint:
```cpp
  int half = n / 2;
  // ...
  for (int i = 0; i < half; i++) {
    for (int j = 0; j < half; j++) {
      a11[i][j] = a[i][j];
      a12[i][j] = a[i][j + half];
      a21[i][j] = a[i + half][j];
      a22[i][j] = a[i + half][j + half];
```
This copies data from `a` into small submatrices, which allocates new memory. While clean and recursive, allocating and copying these vectors repeatedly creates high memory allocation overhead. In professional libraries, this is optimized by passing indices (`row_start`, `row_end`, `col_start`, `col_end`) directly to prevent copying submatrices.

---

## 7. Practice Problems

1. **In-Place Matrix Transposition:**
   Given a square $N \times N$ matrix, transpose it in-place using only $O(1)$ auxiliary space.
2. **Rotate Matrix by 90 Degrees:**
   Given a square image represented by an $N \times N$ matrix, rotate it clockwise by 90 degrees in-place. (Hint: transpose the matrix first, then reverse each row).
3. **Spiral Matrix Traversal:**
   Write a program that takes an $R \times C$ matrix as input and returns all elements of the matrix in spiral order (outer perimeter boundary clockwise shrinking inwards).
4. **Search in a 2D Sorted Matrix:**
   Given an $M \times N$ matrix where each row and column is sorted in ascending order, search for a target value in $O(M + N)$ time starting from the top-right corner.

---

## 8. Cheat Sheet

### Row-Major Mapping Checklist
- For a 2D array `A[Rows][Cols]`, the address of `A[i][j]` is:
  `BaseAddress + (i * Cols + j) * sizeof(Type)`
- **Rule of Thumb:** Always write the innermost loop of a matrix operation so that the column index `j` is the one changing rapidly, ensuring sequential memory access and spatial cache locality.

### C++ Vector Grid Allocation
- **Create a 2D vector initialized with zeros:**
  `std::vector<std::vector<int>> matrix(rows, std::vector<int>(cols, 0));`
- **Pass 2D vector as read-only reference:**
  `void process(const std::vector<std::vector<int>> &grid)`
