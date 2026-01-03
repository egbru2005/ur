//Главное меню игры

import React from 'react';
import { ScreenContainer, Title, Button, ButtonText } from '../styles';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  return (
    <ScreenContainer>
      <Title>Королевская игра Ура{'\n'}(Royal Game of Ur)</Title>
      <Button onPress={onStartGame}>
        <ButtonText>Начать игру</ButtonText>
      </Button>
    </ScreenContainer>
  );
};
