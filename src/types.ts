/**
 * Типы для игры "Королевская игра Ура"
 */

export type Player = 'Player1' | 'Player2';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  player: Player | null; // Кто занимает клетку
  isRosette: boolean; // Розетка ли эта клетка
  isEmpty: boolean; // Является ли клетка пустой (вырез в поле)
}

export interface PlayerChips {
  inReserve: number; // Фишки в запасе (не на поле)
  onBoard: number; // Фишки на поле
  finished: number; // Фишки, вышедшие с поля
}

export interface GameState {
  board: Cell[][]; // Матрица 3x8 с клетками
  turn: Player; // Чей сейчас ход
  diceValue: number | null; // Результат броска (0-4) или null
  possibleMoves: number[]; // Индексы фишек на доске, которыми можно походить
  targetPositions: Position[]; // Позиции, куда попадут фишки при ходе
  winner: Player | null; // Победитель
  player1Chips: PlayerChips;
  player2Chips: PlayerChips;
  lastMove: {
    from: Position | null;
    to: Position | null;
    capturedOpponent: boolean;
    landedOnRosette: boolean;
  } | null;
  message: string | null; // Сообщение для игрока
}

export type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'MOVE_CHIP'; pathIndex: number }
  | { type: 'PLACE_NEW_CHIP' }
  | { type: 'SWITCH_TURN' }
  | { type: 'RESET_GAME' };
