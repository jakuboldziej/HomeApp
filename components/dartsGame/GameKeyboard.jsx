import { View, useWindowDimensions } from 'react-native';
import { useContext, useState, useRef, useMemo } from 'react';
import CustomButton from '../Custom/CustomButton';
import { DartsGameContext } from '../../context/DartsGameContext';
import { socket } from '../../lib/socketio';

const GameKeyboard = () => {
  const { game } = useContext(DartsGameContext);
  const [specialState, setSpecialState] = useState([false, ""]);
  const pendingRequest = useRef(false);
  const lastRequestTime = useRef(0);
  const minRequestInterval = 100;
  const { width, height } = useWindowDimensions();

  const sizes = useMemo(() => {
    const isSmallScreen = height < 700;
    const isNarrowScreen = width < 380;
    const isVeryNarrowScreen = width < 340;

    return {
      numberButtonWidth: isNarrowScreen ? 'w-12' : isSmallScreen ? 'w-14' : 'w-16',
      specialButtonFontSize: isVeryNarrowScreen ? 'text-xs' : isNarrowScreen ? 'text-xs' : 'text-[3.5vw]',
      buttonMargin: isSmallScreen ? 'm-0.5' : 'm-0.5',
      specialButtonSpacing: isSmallScreen ? 'pt-6' : 'pt-10',
    };
  }, [width, height]);

  const inputTailwind = `bg-creamy rounded-[25px] ${sizes.buttonMargin}`;

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
  for (let i = 1; i <= 20; i++) {
    numbers.push(
      <CustomButton
        isKeyboard={true}
        key={i}
        title={i}
        textStyles={sizes.numberButtonWidth}
        containerStyle={inputTailwind}
        onPress={() => handleClick(i)}
      />
    );
  }

  return (
    <View>
      <View className="flex flex-row flex-wrap justify-center">
        {numbers}
        <CustomButton
          containerStyle={inputTailwind}
          textStyles={sizes.numberButtonWidth}
          title="25" isDisabled={specialState[1] === "TRIPLE"}
          onPress={() => handleClick(25)}
          isKeyboard={true}
        />
        <CustomButton
          containerStyle={inputTailwind}
          textStyles={sizes.numberButtonWidth}
          title="0"
          isDisabled={specialState[0]}
          onPress={() => handleClick(0)}
          isKeyboard={true}
        />
      </View>
      <View className={`flex flex-row justify-center px-2 ${sizes.specialButtonSpacing}`}>
        <CustomButton
          containerStyle={`${inputTailwind} bg-[#00B524] flex-1`}
          textStyles={sizes.specialButtonFontSize}
          title="DOORS"
          onPress={() => handleClick('DOORS')}
          isDisabled={handleDisabledSpecial('DOORS')}
          isKeyboard={true}
        />
        <CustomButton
          containerStyle={`${inputTailwind} ${specialState[1] === 'DOUBLE' ? 'bg-[#c4a100]' : 'bg-[#ffd100]'} flex-1`}
          textStyles={sizes.specialButtonFontSize}
          title="DOUBLE"
          onPress={() => handleSpecialStateClick('DOUBLE')}
          isDisabled={handleDisabledSpecial('DOUBLE')}
          isKeyboard={true}
        />
        <CustomButton
          containerStyle={`${inputTailwind} ${specialState[1] === 'TRIPLE' ? 'bg-[#c96e02]' : 'bg-[#ff8a00]'} flex-1`}
          textStyles={sizes.specialButtonFontSize}
          title="TRIPLE"
          onPress={() => handleSpecialStateClick('TRIPLE')}
          isDisabled={handleDisabledSpecial('TRIPLE')}
          isKeyboard={true}
        />
        <CustomButton
          containerStyle={`${inputTailwind} bg-red flex-1`}
          textStyles={sizes.specialButtonFontSize}
          title="BACK"
          onPress={() => handleClick('BACK')}
          isDisabled={handleDisabledSpecial('BACK')}
          isKeyboard={true}
        />
      </View>
    </View>
  )
}

export default GameKeyboard