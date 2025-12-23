import sys
import json

# Define the weights for each grading parameter
WEIGHTS = {
    'execution_speed': 0.6,
    'lines_of_code': 0.4
}

# Define the maximum marks for each difficulty level
MAX_MARKS = {
    'easy': 10,
    'medium': 20,
    'hard': 30
}

def calculate_speed_score(speed_ms, max_speed_marks):
    """
    Calculates the score for execution speed based on predefined thresholds.
    """
    if speed_ms <= 2:
        return max_speed_marks
    elif speed_ms <= 3:
        return max_speed_marks * 0.75
    else: # speed_ms >= 4
        return max_speed_marks * 0.5

def calculate_loc_score(actual_loc, expected_loc, max_loc_marks):
    """
    Calculates the score for lines of code (LOC) with lenient thresholds.
    """
    if actual_loc <= expected_loc:
        return max_loc_marks
    
    ratio = actual_loc / expected_loc
    if ratio <= 1.25: # Allow up to 25% overhead for full marks
        return max_loc_marks
    elif ratio <= 1.5: # Penalize beyond 25%
        return max_loc_marks * 0.8
    elif ratio <= 1.75: # Penalize beyond 50%
        return max_loc_marks * 0.5
    else: # Penalize beyond 75%
        return max_loc_marks * 0.25

def calculate_total_score(difficulty, speed_ms, actual_loc, expected_loc):
    """
    Calculates the total score for a submission by combining all parameters.
    """
    total_marks = MAX_MARKS.get(difficulty.lower())
    if total_marks is None:
        raise ValueError(f"Invalid difficulty level: {difficulty}")

    # Calculate the maximum marks available for each category
    max_speed_marks = total_marks * WEIGHTS['execution_speed']
    max_loc_marks = total_marks * WEIGHTS['lines_of_code']
    
    # Calculate the actual score for each category
    speed_score = calculate_speed_score(speed_ms, max_speed_marks)
    loc_score = calculate_loc_score(actual_loc, expected_loc, max_loc_marks)
    
    # Sum up the scores
    total_score = round(speed_score + loc_score, 2)
    
    return {
        "total_score": total_score,
        "max_marks": total_marks,
        "details": {
            "execution_speed": {"score": round(speed_score, 2), "max": round(max_speed_marks, 2)},
            "lines_of_code": {"score": round(loc_score, 2), "max": round(max_loc_marks, 2)}
        }
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        
        result = calculate_total_score(
            difficulty=input_data["difficulty"],
            speed_ms=input_data["speed_ms"],
            actual_loc=input_data["actual_loc"],
            expected_loc=input_data["expected_loc"]
        )
        
        print(json.dumps(result, indent=4))
        
    except (IndexError, json.JSONDecodeError, KeyError) as e:
        print(f"Error: Invalid input. Please provide a valid JSON string with all required keys.", file=sys.stderr)
        print(f"Details: {e}", file=sys.stderr)
        sys.exit(1)