import { useEffect, useState } from "react";

const keys = [
  ["C", "DEL", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function App() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const inputDigit = (digit) => {
    if (display === "Error") {
      setDisplay(digit);
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (waitingForSecondValue) {
      setDisplay(digit);
      setWaitingForSecondValue(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (display === "Error") {
      setDisplay("0.");
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    if (waitingForSecondValue) {
      setDisplay("0.");
      setWaitingForSecondValue(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display === "0" ? "0." : display + ".");
    }
  };

  const clearCalculator = () => {
    setDisplay("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  };

  const deleteLast = () => {
    if (display === "Error") return clearCalculator();

    if (display.length <= 1) {
      setDisplay("0");
      return;
    }

    const updated = display.slice(0, -1);
    setDisplay(updated);
  };

  const performCalculation = (a, b, op) => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        if (b === 0) return "Error";
        return a / b;
      default:
        return b;
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = Number(display);

    if (display === "Error") return;

    if (firstValue === null) {
      setFirstValue(inputValue);
    } else if (operator) {
      const result = performCalculation(firstValue, inputValue, operator);

      if (result === "Error") {
        setDisplay("Error");
        setFirstValue(null);
        setOperator(null);
        setWaitingForSecondValue(false);
        return;
      }

      setDisplay(String(result));
      setFirstValue(result);
    }

    setWaitingForSecondValue(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (firstValue === null || operator === null) return;

    const secondValue = Number(display);
    const result = performCalculation(firstValue, secondValue, operator);

    if (result === "Error") {
      setDisplay("Error");
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
      return;
    }

    setDisplay(String(result));
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecondValue(false);
  };

  const handlePercent = () => {
    const value = Number(display);
    if (Number.isNaN(value)) {
      setDisplay("Error");
      return;
    }
    setDisplay(String(value / 100));
  };

  const handleButtonPress = (key) => {
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(key)) {
      inputDigit(key);
      return;
    }

    if (key === ".") {
      inputDecimal();
      return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
      handleOperator(key);
      return;
    }

    if (key === "=") {
      handleEquals();
      return;
    }

    if (key === "C") {
      clearCalculator();
      return;
    }

    if (key === "DEL") {
      deleteLast();
      return;
    }

    if (key === "%") {
      handlePercent();
    }
  };

  useEffect(() => {
    const handleKeyboard = (event) => {
      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        handleButtonPress(key);
      } else if (["+", "-", "*", "/", "."].includes(key)) {
        handleButtonPress(key);
      } else if (key === "Enter" || key === "=") {
        handleButtonPress("=");
      } else if (key === "Backspace") {
        handleButtonPress("DEL");
      } else if (key === "Escape") {
        handleButtonPress("C");
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [display, firstValue, operator, waitingForSecondValue]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
          <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 px-6 py-8 text-white sm:px-10">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
                React Calculator Project
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-5xl">
                Calculator App
              </h1>
            </div>
          </header>

          <main className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-inner sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Calculator
                </h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Live
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4 shadow-xl sm:p-5">
                <div className="mb-4 min-h-[100px] rounded-xl bg-slate-800 p-4 text-right text-white">
                  <p className="break-all text-xs text-slate-300">
                    {firstValue !== null && operator ? `${firstValue} ${operator}` : ""}
                  </p>
                  <p className="mt-2 break-all text-3xl font-bold sm:text-4xl">
                    {display}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {keys.flat().map((key) => {
                    const isOperator = ["+", "-", "*", "/", "%"].includes(key);
                    const isEquals = key === "=";
                    const isClear = key === "C";
                    const isDelete = key === "DEL";
                    const isZero = key === "0";

                    let buttonClass =
                      "bg-slate-200 text-slate-800 hover:bg-slate-300";

                    if (isOperator) {
                      buttonClass = "bg-cyan-500 text-white hover:bg-cyan-600";
                    }
                    if (isEquals) {
                      buttonClass = "bg-emerald-500 text-white hover:bg-emerald-600";
                    }
                    if (isClear) {
                      buttonClass = "bg-red-500 text-white hover:bg-red-600";
                    }
                    if (isDelete) {
                      buttonClass = "bg-slate-500 text-white hover:bg-slate-600";
                    }
                    if (isZero) {
                      buttonClass = "bg-slate-200 text-slate-800 hover:bg-slate-300";
                    }

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleButtonPress(key)}
                        className={`rounded-xl border text-lg font-semibold shadow-sm hover:shadow-md ${buttonClass}`}
                        aria-label={key}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="rounded-3xl border border-slate-200 bg-slate-100 p-5 shadow-inner">
              <h3 className="mb-4 text-xl font-bold text-slate-800">
                How to Use
              </h3>

              <ol className="space-y-4 text-sm leading-7 text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">1.</span> Enter
                  numbers using the on-screen buttons or your keyboard.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">2.</span> Tap an
                  operator such as +, -, *, or / to perform an arithmetic operation.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">3.</span> Press
                  = to calculate the result instantly.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">4.</span> Use C
                  to reset the calculator and DEL to remove the last entry.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">5.</span> Division
                  by zero is prevented with a clear error message.
                </li>
              </ol>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white shadow-lg">
                <h4 className="text-lg font-bold">Supported Operations</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>• Addition</li>
                  <li>• Subtraction</li>
                  <li>• Multiplication</li>
                  <li>• Division</li>
                  <li>• Decimal numbers</li>
                </ul>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
