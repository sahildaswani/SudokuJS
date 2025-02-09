import { generateSudoku, solveSudoku, getSudokuHint, getCandidates, Difficulty } from './src/sudoku';

const difficulty = Difficulty.EASY;
const sudoku = generateSudoku(difficulty);
console.log('Generated Sudoku:');
console.table(sudoku);

const candidates = getCandidates(sudoku);
console.log('Sudoku Candidates:');
console.table(candidates);

const hint = getSudokuHint(sudoku);
console.log('Sudoku Hint:', hint);

const solvedSudoku = solveSudoku(sudoku);
console.log('Solved Sudoku:');
console.table(solvedSudoku);