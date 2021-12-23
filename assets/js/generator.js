// Identify HTML element
const input = document.querySelector("input");
const start = document.querySelector("#start");
const next = document.querySelector("#next");
const clear = document.querySelector("#clear");
const currentNumber = document.querySelector("#current-number");
const pastNumbersList = document.querySelector("#past-numbers");
const finishedMessage = document.querySelector("#finished-message");

const showButtons = () => {
    start.innerText = "Restart";
    
    next.classList.remove("hide");

    clear.classList.remove("hide");
}

const liArrayLoop = array => {
    array.forEach(item => {
        const newBullet = document.createElement("li");

        newBullet.innerText = item;

        pastNumbersList.appendChild(newBullet);
    })
}

// Future features: create function to check if data's already in localStorage to then backfill content (persists if user refreshes by accident)
const inProgress = () => {
    const outerLimit = JSON.parse(localStorage.getItem("outerLimit"));

    if (outerLimit) {
        showButtons();

        input.value = outerLimit;

        currentNumber.innerText = JSON.parse(localStorage.getItem("currentNumber"));

        const pastNumbersArr = JSON.parse(localStorage.getItem("pastNumbersArr"));

        pastNumbersList.innerHTML = "";

        liArrayLoop(pastNumbersArr);
    }
}

const bingoNumbers = [];

const generateBingoNumbers = () => {
    // Populate B1-15 in array
    for (let i = 1; i < 16; i++) {
        bingoNumbers.push(`B${i}`);
    }

    // Populate I16-30 in array 
    for (let i = 16; i < 31; i++) {
        bingoNumbers.push(`I${i}`);
    }

    // Populate N31-N45 in array 
    for (let i = 31; i < 46; i++) {
        bingoNumbers.push(`N${i}`);
    }

    // Populate G46-60 in array 
    for (let i = 46; i < 61; i++) {
        bingoNumbers.push(`G${i}`);
    }

    // Populate O61-75 in array 
    for (let i = 61; i < 76; i++) {
        bingoNumbers.push(`O${i}`);
    }
};

const selectBingoNumber = () => {
    // Stops generator once all numbers have been called
    if (bingoNumbers.length === 0) {
        finishedMessage.classList.remove("hide");

        next.classList.add("hide");
    } else {
        // Maximum range of random numbers is 0-74 to align with indexes of bingoNumbers
        const randomIndex = Math.floor(Math.random() * bingoNumbers.length);

        // Removes 1 number, starting at randomIndex and returns result to display
        const output = bingoNumbers.splice(randomIndex, 1);

        currentNumber.innerText = output;
    }
}

// Declare start + variable capture function
const startGenerating = () => {
    const outerLimit = parseInt(input.value);

    if (!outerLimit) {
        alert("Please enter a number in the text box")
    } else {
        // Clearing any previous numbers and exposing buttons
        if (currentNumber.innerText) {
            // Clears any existing values from previous calls
            currentNumber.innerText = "";
        }

        if (pastNumbersList.innerHTML) {
            // Clear bullet points for new numbers
            pastNumbersList.innerHTML = "";
        }

        if (start.innerText === "Start") {
            start.innerText = "Restart";
        }

        if (next.classList.contains("hide")) {
            next.classList.remove("hide");
        }

        if (clear.classList.contains("hide")) {
            clear.classList.remove("hide");
        }

        // Creates new empty past numbers array
        const pastNumbersArr = [];
        
        // Adds empty array to localStorage
        localStorage.setItem("pastNumbersArr", JSON.stringify(pastNumbersArr));

        // Store outerLimit in localStorage
        localStorage.setItem("outerLimit", JSON.stringify(outerLimit));

        // Call generator
        generate();
    }
}

// Declare generator function
const generate = () => {
    // Pull outerLimit from localStorage
    const outerLimit = JSON.parse(localStorage.getItem("outerLimit"));

    // Persist values in localStorage
    if (currentNumber.innerText) {
        const pastNumbersArr = JSON.parse(localStorage.getItem("pastNumbersArr"));

        // Store past number in front of list so bullet points display newest number FIRST
        pastNumbersArr.unshift(currentNumber.innerText);

        pastNumbersList.innerHTML = "";

        // Loop through array to create bullet points
        liArrayLoop(pastNumbersArr);

        localStorage.setItem("pastNumbersArr", JSON.stringify(pastNumbersArr));
    }

    // Add 1 to ensure lowest value will always be 1, not 0
    const output = Math.floor(Math.random() * outerLimit) + 1;

    currentNumber.innerText = output;

    localStorage.setItem("currentNumber", JSON.stringify(output));
}

// Clears existing values from input field and displays and hides buttons
const clearValues = () => {
    input.value = "";
    currentNumber.innerText = "";
    pastNumbersList.innerHTML = "";
    start.innerText = "Start";
    next.classList.add("hide");
    clear.classList.add("hide");

    // Clear local storage values so they don't perpetuate between sessions
    localStorage.clear();
}

start.addEventListener("click", startGenerating);
next.addEventListener("click", generate);
clear.addEventListener("click", clearValues);

inProgress();
generateBingoNumbers();

for (let i = 0; i < 76; i ++) {
    selectBingoNumber();
    console.log(bingoNumbers);
}