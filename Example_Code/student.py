def hello(event, context):
    name = event.get("name", "Unknown")
    age = event.get("age", "N/A")
    cgpa = event.get("cgpa", "N/A")
    return f"Student {name} (Age: {age}) has a CGPA of {cgpa}"

if __name__ == "__main__":
    import sys
    import json

    # Parse CLI args as JSON strings (can pass raw or encoded via query params)
    event = {}
    try:
        event = {
            "name": sys.argv[1],
            "age": sys.argv[2],
            "cgpa": sys.argv[3],
        }
    except IndexError:
        pass

    context = {}
    print(hello(event, context))
