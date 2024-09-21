import { validateLetters } from '../../src/utils/validateLetters';

test('should validate letters correctly', () => {
  const correctWord = 'energy';
  const chosenWord = 'garden';

  const validation = validateLetters(chosenWord, correctWord);
  expect(validation).toMatchSnapshot();
})

test('should validate letters correctly', () => {
  const correctWord = 'energy';
  const chosenWord = 'eeeeee';

  const validation = validateLetters(chosenWord, correctWord);
  expect(validation).toMatchSnapshot();
})

test('should validate letters correctly', () => {
  const correctWord = 'energy';
  const chosenWord = 'energn';

  const validation = validateLetters(chosenWord, correctWord);
  expect(validation).toMatchSnapshot();
})