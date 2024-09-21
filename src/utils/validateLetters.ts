import { Validation } from '../view/Game';

export function validateLetters(chosenWord: string, correctWord:string) {
  const letters = chosenWord.split('');
  const validation: Validation[] =[];

  for(let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    let status: Validation['status'] = 'absent';

    if (!correctWord.includes(letter)) {
      status = 'absent';
    } else if (correctWord[i] === letter) {
      status = 'correct';
    } else if (correctWord.includes(letter)) {
      status = 'present';
    }

    validation.push({
      letter,
      status
    })
  }

    return validation;
  }