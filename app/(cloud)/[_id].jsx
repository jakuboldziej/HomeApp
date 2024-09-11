import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Appbar, Divider, TouchableRipple } from 'react-native-paper';
import React, { useRef, useCallback, useMemo } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Folder, FolderInput, Info, Link2, PencilLine, Trash2, UserPlus } from 'lucide-react-native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function DocumentScreen() {
  const { _id, title } = useLocalSearchParams();

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ['25%', '65%', '100%'], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
      />
    ),
    []
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={title} />
        <Appbar.Action icon={MORE_ICON} onPress={() => handlePresentModalPress()} />
      </Appbar.Header>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl">{_id}</Text>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        topInset={useSafeAreaInsets().top + 64}
        backgroundStyle={{ backgroundColor: 'pink' }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1">
          <View className="p-4 flex-row gap-2 items-center">
            <Folder size={20} color="black" />
            <Text className="text-xl font-pregular">{title}</Text>
          </View>
          <Divider bold={true} className="bg-black mb-2" />
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <UserPlus size={20} color="black" />
              <Text className="text-xl font-pregular">Share</Text>
            </View>
          </TouchableRipple>
          <Divider bold={true} className="bg-black my-2" />
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <Link2 size={20} color="black" />
              <Text className="text-xl font-pregular">Copy link</Text>
            </View>
          </TouchableRipple>
          <Divider bold={true} className="bg-black my-2" />
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <PencilLine size={20} color="black" />
              <Text className="text-xl font-pregular">Change name</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <FolderInput size={20} color="black" />
              <Text className="text-xl font-pregular">Move</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <Info size={20} color="black" />
              <Text className="text-xl font-pregular">Info & activity</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => { }}>
            <View className="p-4 flex-row gap-2 items-center">
              <Trash2 size={20} color="black" />
              <Text className="text-xl font-pregular">Delete</Text>
            </View>
          </TouchableRipple>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}