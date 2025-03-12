/**
shuffle()
Shuffle the contents of an array depending the datatype of the source
Makes a copy. Does NOT shuffle the original.
Scrambled Array or string
*/
const { useState, useEffect } = React;

function shuffle(src) {
    const copy = [...src];
    const length = copy.length;
    for (let i = 0; i < length; i++) {
        const x = copy[i];
        const y = Math.floor(Math.random() * length);
        const z = copy[y];
        copy[i] = z;
        copy[y] = x;
    }

    if (typeof src === 'string') {
        return copy.join('');
    }

    return copy;
}

const words = [
    'bacon', 
    'eggs', 
    'toast', 
    'cereal', 
    'juice', 
    'apple', 
    'orange', 
    'banana', 
    'pancake', 
    'waffle'
];

function ScrambleGame() {
    const [wordList, setWordList] = useState([...words]);
    const [current, setCurrent] = useState(() => shuffle([...words])[0]);
    const [wordScramble, setWordScramble] = useState(() => shuffle(current));
    const [guess, setGuess] = useState("");
    const [score, setScore] = useState(0);
    const [strike, setStrike] = useState(0);
    const [pass, setPass] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false); 
    useEffect(() => {
        const storedState = localStorage.getItem('scrambleGameState');
        if (storedState) {
            const { savedWordList, savedCurrent, savedWordScramble, savedScore, savedStrike, savedPass } = JSON.parse(storedState);
            setWordList(savedWordList);
            setCurrent(savedCurrent);
            setWordScramble(savedWordScramble);
            setScore(savedScore);
            setStrike(savedStrike);
            setPass(savedPass);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'scrambleGameState',
            JSON.stringify({ wordList, current, wordScramble, score, strike, pass })
        );
    }, [wordList, current, wordScramble, score, strike, pass]);

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setWin(false); 
        resetGame(false);
    };

    const passDealer = () => {
        if (pass > 0) {
            setPass(pass - 1);
            const newWordList = wordList.filter(word => word !== current);
            if (newWordList.length > 0) {
                const newWord = shuffle(newWordList)[0];
                setWordList(newWordList);
                setCurrent(newWord);
                setWordScramble(shuffle(newWord));
            } else {
                setGameOver(true);
                setWin(true);
            }
        }
    };

    const guessDealer = (e) => {
        e.preventDefault();
        if (guess.toLowerCase() === current.toLowerCase()) {
            setScore(score + 1);
            const newWordList = wordList.filter(word => word !== current);
            if (newWordList.length > 0) {
                const newWord = shuffle(newWordList)[0];
                setWordList(newWordList);
                setCurrent(newWord);
                setWordScramble(shuffle(newWord));
            } else {
                setGameOver(true);
                setWin(true);  
            }
        } else {
            setStrike(strike + 1);
            if (strike + 1 >= 3) {
                setGameOver(true);
                setWin(false); 
            }
        }
        setGuess("");
    };

    const resetGame = (resetGameStarted = true) => {
        setWordList([...words]);
        const newWord = shuffle([...words])[0];
        setCurrent(newWord);
        setWordScramble(shuffle(newWord));
        setGuess("");
        setScore(0);
        setStrike(0);
        setPass(3);
        setGameOver(false);
        if (resetGameStarted) {
            setGameStarted(false);
        }
        localStorage.removeItem('scrambleGameState');
    };

    if (gameOver) {
        return (
            <div className="game-over-screen">
                <h1>Game Over</h1>
                <p>Your Score: {score}</p>
                {win ? (
                    <p>Amazing job! You got everything right!</p>
                ) : (
                    <p>Better luck next time! You got too many wrong answers.</p>
                )}
                <button onClick={resetGame} className="blackButton">Play Again</button>
            </div>
        );
    }
    
    return (
        <div>
            <header>
                <h1>Play the Word Scramble Game!</h1>
                <p>To begin, click the Start Game button!</p>
            </header>
            <div id="container">
                {!gameStarted && (
                    <button onClick={startGame} className="pinkButton">
                        Start the Game
                    </button>
                )}
                {gameStarted && !gameOver && (
                    <>
                        <p>Your Scrambled Word is: {wordScramble}</p>
                        <form onSubmit={guessDealer}>
                            <input
                                type="text"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                            />
                            <button type="submit" className="blackButton">Enter</button>
                        </form>
                        <p>You have {pass} passes left!</p>
                        <button
                            onClick={passDealer}
                            disabled={pass <= 0}
                            className="blackButton" 
                        >
                            Pass
                        </button>
                        <div id="sideBySide">
                            <p>Points: {score}</p>
                            <p>Strikes: {strike}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}    

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ScrambleGame />);
