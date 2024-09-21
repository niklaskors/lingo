/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Grid } from '../components/Grid/Grid';
import { validateLetters } from '../utils/validateLetters';

export interface Validation {
  letter: string;
  status: "correct" | "present" | "absent"
}

export type Guess = {
  word: string;
  id: string;
  validation: Validation[];
  isActive: false
} | {
  word: string;
  validation: null
  isActive: true;
  id: string;
}

const COLUMNS = 6; // Max = 9
const ROWS = 9;

export function Game() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['words'], queryFn: async () => {
      const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${COLUMNS}`);
      const word: string[] = await response.json();
      console.log('The word is', word[0])
      return [...word]
    }
  });

  const [gameStatus, setGameStatus] = useState<'won' | 'lost' | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const correctWord = useMemo(() => {
    if (isLoading || !data) {
      return;
    }

    return data[Math.floor(Math.random() * data.length)]
  }, [data, isLoading]);

  const existsInDictionary = useCallback(async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const body = await response.json()

      if (body?.length && body[0].word === word) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }, []);

  const handleFinishedWord = useCallback(async (activeGuess: Guess) => {
    if (!await existsInDictionary(activeGuess.word)) {
      throw new Error('Invalid word');
    }

    const validation = validateLetters(activeGuess.word, correctWord!);
    activeGuess.isActive = false;
    activeGuess.validation = validation;

    return activeGuess;
  }, [correctWord, existsInDictionary]);

  const evaluateGame = useCallback(() => {
    const correctGuess = guesses.find((guess) => {
      if (!guess.validation) {
        return false;
      }

      if (guess.validation.every((val) => {
        return val.status === 'correct';
      })) {
        return true
      }
    });

    if (correctGuess) {
      setGameStatus('won')
    }

    if (guesses.length - 1 === ROWS) {
      setGameStatus('lost');
    }

  }, [guesses, setGameStatus]);

  const keyboardHandler = useCallback(async (e: KeyboardEvent) => {
    const activeGuessIndex = guesses.findIndex((guess) => guess.isActive);

    const key = e.key;
    const eventKeys = ['Backspace', 'Enter'];

    let activeGuess = guesses[activeGuessIndex] ?? {
      id: guesses.length.toString(),
      isActive: true,
      word: '',
      validation: null
    };

    if ((key.match(/^[a-z]$/) === null && !eventKeys.includes(key))) {
      return;
    }

    if (key === 'Enter') {
      if (activeGuess.word.length < COLUMNS) {
        return;
      }

      try {
        activeGuess = await handleFinishedWord(activeGuess);
        guesses[activeGuessIndex] = activeGuess;
        guesses.push({
          id: guesses.length.toString(),
          isActive: true,
          word: '',
          validation: null
        });
        setGuesses([...guesses]);
        evaluateGame();
      } catch (e) {
        //
      }
      return;
    }
    if (key === 'Backspace') {
      activeGuess.word = activeGuess.word.slice(0, -1);
      guesses[activeGuessIndex] = activeGuess;
      console.log('writing new', guesses)
      setGuesses([...guesses]);
      return;
    }

    if (activeGuess.word.length >= COLUMNS) {
      return;
    }

    activeGuess.word += key;
    guesses[activeGuessIndex > -1 ? activeGuessIndex : 0] = activeGuess;
    setGuesses([...guesses]);
  }, [setGuesses, guesses, handleFinishedWord, evaluateGame]);

  useEffect(() => {
    document.addEventListener("keydown", keyboardHandler, false);

    return () => {
      document.removeEventListener("keydown", keyboardHandler, false);
    }
  }, [keyboardHandler]);

  const reset = useCallback(() => {
    refetch()
    setGameStatus(null)
    setGuesses([]);
  }, [setGameStatus, setGuesses, refetch])

  if (isLoading) {
    return 'Loading...'
  }

  if (gameStatus === 'lost') {
    return (<><p> {correctWord} Neee oo nee, je hebt verloren baby boo...</p> <button onClick={() => { reset() }}>Reset</button></>);
  }

  if (gameStatus === 'won') {
    return (<><p>Lekker bezig kipje! Dat was het goede woord</p><button onClick={() => { reset() }}>Reset</button></>)
  }

  return <div>
    <Grid dimensions={{ rows: ROWS, columns: COLUMNS }} guesses={guesses} />
  </div>
}