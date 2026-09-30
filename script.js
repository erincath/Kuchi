/* =========================================================
   Y2K ANIME CALCULATOR
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const display =
    document.getElementById("display");

const historyDisplay =
    document.getElementById("history");

const calculator =
    document.querySelector(".calculator");


const numberButtons =
    document.querySelectorAll(".number");

const operatorButtons =
    document.querySelectorAll(".operator");

const actionButtons =
    document.querySelectorAll("[data-action]");


/* =========================================================
   CALCULATOR STATE
   ========================================================= */

let currentValue = "0";

let previousValue = null;

let operator = null;

let waitingForOperand = false;


/* =========================================================
   Y2K PARTICLES
   ========================================================= */

const glitterCharacters = [

    "✦",
    "✧",
    "★",
    "☆",
    "⋆",
    "✩",
    "♡",
    "♥",
    "◆",
    "◇",
    "✿"

];


const glitterColors = [

    "#ff4fa3",
    "#ffeb5c",
    "#ffffff",
    "#62eaff",
    "#a875ff",
    "#ff8bd4"

];


/* =========================================================
   UPDATE DISPLAY
   ========================================================= */

function updateDisplay() {

    display.textContent =
        formatNumber(currentValue);


    display.classList.remove("pop");


    void display.offsetWidth;


    display.classList.add("pop");
}


/* =========================================================
   FORMAT NUMBER
   ========================================================= */

function formatNumber(value) {

    if (value === "Error") {

        return "ERROR";
    }


    if (value === "") {

        return "0";
    }


    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "ERROR";
    }


    if (Math.abs(number) >= 1e12) {

        return number.toExponential(6);
    }


    if (value.includes(".")) {

        const parts =
            value.split(".");


        const integer =
            parts[0];

        const decimal =
            parts[1];


        const formattedInteger =
            Number(integer)
                .toLocaleString("en-US");


        return (
            formattedInteger +
            "." +
            decimal
        );
    }


    return number.toLocaleString("en-US");
}


/* =========================================================
   INPUT NUMBER
   ========================================================= */

function inputNumber(number) {

    if (currentValue === "Error") {

        clearCalculator();
    }


    if (waitingForOperand) {

        currentValue =
            number;

        waitingForOperand =
            false;

    } else {

        if (currentValue === "0") {

            currentValue =
                number;

        } else {

            currentValue += number;
        }
    }


    updateDisplay();
}


/* =========================================================
   DECIMAL
   ========================================================= */

function inputDecimal() {

    if (currentValue === "Error") {

        clearCalculator();
    }


    if (waitingForOperand) {

        currentValue =
            "0.";

        waitingForOperand =
            false;

    } else if (
        !currentValue.includes(".")
    ) {

        currentValue += ".";
    }


    updateDisplay();
}


/* =========================================================
   CHOOSE OPERATOR
   ========================================================= */

function chooseOperator(nextOperator) {

    if (currentValue === "Error") {

        return;
    }


    const inputValue =
        Number(currentValue);


    if (
        operator &&
        waitingForOperand
    ) {

        operator =
            nextOperator;

        updateHistory();

        return;
    }


    if (previousValue === null) {

        previousValue =
            inputValue;

    } else if (operator) {

        const result =
            calculate(
                previousValue,
                inputValue,
                operator
            );


        if (result === "Error") {

            showError();

            return;
        }


        currentValue =
            String(result);


        previousValue =
            result;
    }


    operator =
        nextOperator;


    waitingForOperand =
        true;


    updateHistory();
}


/* =========================================================
   CALCULATE
   ========================================================= */

function calculate(
    first,
    second,
    operation
) {

    switch (operation) {

        case "+":

            return first + second;


        case "-":

            return first - second;


        case "*":

            return first * second;


        case "/":

            if (second === 0) {

                return "Error";
            }

            return first / second;


        default:

            return second;
    }
}


/* =========================================================
   CALCULATE RESULT
   ========================================================= */

