//Компонент клетки доски

import React from 'react';
import { Cell as CellType, Player, Position } from '../types';
import { CellContainer, Chip, RosetteText, TargetIndicator, TargetArrow } from '../styles';

interface CellProps {
  cell: CellType;
  position: Position;
  isHighlighted: boolean;
  isTarget: boolean; // Является ли клетка целевой для хода
  onPress: () => void;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  position,
  isHighlighted,
  isTarget,
  onPress,
}) => {
  // Если клетка пустая (вырез), не отображаем
  if (cell.isEmpty) {
    return <CellContainer isEmpty disabled />;
  }

  return (
    <CellContainer
      isRosette={cell.isRosette}
      isHighlighted={isHighlighted}
      isTarget={isTarget}
      onPress={onPress}
      activeOpacity={isHighlighted ? 0.7 : 1}
      disabled={!isHighlighted}
    >
      {/* Розетка */}
      {cell.isRosette && !cell.player && <RosetteText>+</RosetteText>}

      {/* Фишка */}
      {cell.player && <Chip player={cell.player} />}
    </CellContainer>
  );
};
