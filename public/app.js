const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');

// Theme selection.
const toggleSwtich = document.querySelector('.switch input[type="checkbox"]')
const switchTheme = (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    }
}
toggleSwtich.addEventListener('change', switchTheme, false)

// get any previous theme from local storage and update.
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
    if (currentTheme === 'dark') {
        toggleSwtich.checked = true
    }
}

let wordle = '' 
let currentRow = 0
let currentTile = 0
let hasGuessedCorrect = false 
let wordleSet = false

const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "<"
];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

// get a new wordle
const GetWordle = () => {
    // Rapid API random word 
    fetch(`http://localhost:3001/word`)
        .then(response => response.json())
        .then(json => {
            SetWordle(json[0])
            return true 
    })
}

// Get the wordle from the backend
const SetWordle = (target) => {
    wordle = target.toUpperCase();
    wordleSet = true
}
GetWordle()

// build the tiles
guessRows.forEach((guessRow, guessRowIdx) => {
    const guessDiv = document.createElement('div');
    guessDiv.setAttribute('id', 'guessRow-' + guessRowIdx)

    guessRow.forEach((guess, guessIdx) => {
        const tileElement = document.createElement('div',)
        tileElement.setAttribute('id', 'guessRow-' + guessRowIdx + '-tile-' + guessIdx)
        tileElement.classList.add('tile')
        guessDiv.append(tileElement)
    })

    tileDisplay.append(guessDiv);
})

// build the keyboard
keys.forEach(key => {
    const button_element = document.createElement('button')
    button_element.textContent = key
    button_element.setAttribute('id', key)
    button_element.addEventListener('click', () => handleClick(key))
    keyboard.append(button_element)
})


// on keyboard click
const handleClick = (key) =>  {
    if (!wordleSet) {
        console.log("Wait till the wordle has been set.")
        return
    }
    if (key ==="<") {
        deleteLetter()
        return
    }
    addLetter(key)
}

// Clear the current row and do not move to the next.
const resetRow = () => {
    displayMsg("Word not in dictionary.", 2000)
    guessRows[currentRow].forEach((letter, letterIdx) => {
        let keyboardKey = document.getElementById(letter)
        const tileElement = document.getElementById('guessRow-' + currentRow + '-tile-' + letterIdx)
        tileElement.textContent = '' 
        currentTile = 0
    });
}

// check to see if we entered a valid five letter word.
const checkGuess = () => {
    let this_guess = guessRows[currentRow].join('')
    // Rapid API word dictionary
    fetch(`http://localhost:3001/check/?word=${this_guess}`)
        .then(response => response.json())
        .then(json => {
            if (json == 'Entry word not found') {
                resetRow()
                return;
            } else if (json == 'Success') {
                revealRow()
            }
        })
}

// flip a stlyle based on the guessed letter.
const flipStyle = (letter, letterIdx) => {
    let keyboardKey = document.getElementById(letter)
    const tileElement = document.getElementById('guessRow-' + currentRow + '-tile-' + letterIdx)

    setTimeout(() => {
        tileElement.classList.add('reveal')
        if (wordle.includes(letter)) {
            tileElement.classList.add('present')
            keyboardKey.classList.add('present')
        } else {
            tileElement.classList.add('incorrect')
            keyboardKey.classList.add('incorrect')
        }
        if (letter === wordle[letterIdx]) {
            tileElement.classList.add('correct')
            keyboardKey.classList.add('correct')
        }
    }, 500 * letterIdx)
}

// once a word has been established as being valid reveal the row.
const revealRow = () => {
    guessRows[currentRow].forEach((letter, letterIdx) => {
        flipStyle(letter, letterIdx)
    })

    let guess = guessRows[currentRow].join('')

    if (guess == wordle) {
        hasGuessedCorrect = true
        displayMsg("Congratulations! you guessed correctly.", 0)
    } else {
        currentRow++
        currentTile = 0
    }

    if ((currentRow >= guessRows.length) && !hasGuessedCorrect) {
        displayMsg(`Bad Luck, the correct word was: ${wordle}`, 0)
    }

}

// display a status msg.
const displayMsg = (msgText, timeout) => {
        const msg = document.querySelector('.message-container')
        msg.style.display = "block"
        const messageElement = document.createElement('p')
        messageElement.textContent = msgText 
        msg.append(messageElement)
        if (timeout > 0) {
            setTimeout(() => messageElement.remove(), timeout)
        }
}

const addLetter = (letter) => {

    if((currentTile < 5) && (letter === 'ENTER')) {
        return
    }

    if (currentTile == 5) {
        if (letter === 'ENTER') {
            checkGuess();
        }
        return
    }

    const tileElement = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tileElement.textContent = letter
    guessRows[currentRow][currentTile] = letter

    currentTile++
}

const deleteLetter = () => {
    if (currentRow < 5 && currentTile > 0) {
        currentTile--
        const tileElement = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tileElement.textContent = ""
        guessRows[currentRow][currentTile] = ""
    }
}
