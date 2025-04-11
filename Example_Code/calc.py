def calculator(a, b):
    return {
        "add": a + b,
        "subtract": a - b,
        "multiply": a * b,
        "divide": a / b if b != 0 else "undefined",
        "remainder": a % b if b != 0 else "undefined"
    }

if __name__ == "__main__":
    import sys

    try:
        a = float(sys.argv[1])
        b = float(sys.argv[2])
    except (IndexError, ValueError):
        print("Usage: python cloud.py <num1> <num2>")
        sys.exit(1)

    result = calculator(a, b)
    for op, value in result.items():
        print(f"{op}: {value}", end=" ")
