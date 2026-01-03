//Компонент игровой доски

import React, { useCallback } from 'react';
import { Cell as CellType, Player, Position } from '../types';
import { Cell } from './Cell';
import { BoardContainer, BoardRow } from '../styles';
import { PATHS, getPlayerChipsOnBoard } from '../gameLogic';

interface BoardProps {
  board: CellType[][];
  currentPlayer: Player;
  possibleMoves: number[];
  targetPositions: Position[]; // Целевые позиции для ходов
  onCellPress: (position: Position, pathIndex: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPlayer,
  possibleMoves,
  targetPositions,
  onCellPress,
}) => {
  // Проверка, является ли клетка подсвеченной для хода
  const isCellHighlighted = useCallback(
    (position: Position): boolean => {
      const path = PATHS[currentPlayer];
      const pathIndex = path.findIndex(
        (p) => p.row === position.row && p.col === position.col
      );

      if (pathIndex === -1) return false;
      return possibleMoves.includes(pathIndex);
    },
    [currentPlayer, possibleMoves]
  );

  // Проверка, является ли клетка целевой
  const isCellTarget = useCallback(
    (position: Position): boolean => {
      return targetPositions.some(
        (target) => target.row === position.row && target.col === position.col
      );
    },
    [targetPositions]
  );

  const handleCellPress = useCallback(
    (position: Position) => {
      const path = PATHS[currentPlayer];
      const pathIndex = path.findIndex(
        (p) => p.row === position.row && p.col === position.col
      );

      if (pathIndex !== -1 && possibleMoves.includes(pathIndex)) {
        onCellPress(position, pathIndex);
      }
    },
    [currentPlayer, possibleMoves, onCellPress]
  );

  return (
    <BoardContainer>
      {board.map((row, rowIndex) => (
        <BoardRow key={rowIndex}>
          {row.map((cell, colIndex) => {
            const position: Position = { row: rowIndex, col: colIndex };
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                position={position}
                isHighlighted={isCellHighlighted(position)}
                isTarget={isCellTarget(position)}
                onPress={() => handleCellPress(position)}
              />
            );
          })}
        </BoardRow>
      ))}
    </BoardContainer>
  );
};
