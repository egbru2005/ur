/**
 * Игровая логика и константы для "Королевской игры Ура"
 */

import { Cell, GameState, Player, PlayerChips, Position } from './types';
import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';

// Количество клеток в пути каждого игрока
export const PATH_LENGTH = 14;

// Индексы розеток на пути (0-based)
// Позиции: 3 (col=0 в Start), 7 (центр War Zone), 12 (col=7 в Home)
export const ROSETTE_INDICES = [3, 7, 12];

// Начальное количество фишек у каждого игрока
export const INITIAL_CHIPS = 7;

/**
 * Пути игроков: массив позиций {row, col} для каждого индекса пути (0-13)
 * 
 * Порядок на доске (отображаемые номера 1-14):
 * Ряд 0 (P1): 4 3 2 1 ∅ ∅ 14 13
 * Ряд 1 (WZ): 5 6 7 8 9 10 11 12
 * Ряд 2 (P2): 4 3 2 1 ∅ ∅ 14 13
 * 
 * Player 1 путь (индексы 0-13):
 * Индексы 0-3: Ряд 0, колонки 3->2->1->0 (Start Zone, справа налево)
 * Индексы 4-11: Ряд 1, колонки 0->1->2->3->4->5->6->7 (War Zone, слева направо)
 * Индексы 12-13: Ряд 0, колонки 7->6 (Home Zone, справа налево)
 * 
 * Player 2 путь (зеркальный):
 * Индексы 0-3: Ряд 2, колонки 3->2->1->0 (Start Zone, справа налево)
 * Индексы 4-11: Ряд 1, колонки 0->1->2->3->4->5->6->7 (War Zone, слева направо)
 * Индексы 12-13: Ряд 2, колонки 7->6 (Home Zone, справа налево)
 */
export const PATHS: Record<Player, Position[]> = {
  Player1: [
    // Start Zone (индексы 0-3): справа налево
    { row: 0, col: 3 }, // Индекс 0 (позиция 1)
    { row: 0, col: 2 }, // Индекс 1 (позиция 2)
    { row: 0, col: 1 }, // Индекс 2 (позиция 3)
    { row: 0, col: 0 }, // Индекс 3 (позиция 4) - Розетка!
    // War Zone (индексы 4-11): слева направо
    { row: 1, col: 0 }, // Индекс 4 (позиция 5)
    { row: 1, col: 1 }, // Индекс 5 (позиция 6)
    { row: 1, col: 2 }, // Индекс 6 (позиция 7)
    { row: 1, col: 3 }, // Индекс 7 (позиция 8) - Розетка (центральная)
    { row: 1, col: 4 }, // Индекс 8 (позиция 9)
    { row: 1, col: 5 }, // Индекс 9 (позиция 10)
    { row: 1, col: 6 }, // Индекс 10 (позиция 11)
    { row: 1, col: 7 }, // Индекс 11 (позиция 12)
    // Home Zone (индексы 12-13): справа налево
    { row: 0, col: 7 }, // Индекс 12 (позиция 13) - Розетка (финишная)
    { row: 0, col: 6 }, // Индекс 13 (позиция 14)
  ],
  Player2: [
    // Start Zone (индексы 0-3): справа налево
    { row: 2, col: 3 }, // Индекс 0 (позиция 1)
    { row: 2, col: 2 }, // Индекс 1 (позиция 2)
    { row: 2, col: 1 }, // Индекс 2 (позиция 3)
    { row: 2, col: 0 }, // Индекс 3 (позиция 4) - Розетка!
    // War Zone (индексы 4-11): слева направо
    { row: 1, col: 0 }, // Индекс 4 (позиция 5)
    { row: 1, col: 1 }, // Индекс 5 (позиция 6)
    { row: 1, col: 2 }, // Индекс 6 (позиция 7)
    { row: 1, col: 3 }, // Индекс 7 (позиция 8) - Розетка (центральная)
    { row: 1, col: 4 }, // Индекс 8 (позиция 9)
    { row: 1, col: 5 }, // Индекс 9 (позиция 10)
    { row: 1, col: 6 }, // Индекс 10 (позиция 11)
    { row: 1, col: 7 }, // Индекс 11 (позиция 12)
    // Home Zone (индексы 12-13): справа налево
    { row: 2, col: 7 }, // Индекс 12 (позиция 13) - Розетка (финишная)
    { row: 2, col: 6 }, // Индекс 13 (позиция 14)
  ],
};

