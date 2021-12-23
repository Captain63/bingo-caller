// Identify HTML element
const start = document.querySelector("#start");
const next = document.querySelector("#next");
const currentNumber = document.querySelector("#current-number");
const pastNumbersList = document.querySelector("#past-numbers");
const finishedMessage = document.querySelector("#finished-message");

const configureLocalStorage = () => {
    // If currentNumber doesn't already exist in local storage
    if (!localStorage.getItem("currentNumber")) {
        localStorage.setItem("currentNumber", JSON.stringify([]));
    }

    if (!localStorage.getItem("pastNumbersArr")) {
        localStorage.setItem("pastNumbersArr", JSON.stringify([]));
    }
}

const bingoNumbersMaster = [];

const generateBingoNumbers = () => {
    // Populate B1-15 in array
    for (let i = 1; i < 16; i++) {
        bingoNumbersMaster.push(`B${i}`);
    }

    // Populate I16-30 in array 
    for (let i = 16; i < 31; i++) {
        bingoNumbersMaster.push(`I${i}`);
    }

    // Populate N31-N45 in array 
    for (let i = 31; i < 46; i++) {
        bingoNumbersMaster.push(`N${i}`);
    }

    // Populate G46-60 in array 
    for (let i = 46; i < 61; i++) {
        bingoNumbersMaster.push(`G${i}`);
    }

    // Populate O61-75 in array 
    for (let i = 61; i < 76; i++) {
        bingoNumbersMaster.push(`O${i}`);
    }
};

const liArrayLoop = array => {
    array.forEach(item => {
        const newBullet = document.createElement("li");

        newBullet.innerText = item;

        pastNumbersList.appendChild(newBullet);
    })
}

const checkFinished = () => {
    const pastNumbersArr = JSON.parse(localStorage.getItem("pastNumbersArr"));

    // Stops generator once all numbers have been called
    if (pastNumbersArr.length === 74) {
        start.innerText = "Restart";

        finishedMessage.classList.remove("hide");

        next.classList.add("hide");

        currentNumber.innerText = JSON.parse(localStorage.getItem("currentNumber"));

        return true;
    }
}

const inProgress = () => {
    const currentNumberValue = JSON.parse(localStorage.getItem("currentNumber"));

    if (currentNumberValue.length !== 0) {
        start.innerText = "Restart";
    
        next.classList.remove("hide");

        currentNumber.innerText = currentNumberValue;

        const pastNumbersArr = JSON.parse(localStorage.getItem("pastNumbersArr"));

        pastNumbersList.innerHTML = "";

        liArrayLoop(pastNumbersArr);
    }

    checkFinished();
}

// Declare generator function
const storePreviousNumber = () => {
    const pastNumbersArr = JSON.parse(localStorage.getItem("pastNumbersArr"));

    // Store past number in front of list so bullet points display newest number FIRST
    pastNumbersArr.unshift(currentNumber.innerText);

    pastNumbersList.innerHTML = "";

    // Loop through array to create bullet points
    liArrayLoop(pastNumbersArr);

    localStorage.setItem("pastNumbersArr", JSON.stringify(pastNumbersArr));
}

const selectBingoNumber = () => {
    if (checkFinished()) {
        // Stops execution to avoid displaying Next button
        return;
    }

    // Stores previous number in localStorage before it's overwritten
    if (currentNumber.innerText) {
        storePreviousNumber();
    }

    const bingoNumbers = JSON.parse(localStorage.getItem("bingoNumbers"));

    // Maximum range of random numbers is 0-74 to align with indexes of bingoNumbers
    const randomIndex = Math.floor(Math.random() * bingoNumbers.length);

    // Removes 1 number, starting at randomIndex and returns result to display
    const output = bingoNumbers.splice(randomIndex, 1);

    currentNumber.innerText = output;

    localStorage.setItem("currentNumber", JSON.stringify(output));

    localStorage.setItem("bingoNumbers", JSON.stringify(bingoNumbers));
}

// Declare start + variable capture function
const startGenerating = () => {
    // Each time sequence is restarted, bingoNumbers array is overwritten with master values and persisted in localStorage
    localStorage.setItem("bingoNumbers", JSON.stringify([...bingoNumbersMaster]));

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

    finishedMessage.classList.add("hide");

    // Creates new empty past numbers array
    const pastNumbersArr = [];
        
    // Adds empty array to localStorage
    localStorage.setItem("pastNumbersArr", JSON.stringify(pastNumbersArr));

    // Call generator
    selectBingoNumber();
}

start.addEventListener("click", startGenerating);
next.addEventListener("click", selectBingoNumber);

configureLocalStorage();
generateBingoNumbers();
inProgress();

// Automated testing suite
// startGenerating();

// for (let i = 0; i < 76; i++) {
//     selectBingoNumber();
//     console.log(i);
// }