import sys
import json
import sys
import json
import re
import base64
import argparse
from grading_algorithm import calculate_total_score

def count_lines_of_code(code_str, language='python'):
    """Counts non-empty, non-comment lines of code for various languages."""
    if not isinstance(code_str, str):
        return 0

    code = code_str
    lang = language.lower()

    # Explicitly set comment styles based on the language family
    if lang in ['javascript', 'java', 'c', 'cpp', 'c++']:
        single_line_comment = '//'
        multi_line_regex = r'/\*.*?\*/'
    elif lang == 'python':
        single_line_comment = '#'
        multi_line_regex = None
    else:
        # As a fallback for unrecognized languages, assume no comments.
        # This is safer than assuming a wrong comment style.
        single_line_comment = None
        multi_line_regex = None

    # 1. Remove multi-line comments if a style is defined for it
    if multi_line_regex:
        code = re.sub(multi_line_regex, '', code, flags=re.DOTALL)

    # 2. Process line by line
    lines = code.split('\n')
    count = 0
    for line in lines:
        line_content = line.strip()

        if not line_content:
            continue

        # Remove single-line comments (trailing or full) if a style is defined
        if single_line_comment:
            if single_line_comment in line_content:
                line_content = line_content.split(single_line_comment, 1)[0].strip()
        
        if line_content:
            count += 1
            
    return count

def main():
    """
    Main function to grade a submission.
    It reads submission data from stdin, calculates the score using the grading_algorithm,
    and prints the result to stdout.
    """
    try:
        parser = argparse.ArgumentParser(description='Grade a coding submission.')
        parser.add_argument('--input-base64', type=str, help='Base64 encoded JSON input string')
        args = parser.parse_args()

        input_str = ""
        if args.input_base64:
            input_str = base64.b64decode(args.input_base64).decode('utf-8')
        else:
            # Read all data from stdin as a fallback
            input_str = sys.stdin.read()

        if not input_str:
            print(json.dumps({"error": "No input received."}), file=sys.stderr)
            sys.exit(1)
            
        submission_data = json.loads(input_str)

        # --- Extract data from submission ---
        difficulty = submission_data.get("difficulty", "easy")
        speed_ms = submission_data.get("execution_time_ms", 3) # Default to a higher value if not present
        code = submission_data.get("code", "")
        language = submission_data.get("language", "python") # Default to python if not specified
        
        # --- Determine expected values (these would typically come from a DB) ---
        expected_loc = submission_data.get("optimal_loc", 20)
        
        # --- Calculate actual values from submission ---
        actual_loc = count_lines_of_code(code, language)

        # --- Calculate the score using the dedicated algorithm ---
        result = calculate_total_score(
            difficulty=difficulty,
            speed_ms=speed_ms,
            actual_loc=actual_loc,
            expected_loc=expected_loc
        )
        
        # Output result as JSON to stdout
        print(json.dumps(result, indent=4))

    except json.JSONDecodeError as e:
        print(json.dumps({"error": "Invalid JSON input.", "details": str(e)}), file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": "An unexpected error occurred.", "details": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()