Write a DSA blog post on [TOPIC, e.g. "Two Pointers Technique"] for a CS 
undergraduate audience. The primary goal is deep, intuitive understanding 
of the concept. Exam relevance is secondary — never let it shrink or 
oversimplify an explanation.

Structure it exactly as follows:

## 1. What is [TOPIC]?
- Formal definition (2-3 sentences, precise)
- Intuitive explanation — take the space needed, do not rush this
- One real-world analogy that genuinely maps to how the technique works
  mechanically, not just thematically

## 2. The Core Idea
- Explain the mechanism step by step in plain English, before any code
- Include the "why" — why does this approach work? what property does it exploit?
- Use a concrete small example (e.g. an array of 5-6 elements) walked through 
  manually, showing state at each step

## 3. Pseudocode
- Lipschutz style (Schaum's Outlines)
- Numbered steps, := for assignment, bracketed ALL-CAPS comments per step
- End with Exit.

## 4. Implementation
- Show code in C++, Python, and C# as separate named blocks
- Use the same canonical example across all three for easy comparison
- Add inline comments where the logic is non-obvious

## 5. Complexity Analysis
| Case | Time | Space |
- Best, average, worst for time with a one-line justification per case
- Space complexity with justification
- Note whether it is in-place and why that matters

## 6. Worked Examples
- 2 problems (vary difficulty)
- For each: problem statement → why this approach fits → 
  step-by-step walkthrough → code → edge cases
- Edge cases must include: empty input, single element, 
  duplicates (if relevant to the topic)

## 7. Common Misconceptions
- 3-5 points written as "A common misunderstanding is..." or 
  "Students often assume..."
- Focus on conceptual confusion, not just coding mistakes

## 8. Practice Problems
- 5 problems: [Problem Name] — [Platform] — [Difficulty]
- No solutions

## 9. Cheat Sheet

- Add a quick exam cheat sheet
---
Constraints:
- Markdown throughout, Obsidian-compatible (no MDX, no JSX)
- No hard word limit — use as much space as the concept genuinely needs
- Tone: clear, precise, curious — write like a senior student explaining 
  to a junior, not like a textbook or a tutorial farm
- Avoid: "In conclusion", "As we can see", "It is important to note", 
  "In the world of DSA"