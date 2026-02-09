import { Text } from "react-native";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";

const CustomButton = ({
  title,
  onPress,
  containerStyle,
  textStyles,
  isLoading,
  isDisabled,
  isKeyboard
}) => {
  return (
    <TouchableRipple
      onPress={onPress}
      className={`bg-lime-500 rounded-xl ${isKeyboard ? "w-1/5" : ""} h-16 px-4 flex flex-row justify-center items-center ${containerStyle} ${isLoading || isDisabled ? "opacity-60" : ""
        }`}
      disabled={isLoading || isDisabled}
    >
      <>
        <Text className={`text-primary font-psemibold text-lg text-center ${textStyles}`}>
          {title}
        </Text>

        {isLoading && (
          <ActivityIndicator
            color="#fff"
            size="small"
            className="pl-4"
          />
        )}
      </>
    </TouchableRipple>
  );
};

export default CustomButton;