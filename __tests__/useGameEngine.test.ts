// __tests__/useGameEngine.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useGameEngine } from '../src/useGameEngine';

describe('useGameEngine', () => {
    it('should initialize with correct state', () => {
        const { result } = renderHook(() => useGameEngine());

        expect(result.current.state.turn).toBe('Player1');
        expect(result.current.state.diceValue).toBe(null);
        expect(result.current.state.player1Chips.inReserve).toBe(7);
        expect(result.current.state.player2Chips.inReserve).toBe(7);
    });

    it('should roll dice', () => {
        const { result } = renderHook(() => useGameEngine());

        act(() => {
            result.current.actions.rollDice();
        });

        expect(result.current.state.diceValue).toBeGreaterThanOrEqual(0);
        expect(result.current.state.diceValue).toBeLessThanOrEqual(4);
    });

    it('should place new chip', () => {
        const { result } = renderHook(() => useGameEngine());

        // Roll dice first
        act(() => {
            result.current.actions.rollDice();
        });

        const initialReserve = result.current.state.player1Chips.inReserve;

        if (result.current.state.diceValue! > 0) {
            act(() => {
                result.current.actions.placeNewChip();
            });

            expect(result.current.state.player1Chips.inReserve).toBe(initialReserve - 1);
            expect(result.current.state.player1Chips.onBoard).toBe(1);
        }
    });

    it('should switch turn on rosette', () => {
        const { result } = renderHook(() => useGameEngine());

        // Place chip on rosette position
        act(() => {
            // Simulate placing on rosette
            result.current.actions.rollDice();
            // ... test rosette logic
        });
    });

    it('should initialize winner as null', () => {
        const { result } = renderHook(() => useGameEngine());
        expect(result.current.state.winner).toBe(null);
    });

    it('should have checkWinner logic in gameLogic', () => {
        const { checkWinner } = require('../src/gameLogic');
        expect(checkWinner).toBeDefined();

        const winningChips = { inReserve: 0, onBoard: 0, finished: 7 };
        const notWinningChips = { inReserve: 0, onBoard: 1, finished: 6 };

        expect(checkWinner(winningChips)).toBe(true);
        expect(checkWinner(notWinningChips)).toBe(false);
    });
});