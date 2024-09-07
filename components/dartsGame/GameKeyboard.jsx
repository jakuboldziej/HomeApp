import { View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import CustomButton from '../CustomButton';
import { DartsGameContext } from '../../context/DartsGameContext';
import { socket } from '../../lib/socketio';

const inputTailwind = "bg-creamy rounded-[25px] m-0.5";

const GameKeyboard = () => {
  const { game } = useContext(DartsGameContext);
  const [specialState, setSpecialState] = useState([false, ""]);

  const handleClick = (input) => {
    socket.emit("externalKeyboardInput", JSON.stringify({
      input: input,
      gameCode: game.gameCode
    }));

    if (input === "DOUBLE" || input === "TRIPLE") {
      specialState[0] ? setSpecialState([false, ""]) : setSpecialState([true, input]);
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
      return specialState[1] === 'DOUBLE' || specialState[1] === 'TRIPLE' || game?.record?.length <= 1;
    }
    return specialState[1] === 'TRIPLE' || specialState[1] === 'DOUBLE' || specialState[1] === type;
  }

  const numbers = [];
  for (let i = 1; i <= 20; i++) numbers.push(<CustomButton key={i} title={i} textStyles='w-16' containerStyle={inputTailwind} onPress={() => handleClick(i)} />);

  return (
    <View>
      <View className="flex flex-row flex-wrap justify-center">
        {numbers}
        <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="25" onPress={() => handleClick(25)} />
        <CustomButton containerStyle={inputTailwind} textStyles='w-16' title="0" onPress={() => handleClick(0)} />
      </View>
      <View className="flex flex-row flex-wrap justify-center pt-10">
        <CustomButton
          containerStyle={`${inputTailwind} bg-green`}
          textStyles='min-w-26'
          title="DOORS"
          onPress={() => handleClick('DOORS')}
          isDisabled={handleDisabledSpecial('DOORS')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} bg-[#ffd100]`}
          textStyles='min-w-26'
          title="DOUBLE"
          onPress={() => handleClick('DOUBLE')}
          isDisabled={handleDisabledSpecial('DOUBLE')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} bg-[#ff8a00]`}
          textStyles='min-w-26'
          title="TRIPLE"
          onPress={() => handleClick('TRIPLE')}
          isDisabled={handleDisabledSpecial('TRIPLE')}
        />
        <CustomButton
          containerStyle={`${inputTailwind} bg-red`}
          textStyles='min-w-26'
          title="BACK"
          onPress={() => handleClick('BACK')}
          isDisabled={handleDisabledSpecial('BACK')}
        />
        {game.training && <CustomButton
          containerStyle={`${inputTailwind} bg-[#E55555]`}
          textStyles='min-w-26'
          title="END"
          onPress={() => handleClick('END')}
          isDisabled={handleDisabledSpecial()}
        />}
        {game?.record?.length === 1 && <CustomButton
          containerStyle={`${inputTailwind} bg-[#E55555]`}
          textStyles='min-w-26'
          title="QUIT"
          onPress={() => handleClick('QUIT')}
          isDisabled={handleDisabledSpecial()}
        />}
      </View>
    </View>
  )
}

export default GameKeyboard