export const initializeBoard = (): Cell[][] => {
  const board: Cell[][] = [];

  // Сначала создаем пустую доску
  for (let row = 0; row < 3; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      // Определяем, является ли клетка пустой (вырез)
      const isEmpty = (row === 0 || row === 2) && (col === 4 || col === 5);

      board[row][col] = {
        player: null,
        isRosette: false,
        isEmpty,
      };
    }
  }

  // Расставляем розетки по путям игроков
  ['Player1', 'Player2'].forEach((player) => {
    const path = PATHS[player as Player];
    ROSETTE_INDICES.forEach((index) => {
      const pos = path[index];
      if (pos && !board[pos.row][pos.col].isEmpty) {
        board[pos.row][pos.col].isRosette = true;
      }
    });
  });

  return board;
};

async function playRollSound() {
  try {
    const sound = new Audio.Sound();
    await sound.loadAsync(require('../assets/dice.mp3'));
    await sound.playAsync();
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Sound error:', error);
    }
  }
}

function vibrateDevice(){
  try {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate();
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Vibration error:', error);
    }
  }
}
/**
 * Бросок 4 тетраэдральных костей
 * Каждая кость дает 0 или 1 с вероятностью 50/50
 * Результат = сумма (0-4)
 */
export const rollDice = (): number => {
  vibrateDevice();
  playRollSound();
  let sum = 0;
  for (let i = 0; i < 4; i++) {
    sum += Math.random() < 0.5 ? 0 : 1;
  }
  return sum;
};

/**
 * Получить индекс пути фишки на доске
 * Возвращает -1, если фишка не найдена на доске
 */
export const getChipPathIndex = (
  board: Cell[][],
  player: Player,
  position: Position
): number => {
  const path = PATHS[player];
  return path.findIndex((p) => p.row === position.row && p.col === position.col);
};

/**
 * Получить все позиции фишек игрока на доске с их индексами пути
 */
export const getPlayerChipsOnBoard = (
  board: Cell[][],
  player: Player
): { position: Position; pathIndex: number }[] => {
  const chips: { position: Position; pathIndex: number }[] = [];
  const path = PATHS[player];

  path.forEach((position, pathIndex) => {
    const cell = board[position.row][position.col];
    if (!cell.isEmpty && cell.player === player) {
      chips.push({ position, pathIndex });
    }
  });

  return chips;
};

/**
 * Проверка, является ли ход легальным
 */
export const isMoveLegal = (
  board: Cell[][],
  player: Player,
  fromPathIndex: number,
  diceValue: number
): boolean => {
  if (diceValue === 0) return false;

  const toPathIndex = fromPathIndex + diceValue;

  // Проверка выхода за пределы пути
  // toPathIndex === PATH_LENGTH (14) - это выход на финиш (разрешено)
  // toPathIndex > PATH_LENGTH (>14) - слишком далеко (запрещено)
  if (toPathIndex > PATH_LENGTH) return false;

  // Если фишка выходит с доски (toPathIndex === PATH_LENGTH), это легальный ход
  if (toPathIndex === PATH_LENGTH) return true;

  const toPosition = PATHS[player][toPathIndex];
  const toCell = board[toPosition.row][toPosition.col];

  // Нельзя занять клетку с своей фишкой
  if (toCell.player === player) return false;

  // Проверка розетки в War Zone (индексы 4-11)
  const isWarZone = toPathIndex >= 4 && toPathIndex <= 11;
  if (isWarZone && toCell.isRosette && toCell.player !== null) {
    // Нельзя срубить фишку на розетке в War Zone
    return false;
  }

  return true;
};

