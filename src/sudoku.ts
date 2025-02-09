export enum Difficulty {
	EASY = "easy",
	MEDIUM = "medium",
	HARD = "hard",
	EXPERT = "expert",
	MASTER = "master",
}

type Cell = number | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell][];

export function isValid(board: Board, row: number, col: number, num: number): boolean {
	for (let x = 0; x < 9; x++) {
		if (
			board[row][x] === num ||
			board[x][col] === num ||
			board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + (x % 3)] === num
		) {
			return false;
		}
	}
	return true;
}

function shuffle(array: any[]): any[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function generateShuffledNumbers(): number[] {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	return shuffle(numbers);
}

function fillBoard(board: Board): boolean {
	const shuffledNumbers = generateShuffledNumbers();
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col] === null) {
				for (let num of shuffledNumbers) {
					if (isValid(board, row, col, num)) {
						board[row][col] = num;
						if (fillBoard(board)) {
							return true;
						}
						board[row][col] = null;
					}
				}
				return false;
			}
		}
	}
	return true;
}

function removeNumbers(board: Board, difficulty: Difficulty): void {
	const positions = [];
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			positions.push([row, col]);
		}
	}
	shuffle(positions);

	const errorValue = Math.floor(Math.random() * 5) - 2;

	const attempts: { [key in Difficulty]: number } = {
		easy: 42,
		medium: 45,
		hard: 50,
		expert: 54,
		master: 57,
	};

	for (let i = 0; i < attempts[difficulty] + errorValue; i++) {
		const [row, col] = positions[i];
		board[row][col] = null;
	}
}

export function generateSudoku(difficulty: Difficulty): Board {
	const board = new Array(9).fill(null).map(() => new Array(9).fill(null)) as Board;
	fillBoard(board);
	removeNumbers(board, difficulty);
	return board;
}

function solveSudokuHelper(board: Board): boolean {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (board[row][col] === null) {
				for (let num = 1; num <= 9; num++) {
					if (isValid(board, row, col, num)) {
						board[row][col] = num;
						if (solveSudokuHelper(board)) {
							return true;
						}
						board[row][col] = null;
					}
				}
				return false;
			}
		}
	}
	return true;
}

export function solveSudoku(board: Board): Board {
	solveSudokuHelper(board);
	return board;
}

/**
 * Returns the possible candidates for each cell in the Sudoku board.
 */
export function getCandidates(board: Board): string[][] {
  const candidates: string[][] = Array.from({ length: 9 }, () => Array(9).fill(''));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) { // Only consider empty cells
        const possibleNumbers: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        // Check row and column
        for (let x = 0; x < 9; x++) {
          if (board[row][x] !== null) possibleNumbers.delete(board[row][x] as number);
          if (board[x][col] !== null) possibleNumbers.delete(board[x][col] as number);
        }

        // Check 3x3 box
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;
        for (let r = boxRowStart; r < boxRowStart + 3; r++) {
          for (let c = boxColStart; c < boxColStart + 3; c++) {
            if (board[r][c] !== null) possibleNumbers.delete(board[r][c] as number);
          }
        }

        // Convert to sorted string
        candidates[row][col] = Array.from(possibleNumbers).sort().join('');
      } else {
		    candidates[row][col] = board[row][col]?.toString() ?? '';
      }
    }
  }

  return candidates;
}

/**
 * Provides a hint for the Sudoku puzzle using candidate logic.
 */
export function getSudokuHint(board: Board): { row: number, col: number, value: number } {
  const candidates = getCandidates(board);
  
  // Find the first empty cell with the least candidates
  let minCandidatesCount = Infinity;
  let hintCell: { row: number, col: number, value: number } | null = null;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellCandidates = candidates[row][col];
      if (cellCandidates.length > 0 && cellCandidates.length < minCandidatesCount && board[row][col] === null) {
        minCandidatesCount = cellCandidates.length;
        hintCell = { row, col, value: parseInt(cellCandidates[0]) }; // Suggest the first candidate
      }
    }
  }

  // If a hint cell was found, return it; otherwise indicate no hints available
  return hintCell ? hintCell : { row: -1, col: -1, value: -1 }; // Indicates no hints available
}