/**
 * Styled components для игры
 */

import styled from 'styled-components/native';

// Контейнер экрана
export const ScreenContainer = styled.View`
  flex: 1;
  background-color: #1a1a2e;
  align-items: center;
  justify-content: center;
`;

// Контейнер игрового экрана
export const GameContainer = styled.View`
  flex: 1;
  padding: 15px;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

// Заголовок
export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #f0f0f0;
  margin-bottom: 15px;
  text-align: center;
`;

// Кнопка
export const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? '#555' : 'darkolivegreen')};
  padding: 10px 20px;
  border-radius: 8px;
  margin: 5px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
`;

// Контейнер для кнопок в ряд
export const ButtonRow = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: end;
  flex-wrap: wrap;
  width: 50%;
  min-height: 50px;
`;

// Информация о игроке
export const PlayerInfo = styled.View<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? '#16213e' : '#0f3460')};
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  min-height: 50px;
  margin-bottom: 8px;
  border-width: ${(props) => ('2px')};
  border-color: ${(props) => (props.isActive ? 'darkolivegreen' : '#555')};
`;

export const PlayerInfoText = styled.Text<{ bold?: boolean }>`
  color: #f0f0f0;
  font-size: 13px;
  margin-bottom: 3px;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

// Контейнер доски
export const BoardContainer = styled.View`
  background-color: #16213e;
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 6px;
  border-radius: 10px;
  border-width: 2px;
  border-color: darkolivegreen;
`;

// Ряд доски
export const BoardRow = styled.View`
  flex-direction: row;
`;

// Клетка доски
export const CellContainer = styled.TouchableOpacity<{
  isEmpty?: boolean;
  isRosette?: boolean;
  isHighlighted?: boolean;
  isTarget?: boolean;
}>`
  width: 35px;
  height: 35px;
  margin: 1px;
  background-color: ${(props) =>
    props.isEmpty
      ? 'transparent'
      : props.isRosette
      ? 'peru'
      : props.isHighlighted
      ? '#4ecca3'
      : props.isTarget
      ? '#ff6b9d'
      : 'wheat'};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border-width: ${(props) => ('2px')};
  border-color: ${(props) => 
    props.isHighlighted 
      ? 'darkolivegreen' 
      : props.isTarget 
      ? '#ff2e63' 
      : '#555'};
  position: relative;
`;

// Фишка
export const Chip = styled.View<{ player: 'Player1' | 'Player2' }>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: ${(props) =>
    props.player === 'Player1' ? '#00adb5' : '#ff2e63'};
  border-width: 2px;
  border-color: #000;
`;

// Розетка символ
export const RosetteText = styled.Text`
  font-size: 20px;
  color: #16213e;
  font-weight: bold;
`;

// Контейнер для позиционирования стрелки
export const TargetIndicator = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

// Контейнер костей
export const DiceContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
  min-height: 40px;
`;

// Одна кость
export const DiceItem = styled.View<{ value: number }>`
  width: 32px;
  height: 32px;
  margin: 3px;
  background-color: ${(props) => (props.value === 1 ? 'darkolivegreen' : '#555')};
  border-radius: 6px;
  border-width: 2px;
  border-color: #f0f0f0;
  align-items: center;
  justify-content: center;
`;

export const DiceText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

// Сообщение
export const MessageContainer = styled.View`
  background-color: darkolivegreen;
  padding: 8px 15px;
  border-radius: 8px;
  margin: 6px 0;
  min-height: 40px;
  max-height: 40px;
  justify-content: center;
`;

export const MessageText = styled.Text`
  color: #fff;
  font-size: 13px;
  text-align: center;
  font-weight: bold;
`;

// Модальное окно победителя
export const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: #16213e;
  padding: 30px;
  border-radius: 20px;
  align-items: center;
  border-width: 3px;
  border-color: darkolivegreen;
  min-width: 300px;
`;

export const ModalTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 20px;
  text-align: center;
`;

export const ModalText = styled.Text`
  font-size: 18px;
  color: #f0f0f0;
  margin-bottom: 20px;
  text-align: center;
`;
