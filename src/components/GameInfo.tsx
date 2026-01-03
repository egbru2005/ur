//Компонент информации об игре и игроках

import React from 'react';
import { Player, PlayerChips } from '../types';
import {
  PlayerInfo,
  PlayerInfoText,
} from '../styles';

interface GameInfoProps {
  player: Player;
  chips: PlayerChips;
  isActive: boolean;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  player,
  chips,
  isActive,
}) => {
  const playerName = player === 'Player1' ? 'Игрок 1' : 'Игрок 2';

  return (
    <PlayerInfo isActive={isActive}>
      <PlayerInfoText bold>
        {playerName} {isActive && '(Ход)'}
      </PlayerInfoText>
      <PlayerInfoText>
        Резерв: {chips.inReserve} | На поле: {chips.onBoard} | Финиш: {chips.finished}
      </PlayerInfoText>
    </PlayerInfo>
  );
};
