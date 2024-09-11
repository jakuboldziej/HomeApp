import { View, Text } from 'react-native'
import { Folder } from 'lucide-react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { router, useNavigation } from 'expo-router'

const FolderNode = ({ folder }) => {
  // const navigation = useNavigation();
  const redirectToFolder = () => {
    // navigation.setParams({ headerTitle: folder.name });
    router.replace({ pathname: `(cloud)/${folder._id}` });
  }

  return (
    <TouchableRipple onPress={() => redirectToFolder()} rippleColor="rgba(255, 255, 255, 0.3)">
      <View className="flex-row items-center w-full justify-between p-2">
        <View className="flex flex-row items-center">
          <Folder color="white" size={25} />
          <Text numberOfLines={1} className="text-white ml-2 font-pregular text-base max-w-10">{folder.name}</Text>
        </View>
        <IconButton onPress={() => console.log("menu")} icon="dots-vertical" iconColor='white' size={25} />
      </View>
    </TouchableRipple>
  )
}

export default FolderNode