function calculateResult() {

    if (
        operator === null ||
        previousValue === null ||
        currentValue === "Error"
    ) {

        return;
    }


    const secondValue =
        Number(currentValue);


    const result =
        calculate(
            previousValue,
            secondValue,
            operator
        );


    if (result === "Error") {

        showError();

        return;
    }


    const oldExpression =
        `${formatNumber(
            String(previousValue)
        )} ${getOperatorSymbol(
            operator
        )} ${formatNumber(
            String(secondValue)
        )}`;


    historyDisplay.textContent =
        `${oldExpression} =`;


    currentValue =
        String(
            Number(
                result.toFixed(12)
            )
        );


    previousValue =
        null;


    operator =
        null;


    waitingForOperand =
        true;


    updateDisplay();


    calculator.classList.add(
        "result-bounce"
    );


    setTimeout(() => {

        calculator.classList.remove(
            "result-bounce"
        );

    }, 300);
}


/* =========================================================
   OPERATOR SYMBOL
   ========================================================= */

function getOperatorSymbol(
    operation
) {

    const symbols = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷"

    };


    return (
        symbols[operation] ||
        operation
    );
}


/* =========================================================
   UPDATE HISTORY
   ========================================================= */

function updateHistory() {

    if (
        previousValue !== null &&
        operator
    ) {

        historyDisplay.textContent =
            `${formatNumber(
                String(previousValue)
            )} ${
                getOperatorSymbol(operator)
            }`;
    }
}


/* =========================================================
   CLEAR
   ========================================================= */

function clearCalculator() {

    currentValue =
        "0";


    previousValue =
        null;


    operator =
        null;


    waitingForOperand =
        false;


    historyDisplay.textContent =
        "";


    updateDisplay();


    calculator.classList.remove(
        "shake"
    );


    void calculator.offsetWidth;


    calculator.classList.add(
        "shake"
    );


    setTimeout(() => {

        calculator.classList.remove(
            "shake"
        );

    }, 250);
}


/* =========================================================
   DELETE
   ========================================================= */

function deleteNumber() {

    if (
        waitingForOperand ||
        currentValue === "Error"
    ) {

        return;
    }


    if (currentValue.length <= 1) {

        currentValue =
            "0";

    } else {

        currentValue =
            currentValue.slice(
                0,
                -1
            );
    }


    updateDisplay();
}


/* =========================================================
   PERCENT
   ========================================================= */

function percentage() {

    if (currentValue === "Error") {

        return;
    }


    const value =
        Number(currentValue);


    currentValue =
        String(
            value / 100
        );


    updateDisplay();
}


/* =========================================================
   PLUS / MINUS
   ========================================================= */

function toggleSign() {

    if (
        currentValue === "0" ||
        currentValue === "Error"
    ) {

        return;
    }


    currentValue =
        currentValue.startsWith("-")
            ? currentValue.slice(1)
            : "-" + currentValue;


    updateDisplay();
}


/* =========================================================
   ERROR
   ========================================================= */

function showError() {

    currentValue =
        "Error";


    previousValue =
        null;


    operator =
        null;


    waitingForOperand =
        true;


    updateDisplay();


    calculator.classList.remove(
        "shake"
    );


    void calculator.offsetWidth;


    calculator.classList.add(
        "shake"
    );


    setTimeout(() => {

        calculator.classList.remove(
            "shake"
        );

    }, 250);
}


/* =========================================================
   FALLING GLITTER
   ========================================================= */

function createFallingGlitter() {

    /*
     * Number of falling particles.
     */

    const amount = 10;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const glitter =
            document.createElement("div");


        glitter.classList.add(
            "click-glitter"
        );


        /* Random size */

        const sizes = [

            "small",
            "medium",
            "large"

        ];


        glitter.classList.add(
            sizes[
                Math.floor(
                    Math.random() *
                    sizes.length
                )
            ]
        );


        /* Random symbol */

        glitter.textContent =
            glitterCharacters[
                Math.floor(
                    Math.random() *
                    glitterCharacters.length
                )
            ];


        /* Random color */

        glitter.style.color =
            glitterColors[
                Math.floor(
                    Math.random() *
                    glitterColors.length
                )
            ];


        /* Random horizontal position */

        glitter.style.left =
            Math.random() * 100 +
            "vw";


        /* Random falling duration */

        const fallTime =
            2.5 +
            Math.random() * 2.5;


        glitter.style.setProperty(
            "--fall-time",
            fallTime + "s"
        );


        /* Random spin */

        glitter.style.setProperty(
            "--spin-time",
            (
                1 +
                Math.random() * 2
            ) + "s"
        );


        /* Random sideways drift */

        const drift =
            -100 +
            Math.random() * 200;


        glitter.style.setProperty(
            "--drift",
            drift + "px"
        );


        /* Random animation delay */

        glitter.style.animationDelay =
            (
                Math.random() * .35
            ) + "s";


        document.body.appendChild(
            glitter
        );


        /* Remove particle */

        setTimeout(() => {

            glitter.remove();

        }, (fallTime + .5) * 1000);
    }
}


