// __tests__/gameLogic.test.ts
import {
    initializeBoard,
    isMoveLegal,
    canPlaceNewChip,
    ROSETTE_INDICES,
    PATHS
} from '../src/gameLogic';

describe('Game Logic', () => {
    describe('initializeBoard', () => {
        it('создает доску 3x8', () => {
            const board = initializeBoard();
            expect(board).toHaveLength(3);
            expect(board[0]).toHaveLength(8);
        });

        it('корректно располагает розетки', () => {
            const board = initializeBoard();
            expect(board[0][0].isRosette).toBe(true);  // Player 1
            expect(board[0][7].isRosette).toBe(true);  // Player 1
            expect(board[1][3].isRosette).toBe(true);  // Shared
            expect(board[2][0].isRosette).toBe(true);  // Player 2
            expect(board[2][7].isRosette).toBe(true);  // Player 2
        });

        it('создает "заглушки"', () => {
            const board = initializeBoard();
            expect(board[0][4].isEmpty).toBe(true);
            expect(board[0][5].isEmpty).toBe(true);
            expect(board[2][4].isEmpty).toBe(true);
            expect(board[2][5].isEmpty).toBe(true);
        });
    });

    describe('isMoveLegal', () => {
        const board = initializeBoard();

        it('позволяет фишке покинуть поле при соответствующем числе на костях', () => {
            expect(isMoveLegal(board, 'Player1', 13, 1)).toBe(true);
            expect(isMoveLegal(board, 'Player1', 12, 2)).toBe(true);
            expect(isMoveLegal(board, 'Player1', 11, 3)).toBe(true);
        });

        it('не позволяет фишке покинуть поле при превышении числа на костях', () => {
            expect(isMoveLegal(board, 'Player1', 13, 2)).toBe(false);
            expect(isMoveLegal(board, 'Player1', 12, 3)).toBe(false);
        });

        it('блокирует ход при значении 0 на костях', () => {
            expect(isMoveLegal(board, 'Player1', 5, 0)).toBe(false);
        });
    });

    describe('PATHS', () => {
        it('содержит правильные стартовые позиции', () => {
            expect(PATHS.Player1[0]).toEqual({ row: 0, col: 3 });
            expect(PATHS.Player2[0]).toEqual({ row: 2, col: 3 });
        });

        it('содержит 14 позиций', () => {
            expect(PATHS.Player1).toHaveLength(14);
            expect(PATHS.Player2).toHaveLength(14);
        });

        it('содержит розетки на правильных позициях', () => {
            ROSETTE_INDICES.forEach(index => {
                const pos1 = PATHS.Player1[index];
                const pos2 = PATHS.Player2[index];
                const board = initializeBoard();
                expect(board[pos1.row][pos1.col].isRosette).toBe(true);
                expect(board[pos2.row][pos2.col].isRosette).toBe(true);
            });
        });
    });
});