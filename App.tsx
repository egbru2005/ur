/**
 * Главный компонент приложения
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { MainMenu } from './src/components/MainMenu';
import { GameScreen } from './src/components/GameScreen';

type Screen = 'menu' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  return (
    <>
      <StatusBar barStyle="light-content" />
      {currentScreen === 'menu' ? (
        <MainMenu onStartGame={() => setCurrentScreen('game')} />
      ) : (
        <GameScreen onBackToMenu={() => setCurrentScreen('menu')} />
      )}
    </>
  );
}
