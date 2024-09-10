import { View, Text } from 'react-native'
import { File } from 'lucide-react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'

const FileNode = ({ file }) => {
  return (
    <TouchableRipple onPress={() => console.log("asdf")} rippleColor="rgba(255, 255, 255, 0.3)">
      <View className="flex-row items-center w-full justify-between p-2">
        <View className="flex flex-row items-center max-w-[83%]">
          <File color="white" size={25} />
          <Text numberOfLines={1} className="text-white ml-2 font-pregular text-base">{file.filename}</Text>
        </View>
        <IconButton onPress={() => console.log("menu")} icon="dots-vertical" iconColor='white' size={25} />
      </View>
    </TouchableRipple>
  )
}

export default FileNode