def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    return a / b


def print_menu():
    print("\n--- Calculator Menu ---")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    print("5. Show history")
    print("6. Quit")
    print("-----------------------")


def main():
    print("Welcome to the Python Calculator!")
    history = []

    while True:
        print_menu()
        choice = input("Your choice: ").strip()

        if choice in ("1", "2", "3", "4"):
            try:
                first_number = float(input("Enter the first number: "))
                second_number = float(input("Enter the second number: "))
            except ValueError:
                print("Please type a number, not a word.")
                continue

            if choice == "1":
                result = add(first_number, second_number)
                symbol = "+"
            elif choice == "2":
                result = subtract(first_number, second_number)
                symbol = "-"
            elif choice == "3":
                result = multiply(first_number, second_number)
                symbol = "*"
            elif choice == "4":
                if second_number == 0:
                    print("Error: Cannot divide by zero.")
                    continue
                result = divide(first_number, second_number)
                symbol = "/"

            answer = round(result, 2)
            entry = f"{first_number} {symbol} {second_number} = {answer}"
            print(f"Answer: {answer}")
            history.append(entry)

        elif choice == "5":
            if not history:
                print("No calculations yet.")
            else:
                print("\n--- History ---")
                for entry in history:
                    print(entry)

        elif choice == "6":
            print("Goodbye!")
            break

        else:
            print("Please pick a number from 1 to 6.")


if __name__ == "__main__":
    main()
