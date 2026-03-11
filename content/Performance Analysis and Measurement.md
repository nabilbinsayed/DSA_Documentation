---
title: Performance Analysis and Measurement
draft: false
tags:
Resources: https://takeuforward.org/time-complexity/time-and-space-complexity-strivers-a2z-dsa-course
---




**Complexity**: The function which gives the running time and/or space in terms of the input size (n). 

Time complexity is usually analyzed more (than space complexity). It is computed in terms of order of magnitude. So n and n/2 can be considered similar, as for large n the difference wouldn't be significant. But changes in order is significant, as in n vs n^2, e.g., 1000 vs 1000000. Thus for expressions like an^2, 'a' is discarded and only n^2 is taken into account. In polynomials, only the term of the highest power is considered in complexity, as the other terms will grow insignificant for large n. e.g., if the ax^2 +bx+c ~ x^2 for large x. 

