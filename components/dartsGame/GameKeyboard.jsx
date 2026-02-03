import { View } from 'react-native';
import React, { useContext, useState, useRef } from 'react';
import CustomButton from '../Custom/CustomButton';
import { DartsGameContext } from '../../context/DartsGameContext';
import { socket } from '../../lib/socketio';

const inputTailwind = "bg-creamy rounded-[25px] m-0.5";

const GameKeyboard = () => {
  const { game, setGame } = useContext(DartsGameContext);
  const [specialState, setSpecialState] = useState([false, ""]);
  const pendingRequest = useRef(false);
  const lastRequestTime = useRef(0);
  const minRequestInterval = 100;

  const handleClick = (input) => {
    const now = Date.now();
    if (pendingRequest.current || (now - lastRequestTime.current) < minRequestInterval) {
      console.warn('Request throttled - too fast');
      return;
    }

    pendingRequest.current = true;
    lastRequestTime.current = now;

    const currentAction = specialState[0] ? specialState[1] : null;
    const shouldClearSpecialState = specialState[0];

    try {
      if (currentAction) {
        socket.emit("externalKeyboardInput", JSON.stringify({
          input: input,
          action: currentAction,
          gameCode: game.gameCode
        }));
        if (shouldClearSpecialState) {
          setSpecialState([false, ""]);
        }
      } else {
        socket.emit("externalKeyboardInput", JSON.stringify({
          input: input,
          gameCode: game.gameCode
        }));
      }
    } finally {
      setTimeout(() => {
        pendingRequest.current = false;
      }, minRequestInterval);
    }
  }

  const handleSpecialStateClick = (input) => {
    if (input === "DOUBLE" || input === "TRIPLE") {
      specialState[0] && specialState[1] === input
        ? setSpecialState([false, ""])
        : setSpecialState([true, input]);
    }
  }

  const handleDisabledSpecial = (type) => {
    if (type === 'DOORS') {
      return specialState[1] === 'TRIPLE' || specialState[1] === 'DOUBLE';
    } else if (type === 'DOUBLE') {
      return specialState[1] === 'TRIPLE';
    } else if (type === 'TRIPLE') {
      return specialState[1] === 'DOUBLE';
    }
    else if (type === 'BACK') {
      return specialState[1] === 'DOUBLE' || specialState[1] === 'TRIPLE' || (game.round === 1 && game.users[0].turns[1] === null);
    }
    return specialState[1] === 'TRIPLE' || specialState[1] === 'DOUBLE' || specialState[1] === type;
  }

  const numbers = [];
  for (let i = 1; i <= 20; i++) numbers.push(<CustomButton key={i} title={i} textStyles='w-16' containerStyle={inputTailwind} onPress={() => handleClick(i)} />);

  return (
    <View>
      <View className="flex flex-row flex-wrap justify-center">
        {numbers}
        <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="25" isDisabled={specialState[1] === "TRIPLE"} onPress={() => handleClick(25)} />
        <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="0" isDisabled={specialState[0]} onPress={() => handleClick(0)} />
      </View>
      <View className="flex flex-row flex-wrap justify-center pt-10">
        <CustomButton
          containerStyle={`${inputTailwind} bg-[#00B524]`}
          textStyles='min-w-26'
          title="DOORS"
          onPress={() => handleClick('DOORS')}
          isDisabled={handleDisabledSpecial('DOORS')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} ${specialState[1] === 'DOUBLE' ? 'bg-[#c4a100]' : 'bg-[#ffd100]'}`}
          textStyles='min-w-26'
          title="DOUBLE"
          onPress={() => handleSpecialStateClick('DOUBLE')}
          isDisabled={handleDisabledSpecial('DOUBLE')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} ${specialState[1] === 'TRIPLE' ? 'bg-[#c96e02]' : 'bg-[#ff8a00]'}`}
          textStyles='min-w-26'
          title="TRIPLE"
          onPress={() => handleSpecialStateClick('TRIPLE')}
          isDisabled={handleDisabledSpecial('TRIPLE')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} bg-red`}
          textStyles='min-w-26'
          title="BACK"
          onPress={() => handleClick('BACK')}
          isDisabled={handleDisabledSpecial('BACK')}
        />
      </View>
    </View>
  )
}

export default GameKeyboard