/**
 * Хук для управления игровой логикой через useReducer
 */

import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Player } from './types';
import {
  getInitialState,
  rollDice,
  getPossibleMoves,
  PATHS,
  PATH_LENGTH,
  ROSETTE_INDICES,
  checkWinner,
  getPlayerChipsOnBoard,
  getTargetPositions,
} from './gameLogic';

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ROLL_DICE': {
      const diceValue = rollDice();
      const newState = { ...state, diceValue, message: null };
      const possibleMoves = getPossibleMoves(newState);

      if (diceValue === 0) {
        return {
          ...newState,
          possibleMoves: [],
          targetPositions: [],
          message: 'Выпало 0! Переход хода через 1.5 сек',
        };
      }

      if (possibleMoves.length === 0) {
        return {
          ...newState,
          possibleMoves: [],
          targetPositions: [],
          message: 'Нет доступных ходов! Переход хода через 1.5 сек',
        };
      }

      return {
        ...newState,
        possibleMoves: possibleMoves.map((m) => m.pathIndex ?? -1),
        targetPositions: getTargetPositions(newState),
        message: 'Выберите фишку для хода',
      };
    }

    case 'PLACE_NEW_CHIP': {
      if (state.diceValue === null || state.diceValue === 0) return state;

      const newBoard = state.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );
      const currentPlayer = state.turn;
      const toPathIndex = state.diceValue - 1;
      const toPosition = PATHS[currentPlayer][toPathIndex];

      // Проверка на захват фишки противника
      const toCell = newBoard[toPosition.row][toPosition.col];
      const capturedOpponent = toCell.player !== null && toCell.player !== currentPlayer;
      const opponent: Player = currentPlayer === 'Player1' ? 'Player2' : 'Player1';

      // Установка фишки
      newBoard[toPosition.row][toPosition.col] = {
        ...toCell,
        player: currentPlayer,
      };

      // Обновление счетчиков
      const playerChipsKey = currentPlayer === 'Player1' ? 'player1Chips' : 'player2Chips';
      const opponentChipsKey = opponent === 'Player1' ? 'player1Chips' : 'player2Chips';

      const newPlayerChips = {
        ...state[playerChipsKey],
        inReserve: state[playerChipsKey].inReserve - 1,
        onBoard: state[playerChipsKey].onBoard + 1,
      };

      let newOpponentChips = state[opponentChipsKey];
      if (capturedOpponent) {
        newOpponentChips = {
          ...newOpponentChips,
          inReserve: newOpponentChips.inReserve + 1,
          onBoard: newOpponentChips.onBoard - 1,
        };
      }

      // Проверка на розетку
      const landedOnRosette = ROSETTE_INDICES.includes(toPathIndex);
      const shouldSwitchTurn = !landedOnRosette;

      return {
        ...state,
        board: newBoard,
        [playerChipsKey]: newPlayerChips,
        [opponentChipsKey]: newOpponentChips,
        diceValue: null,
        possibleMoves: [],
        targetPositions: [],
        turn: shouldSwitchTurn ? opponent : currentPlayer,
        lastMove: {
          from: null,
          to: toPosition,
          capturedOpponent,
          landedOnRosette,
        },
        message: landedOnRosette
          ? 'Розетка! Бросайте снова!'
          : capturedOpponent
          ? 'Фишка противника срублена!'
          : null,
      };
    }

    case 'MOVE_CHIP': {
      if (state.diceValue === null || state.diceValue === 0) return state;

      const fromPathIndex = action.pathIndex;
      const toPathIndex = fromPathIndex + state.diceValue;
      const currentPlayer = state.turn;
      const opponent: Player = currentPlayer === 'Player1' ? 'Player2' : 'Player1';

      const fromPosition = PATHS[currentPlayer][fromPathIndex];
      const newBoard = state.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      // Убираем фишку с текущей позиции
      newBoard[fromPosition.row][fromPosition.col] = {
        ...newBoard[fromPosition.row][fromPosition.col],
        player: null,
      };

      const playerChipsKey = currentPlayer === 'Player1' ? 'player1Chips' : 'player2Chips';
      const opponentChipsKey = opponent === 'Player1' ? 'player1Chips' : 'player2Chips';

      let newPlayerChips = state[playerChipsKey];
      let newOpponentChips = state[opponentChipsKey];

      // Проверка выхода за пределы поля (финиш)
      if (toPathIndex >= PATH_LENGTH) {
        newPlayerChips = {
          ...newPlayerChips,
          onBoard: newPlayerChips.onBoard - 1,
          finished: newPlayerChips.finished + 1,
        };

        // Проверка победы
        const hasWon = checkWinner(newPlayerChips);

        return {
          ...state,
          board: newBoard,
          [playerChipsKey]: newPlayerChips,
          diceValue: null,
          possibleMoves: [],
          targetPositions: [],
          winner: hasWon ? currentPlayer : null,
          lastMove: {
            from: fromPosition,
            to: null,
            capturedOpponent: false,
            landedOnRosette: false,
          },
          message: hasWon ? `${currentPlayer} победил!` : 'Фишка вышла с поля!',
        };
      }

      // Перемещение на новую позицию
      const toPosition = PATHS[currentPlayer][toPathIndex];
      const toCell = newBoard[toPosition.row][toPosition.col];

      // Проверка на захват фишки противника
      const capturedOpponent = toCell.player !== null && toCell.player !== currentPlayer;
      if (capturedOpponent) {
        newOpponentChips = {
          ...newOpponentChips,
          inReserve: newOpponentChips.inReserve + 1,
          onBoard: newOpponentChips.onBoard - 1,
        };
      }

      // Установка фишки на новую позицию
      newBoard[toPosition.row][toPosition.col] = {
        ...toCell,
        player: currentPlayer,
      };

      // Проверка на розетку
      const landedOnRosette = ROSETTE_INDICES.includes(toPathIndex);
      const shouldSwitchTurn = !landedOnRosette;

      return {
        ...state,
        board: newBoard,
        [playerChipsKey]: newPlayerChips,
        [opponentChipsKey]: newOpponentChips,
        diceValue: null,
        possibleMoves: [],
        targetPositions: [],
        turn: shouldSwitchTurn ? opponent : currentPlayer,
        lastMove: {
          from: fromPosition,
          to: toPosition,
          capturedOpponent,
          landedOnRosette,
        },
        message: landedOnRosette
          ? 'Розетка! Бросайте снова!'
          : capturedOpponent
          ? 'Фишка противника срублена!'
          : null,
      };
    }

    case 'SWITCH_TURN': {
      const opponent: Player = state.turn === 'Player1' ? 'Player2' : 'Player1';
      return {
        ...state,
        turn: opponent,
        diceValue: null,
        possibleMoves: [],
        targetPositions: [],
        message: null,
      };
    }

    case 'RESET_GAME': {
      return getInitialState();
    }

    default:
      return state;
  }
};

export const useGameEngine = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());

  const rollDiceAction = useCallback(() => {
    dispatch({ type: 'ROLL_DICE' });
  }, []);

  const moveChip = useCallback((pathIndex: number) => {
    dispatch({ type: 'MOVE_CHIP', pathIndex });
  }, []);

  const placeNewChip = useCallback(() => {
    dispatch({ type: 'PLACE_NEW_CHIP' });
  }, []);

  const switchTurn = useCallback(() => {
    dispatch({ type: 'SWITCH_TURN' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    actions: {
      rollDice: rollDiceAction,
      moveChip,
      placeNewChip,
      switchTurn,
      resetGame,
    },
  };
};
