import sys
import time

def countto(n):
    i = 0
    start = time.time()
    while i < n:
        i += 1
    end = time.time()
    print(f"Done counting to {n} in {end - start:.2f} seconds.")

if __name__ == "__main__":
    try:
        target = int(sys.argv[1])
        countto(target)
    except IndexError:
        print("Usage: python count_to.py <number>")
    except ValueError:
        print("Please provide a valid number.")