/**
 * Можно ли поставить новую фишку из резерва
 */
export const canPlaceNewChip = (
  board: Cell[][],
  player: Player,
  diceValue: number
): boolean => {
  if (diceValue === 0) return false;

  const toPathIndex = diceValue - 1; // -1 потому что ставим "до" первой клетки пути
  if (toPathIndex < 0) return false;

  const toPosition = PATHS[player][toPathIndex];
  const toCell = board[toPosition.row][toPosition.col];

  // Нельзя поставить на клетку со своей фишкой
  if (toCell.player === player) return false;

  // Проверка розетки (хотя на старте розеток быть не должно, но проверим)
  if (toCell.isRosette && toCell.player !== null) {
    return false;
  }

  return true;
};

/**
 * Получить все возможные ходы для текущего игрока
 */
export const getPossibleMoves = (
  state: GameState
): { type: 'move' | 'place'; pathIndex?: number }[] => {
  const { board, turn, diceValue } = state;
  if (diceValue === null || diceValue === 0) return [];

  const moves: { type: 'move' | 'place'; pathIndex?: number }[] = [];

  // Проверка возможности поставить новую фишку
  const playerChips =
    turn === 'Player1' ? state.player1Chips : state.player2Chips;
  if (playerChips.inReserve > 0 && canPlaceNewChip(board, turn, diceValue)) {
    moves.push({ type: 'place' });
  }

  // Проверка возможности переместить существующие фишки
  const chipsOnBoard = getPlayerChipsOnBoard(board, turn);
  chipsOnBoard.forEach(({ pathIndex }) => {
    if (isMoveLegal(board, turn, pathIndex, diceValue)) {
      moves.push({ type: 'move', pathIndex });
    }
  });

  return moves;
};

/**
 * Получить целевые позиции для всех возможных ходов
 */
export const getTargetPositions = (
  state: GameState
): Position[] => {
  const { board, turn, diceValue } = state;
  if (diceValue === null || diceValue === 0) return [];

  const targets: Position[] = [];

  // Проверка постановки новой фишки
  const playerChips =
    turn === 'Player1' ? state.player1Chips : state.player2Chips;
  if (playerChips.inReserve > 0 && canPlaceNewChip(board, turn, diceValue)) {
    const toPathIndex = diceValue - 1;
    targets.push(PATHS[turn][toPathIndex]);
  }

  // Проверка перемещения существующих фишек
  const chipsOnBoard = getPlayerChipsOnBoard(board, turn);
  chipsOnBoard.forEach(({ pathIndex }) => {
    if (isMoveLegal(board, turn, pathIndex, diceValue)) {
      const toPathIndex = pathIndex + diceValue;
      // Если не выход за пределы, добавляем целевую позицию
      if (toPathIndex < PATH_LENGTH) {
        targets.push(PATHS[turn][toPathIndex]);
      }
    }
  });

  return targets;
};

/**
 * Инициализация начального состояния игры
 */
export const getInitialState = (): GameState => {
  return {
    board: initializeBoard(),
    turn: 'Player1',
    diceValue: null,
    possibleMoves: [],
    targetPositions: [],
    winner: null,
    player1Chips: {
      inReserve: INITIAL_CHIPS,
      onBoard: 0,
      finished: 0,
    },
    player2Chips: {
      inReserve: INITIAL_CHIPS,
      onBoard: 0,
      finished: 0,
    },
    lastMove: null,
    message: null,
  };
};

/**
 * Проверка победы
 */
export const checkWinner = (chips: PlayerChips): boolean => {
  return chips.finished === INITIAL_CHIPS;
};
