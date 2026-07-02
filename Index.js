document.addEventListener('DOMContentLoaded', () => {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]");
    const copyMsg = document.querySelector("[data-copyMsg]");
    const copyTrigger = document.querySelector('.display-container button');
    const uppercaseCheck = document.querySelector("[data-uppercase]");
    const lowercaseCheck = document.querySelector("[data-lowercase]");
    const numbersCheck = document.querySelector("[data-numbers]");
    const symbolsCheck = document.querySelector("[data-symbols]");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generateButton");
    const allCheckbox = document.querySelectorAll("input[type='checkbox']");

    let password = "";
    let passwordLength = 10;
    let checkCount = 1;

    function handleSlider() {
        if (inputSlider) inputSlider.value = passwordLength;
        if (lengthDisplay) lengthDisplay.innerText = passwordLength;
    }

    function setIndicator(color) {
        if (indicator) indicator.style.backgroundColor = color;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const symbols = `!@#$%^&*()_+{}[]:;<>,.?/|`;
    return symbols[getRndInteger(0, symbols.length)];
}

    function calcStrength() {
        let hasUpper = false
        let hasLower = false
        let hasNum = false
        let hasSym = false

        if (uppercaseCheck && uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck && lowercaseCheck.checked) hasLower = true;
        if (numbersCheck && numbersCheck.checked) hasNum = true;
        if (symbolsCheck && symbolsCheck.checked) hasSym = true;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0");
        }   else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0");
        }  else {
            setIndicator("#f00");
        }
    }

    async function copyContent() {
        const textToCopy = (passwordDisplay && passwordDisplay.value) ? passwordDisplay.value : password;
        let ok = false;
        try {
            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
                ok = true;
            }
        } catch (e) {
            ok = false;
        }

        // Fallback for file:// or older browsers
        if (!ok) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                ok = successful;
            } catch (e) {
                ok = false;
            }
        }

        if (copyMsg) copyMsg.innerText = ok ? 'Copied' : 'Failed';
        if (copyMsg) {
            copyMsg.classList.add('active');
            setTimeout(() => copyMsg.classList.remove('active'), 2000);
        }
    }

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckbox.forEach((checkbox) => {
            if (checkbox.checked) {
                checkCount++;
            }
        });

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    allCheckbox.forEach((checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    });

    if (inputSlider) {
        inputSlider.addEventListener('input', (e) => {
            passwordLength = Number(e.target.value);
            handleSlider();
        });
    }

    if (copyTrigger) {
        copyTrigger.addEventListener('click', () => {
            if (passwordDisplay && (passwordDisplay.value || password)) {
                copyContent();
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (checkCount <= 0) return;
            if (passwordLength < checkCount) {
                passwordLength = checkCount;
                handleSlider();
            }

            password = "";

            let funcArr = [];
            if (uppercaseCheck && uppercaseCheck.checked) funcArr.push(generateUpperCase);
            if (lowercaseCheck && lowercaseCheck.checked) funcArr.push(generateLowerCase);
            if (numbersCheck && numbersCheck.checked) funcArr.push(generateRandomNumber);
            if (symbolsCheck && symbolsCheck.checked) funcArr.push(generateSymbol);
            
            // Compulsory addition
            for (let i = 0; i < funcArr.length; i++) {
                password += funcArr[i]();
            }

            // Remaining addition
            for (let i = 0; i < passwordLength - funcArr.length; i++) {
                let randIndex = getRndInteger(0, funcArr.length);
                password += funcArr[randIndex]();
            }

            password = shufflePassword(Array.from(password));
            if (passwordDisplay) passwordDisplay.value = password;
            calcStrength();
        });
    }

    // initial setup
    handleSlider();
    setIndicator("#ccc");
});

     