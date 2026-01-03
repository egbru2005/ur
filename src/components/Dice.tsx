//Компонент отображения костей

import React, { useMemo } from 'react';
import { DiceContainer, DiceItem, DiceText } from '../styles';

interface DiceProps {
  value: number | null;
}

export const Dice: React.FC<DiceProps> = ({ value }) => {
  // Разбиваем значение на 4 отдельные кости
  const diceValues = useMemo(() => {
    if (value === null) return [0, 0, 0, 0];

    // Генерируем случайную комбинацию, дающую нужную сумму
    const dice = [0, 0, 0, 0];
    let remaining = value;

    for (let i = 0; i < 4 && remaining > 0; i++) {
      if (Math.random() < remaining / (4 - i)) {
        dice[i] = 1;
        remaining--;
      }
    }

    // Распределяем оставшиеся единицы
    while (remaining > 0) {
      const index = Math.floor(Math.random() * 4);
      if (dice[index] === 0) {
        dice[index] = 1;
        remaining--;
      }
    }

    return dice;
  }, [value]);

  return (
    <DiceContainer>
      {diceValues.map((diceValue, index) => (
        <DiceItem key={index} value={diceValue}>
          <DiceText>{diceValue}</DiceText>
        </DiceItem>
      ))}
    </DiceContainer>
  );
};
