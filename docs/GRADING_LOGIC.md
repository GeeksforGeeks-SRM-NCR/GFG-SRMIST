# GeeksforGeeks SRMIST Chapter - Grading Logic Documentation v1

> **Audience:** Developers & System Maintainers  
> **Version:** 1.0  
> **Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Workflow](#workflow)
3. [`grade_submission.py`](#grade_submissionpy)
   - [Purpose](#purpose)
   - [Input](#input)
   - [Core Logic](#core-logic)
   - [Output](#output)
4. [`grading_algorithm.py`](#grading_algorithmpy)
   - [Purpose](#purpose-1)
   - [Input](#input-1)
   - [Scoring Model](#scoring-model)
   - [Output](#output-1)
5. [How to Use](#how-to-use)

---

## Overview

The grading system is designed to automatically evaluate code submissions for practice problems and challenges. It provides a score based on two key metrics: **execution speed** and **lines of code (LOC)**.

The logic is split into two Python scripts:
- `grade_submission.py`: The main entry point that processes the raw submission.
- `grading_algorithm.py`: A dedicated module that implements the core scoring algorithm.

This decoupled design separates the concerns of submission processing (e.g., parsing code) from the mathematical scoring logic, making the system easier to maintain and test.

---

## Workflow

The grading process follows a clear, sequential workflow:

```
┌───────────────────────────────────────────┐
│              1. Submission                │
│ (JSON with code, language, difficulty)    │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│         2. `grade_submission.py`          │
│    - Receives JSON via stdin/base64       │
│    - Counts actual lines of code (LOC)    │
│    - Imports and calls the grading algo   │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│        3. `grading_algorithm.py`          │
│  - Calculates speed score                 │
│  - Calculates LOC score                   │
│  - Applies weights and returns total      │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│            4. Final Output                │
│      (JSON with total score and details)  │
└───────────────────────────────────────────┘
```

---

## `grade_submission.py`

### Purpose

This script acts as the primary interface for the grading system. It takes a raw code submission, extracts necessary information, calculates the lines of code, and orchestrates the final score calculation by invoking `grading_algorithm.py`.

### Input

The script expects a JSON object, which can be provided in two ways:
1. As a **raw string** via `stdin`.
2. As a **Base64 encoded string** using the `--input-base64` command-line argument.

**JSON Input Schema:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `difficulty` | `string` | Yes | Problem difficulty ("easy", "medium", "hard") |
| `execution_time_ms` | `number` | Yes | Code execution time in milliseconds |
| `code` | `string` | Yes | The user's submitted code |
| `language` | `string` | Yes | The language of the code (e.g., "python", "javascript") |
| `optimal_loc` | `number` | Yes | The expected lines of code for an ideal solution |

**Example Input:**
```json
{
  "difficulty": "easy",
  "execution_time_ms": 1.5,
  "code": "def hello():\n  print('Hello, World!')",
  "language": "python",
  "optimal_loc": 2
}
```

### Core Logic

#### `count_lines_of_code(code_str, language)`
This is the most critical function in the script. It intelligently counts the "logical" lines of code by:
1.  **Removing multi-line comments** (e.g., `/* ... */` for JavaScript, Java, C/C++).
2.  **Ignoring empty or whitespace-only lines.**
3.  **Stripping single-line comments** (e.g., `#` for Python, `//` for others) from each line before checking if it's empty.

This ensures that comments and blank lines do not unfairly penalize a user's score.

#### `main()`
The main function orchestrates the entire process:
1.  Reads and parses the input JSON.
2.  Calls `count_lines_of_code()` to determine the `actual_loc`.
3.  Imports `calculate_total_score` from `grading_algorithm.py`.
4.  Calls the scoring function with all the required parameters: `difficulty`, `speed_ms`, `actual_loc`, and `expected_loc`.
5.  Prints the final, detailed score as a JSON object to `stdout`.

### Output

The script outputs the JSON result from `grading_algorithm.py` directly to `stdout`.

---

## `grading_algorithm.py`

### Purpose

This script is a pure calculation module. It contains the mathematical logic for determining a score based on pre-defined weights and thresholds. It is completely independent of the submission format.

### Input

The script is executed as a command-line tool that takes a single JSON string argument with the following structure:

**JSON Input Schema:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `difficulty` | `string` | Yes | Problem difficulty ("easy", "medium", "hard") |
| `speed_ms` | `number` | Yes | Execution time in milliseconds |
| `actual_loc` | `number` | Yes | Actual lines of code in the submission |
| `expected_loc` | `number` | Yes | Expected lines of code for the problem |

### Scoring Model

#### Maximum Marks
The total possible score depends on the problem's difficulty:
- **Easy:** 10 marks
- **Medium:** 20 marks
- **Hard:** 30 marks

#### Parameter Weights
The final score is a weighted sum of two components:
- **Execution Speed:** 60% of total marks
- **Lines of Code (LOC):** 40% of total marks

#### `calculate_speed_score(speed_ms, max_speed_marks)`
The speed score is calculated based on strict thresholds:
- **≤ 2ms:** 100% of available speed marks
- **≤ 3ms:** 75% of available speed marks
- **≥ 4ms:** 50% of available speed marks

#### `calculate_loc_score(actual_loc, expected_loc, max_loc_marks)`
The LOC score is more lenient, allowing for some overhead:
- **`actual_loc` ≤ `expected_loc` * 1.25:** 100% of available LOC marks (allows 25% overhead)
- **`actual_loc` ≤ `expected_loc` * 1.50:** 80% of available LOC marks
- **`actual_loc` ≤ `expected_loc` * 1.75:** 50% of available LOC marks
- **`actual_loc` > `expected_loc` * 1.75:** 25% of available LOC marks

### Output

The script prints a JSON object to `stdout` detailing the final score.

**Example Output:**
```json
{
    "total_score": 8.5,
    "max_marks": 10,
    "details": {
        "execution_speed": {
            "score": 4.5,
            "max": 6.0
        },
        "lines_of_code": {
            "score": 4.0,
            "max": 4.0
        }
    }
}
```

---

## How to Use

To run the grading process from the command line, you would typically pipe a JSON object into `grade_submission.py`.

**Example Command:**
```bash
cat submission.json | python scripts/grade_submission.py
```

Alternatively, using the base64 argument:
```bash
INPUT_B64=$(cat submission.json | base64 -w 0)
python scripts/grade_submission.py --input-base64 $INPUT_B64
```

---