/* =========================================================
   CLICK BURST
   ========================================================= */

function createClickBurst(button) {

    const rect =
        button.getBoundingClientRect();


    const burstCharacters = [

        "✦",
        "✧",
        "★",
        "♡"

    ];


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const particle =
            document.createElement("div");


        particle.classList.add(
            "click-burst"
        );


        particle.textContent =
            burstCharacters[
                Math.floor(
                    Math.random() *
                    burstCharacters.length
                )
            ];


        particle.style.color =
            glitterColors[
                Math.floor(
                    Math.random() *
                    glitterColors.length
                )
            ];


        particle.style.left =
            rect.left +
            rect.width / 2 +
            "px";


        particle.style.top =
            rect.top +
            rect.height / 2 +
            "px";


        /* Random direction */

        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            30 +
            Math.random() *
            45;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        particle.style.setProperty(
            "--burst-x",
            x + "px"
        );


        particle.style.setProperty(
            "--burst-y",
            y + "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(() => {

            particle.remove();

        }, 600);
    }
}


/* =========================================================
   BUTTON CLICK EVENTS
   ========================================================= */

numberButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    button.dataset.number
                ) {

                    inputNumber(
                        button.dataset.number
                    );

                } else if (
                    button.dataset.action ===
                    "decimal"
                ) {

                    inputDecimal();
                }


                createClickBurst(
                    button
                );


                createFallingGlitter();
            }
        );
    }
);


/* =========================================================
   OPERATOR BUTTONS
   ========================================================= */

operatorButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperator(
                    button.dataset.operator
                );


                createClickBurst(
                    button
                );


                createFallingGlitter();
            }
        );
    }
);


/* =========================================================
   ACTION BUTTONS
   ========================================================= */

actionButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "clear":

                        clearCalculator();

                        break;


                    case "delete":

                        deleteNumber();

                        break;


                    case "percent":

                        percentage();

                        break;


                    case "sign":

                        toggleSign();

                        break;


                    case "equals":

                        calculateResult();

                        break;
                }


                createClickBurst(
                    button
                );


                createFallingGlitter();
            }
        );
    }
);


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        /* Numbers */

        if (/^[0-9]$/.test(key)) {

            inputNumber(key);


            pressMatchingButton(
                `[data-number="${key}"]`
            );


            createFallingGlitter();


            return;
        }


        /* Decimal */

        if (key === ".") {

            inputDecimal();


            pressMatchingButton(
                `[data-action="decimal"]`
            );


            createFallingGlitter();


            return;
        }


        /* Operators */

        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);


            pressMatchingButton(
                `[data-operator="${key}"]`
            );


            createFallingGlitter();


            return;
        }


        /* Equals */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculateResult();


            pressMatchingButton(
                `[data-action="equals"]`
            );


            createFallingGlitter();


            return;
        }


        /* Clear */

        if (key === "Escape") {

            clearCalculator();


            pressMatchingButton(
                `[data-action="clear"]`
            );


            createFallingGlitter();


            return;
        }


        /* Delete */

        if (key === "Backspace") {

            deleteNumber();


            pressMatchingButton(
                `[data-action="delete"]`
            );


            createFallingGlitter();


            return;
        }


        /* Percentage */

        if (key === "%") {

            percentage();


            pressMatchingButton(
                `[data-action="percent"]`
            );


            createFallingGlitter();
        }

    }
);


/* =========================================================
   KEYBOARD BUTTON ANIMATION
   ========================================================= */

function pressMatchingButton(
    selector
) {

    const button =
        document.querySelector(
            selector
        );


    if (!button) {

        return;
    }


    button.classList.add(
        "pressed"
    );


    setTimeout(() => {

        button.classList.remove(
            "pressed"
        );

    }, 120);
}


/* =========================================================
   INITIAL DISPLAY
   ========================================================= */

updateDisplay();
