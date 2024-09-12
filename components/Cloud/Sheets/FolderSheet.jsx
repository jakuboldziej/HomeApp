import React, { useMemo, useCallback, forwardRef, useRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import { Divider, TouchableRipple } from 'react-native-paper';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Folder, FolderInput, Info, Link2, PencilLine, Trash2, UserPlus } from 'lucide-react-native';

const FolderSheet = forwardRef(({ folder }, ref) => {
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '67%', '100%'], []);

  const insets = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetModalRef.current?.present();
    },
    close: () => {
      bottomSheetModalRef.current?.close();
    }
  }));

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      topInset={insets.top + 64}
      backgroundStyle={{ backgroundColor: 'pink' }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1">
        <View className="p-4 flex-row gap-2 items-center">
          <Folder size={20} color="black" />
          <Text numberOfLines={1} className="text-xl font-pregular">{folder.name}</Text>
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
        <Divider bold={true} className="bg-black my-2" />
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
  );
});

export default FolderSheet;