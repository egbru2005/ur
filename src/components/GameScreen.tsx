//Игровой экран

import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useGameEngine } from '../useGameEngine';
import { Board } from './Board';
import { Dice } from './Dice';
import { GameInfo } from './GameInfo';
import { Position } from '../types';
import { canPlaceNewChip } from '../gameLogic';
import {
  ScreenContainer,
  GameContainer,
  Button,
  ButtonText,
  ButtonRow,
  MessageContainer,
  MessageText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
} from '../styles';

interface GameScreenProps {
  onBackToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onBackToMenu }) => {
  const { state, actions } = useGameEngine();

  // Автоматический переход хода при отсутствии ходов
  useEffect(() => {
    if (
      state.diceValue !== null &&
      state.possibleMoves.length === 0 &&
      !state.winner
    ) {
      const timer = setTimeout(() => {
        actions.switchTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.diceValue, state.possibleMoves, state.winner, actions]);

  const handleRollDice = useCallback(() => {
    if (state.diceValue === null && !state.winner) {
      actions.rollDice();
    }
  }, [state.diceValue, state.winner, actions]);

  const handleCellPress = useCallback(
    (position: Position, pathIndex: number) => {
      if (state.diceValue === null || state.winner) return;

      const cell = state.board[position.row][position.col];

      // Если на клетке фишка текущего игрока - перемещаем её
      if (cell.player === state.turn) {
        actions.moveChip(pathIndex);
      }
    },
    [state.board, state.turn, state.diceValue, state.winner, actions]
  );

  const handlePlaceNewChip = useCallback(() => {
    if (
      state.diceValue &&
      canPlaceNewChip(state.board, state.turn, state.diceValue)
    ) {
      actions.placeNewChip();
    }
  }, [state.board, state.turn, state.diceValue, actions]);

  const handleResetGame = useCallback(() => {
    actions.resetGame();
  }, [actions]);

  const canRollDice = state.diceValue === null && !state.winner;
  const canPlaceChip =
    state.diceValue !== null &&
    state.diceValue > 0 &&
    !state.winner &&
    canPlaceNewChip(state.board, state.turn, state.diceValue) &&
    (state.turn === 'Player1'
      ? state.player1Chips.inReserve > 0
      : state.player2Chips.inReserve > 0);

  // @ts-ignore
  return (
    <ScreenContainer>
      <View style={{ flex: 1, width: '100%', marginTop: '10%', marginBottom: '5%' }}>
        <GameContainer>
          {/* Информация о Player 2 */}
          <GameInfo
            player="Player2"
            chips={state.player2Chips}
            isActive={state.turn === 'Player2'}
          />

          {/* Доска */}
          <Board
            board={state.board}
            currentPlayer={state.turn}
            possibleMoves={state.possibleMoves}
            targetPositions={state.targetPositions}
            onCellPress={handleCellPress}
          />

          {/* Информация о Player 1 */}
          <GameInfo
            player="Player1"
            chips={state.player1Chips}
            isActive={state.turn === 'Player1'}
          />

          {/* Кости */}
          <View style={{ minHeight: 48, justifyContent: 'center' }}>
            <Dice value={state.diceValue} />
          </View>

          {/* Сообщения */}
          <View style={{ minHeight: 42, justifyContent: 'center' }}>
            {(
              <MessageContainer>
                <MessageText>{state.message}</MessageText>
              </MessageContainer>
            )}
          </View>

          {/* Кнопки управления */}
          <ButtonRow>
            <Button onPress={handleRollDice} disabled={!canRollDice}>
              <ButtonText>Бросить кости</ButtonText>
            </Button>

            {/*canPlaceChip && */(
              <Button onPress={handlePlaceNewChip} disabled={!canPlaceChip}>
                <ButtonText>Поставить новую</ButtonText>
              </Button>
            )}

            <Button onPress={onBackToMenu}>
              <ButtonText>Меню</ButtonText>
            </Button>
          </ButtonRow>
        </GameContainer>
      </View>

      {/* Модальное окно победителя */}
      {state.winner && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>🎉 Победа! 🎉</ModalTitle>
            <ModalText>
              {state.winner === 'Player1' ? 'Игрок 1' : 'Игрок 2'} выиграл!
            </ModalText>
            <Button onPress={handleResetGame}>
              <ButtonText>Новая игра</ButtonText>
            </Button>
            <Button onPress={onBackToMenu}>
              <ButtonText>Главное меню</ButtonText>
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </ScreenContainer>
  );
};
