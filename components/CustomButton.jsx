import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  onPress,
  containerStyle,
  textStyles,
  isLoading,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-green rounded-xl h-[62px] flex flex-row justify-center items-center ${containerStyle} ${isLoading || isDisabled ? "opacity-50" : ""
        }`}
      disabled={isLoading || isDisabled}
    >
      <Text className={`text-primary font-psemibold text-lg px-4 text-center ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="pr-4"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;