import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Checkbox, Switch, TextInput, TouchableRipple } from 'react-native-paper';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { DartsGameContext } from '../../context/DartsGameContext';
import CustomButton from '../Custom/CustomButton';
import CustomSnackBar from '../Custom/CustomSnackBar';
import { socket, ensureSocketConnection, trackRoom } from '../../lib/socketio';
import {
  getAuthUser,
  getDartsUser,
  getESP32Availability,
  getInitialUsersGameState,
  postDartsGame,
  postESP32JoinGame
} from '../../lib/fetch';

const startPointsOptions = ['101', '201', '301', '401', '501', '601', '701', '801', '901', '1001'];
const checkOutOptions = ['Any Out', 'Straight Out', 'Double Out', 'Triple Out'];
const legsSetsOptions = [0, 1, 2, 3, 4, 5, 6];
const gameModeOptions = ['X01', 'Around the Clock'];

const OptionChip = ({ label, selected, onPress }) => (
  <TouchableRipple
    onPress={onPress}
    className={`rounded-full border mr-2 mb-2 ${selected ? 'bg-lime-500 border-lime-500' : 'bg-black border-white/40'}`}
  >
    <View className="px-4 py-2">
      <Text className={`font-pregular ${selected ? 'text-black' : 'text-white'}`}>{label}</Text>
    </View>
  </TouchableRipple>
);

const CreateGameSheet = forwardRef((_props, ref) => {
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ['60%', '92%'], []);

  const insets = useSafeAreaInsets();

  const { user } = useContext(AuthContext);
  const { setGame } = useContext(DartsGameContext);

  const [usersNotPlaying, setUsersNotPlaying] = useState([]);
  const [usersPlaying, setUsersPlaying] = useState([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const [podiumOptions, setPodiumOptions] = useState([]);
  const [usersPodium, setUsersPodium] = useState('None');

  const [randomizePlayers, setRandomizePlayers] = useState(true);

  const [selectGameMode, setSelectGameMode] = useState('X01');
  const [selectStartPoints, setSelectStartPoints] = useState('501');
  const [customStartPoints, setCustomStartPoints] = useState('');
  const [showCustomPoints, setShowCustomPoints] = useState(false);
  const [selectCheckOut, setSelectCheckOut] = useState('Any Out');
  const [selectLegs, setSelectLegs] = useState(1);
  const [selectSets, setSelectSets] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  const [WLEDon, setWLEDon] = useState(false);
  const [WLEDAvailable, setWLEDAvailable] = useState(false);

  const [newUserName, setNewUserName] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const [loading, setLoading] = useState(false);
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const isCustomStartPoints = !startPointsOptions.includes(selectStartPoints);

  const showError = (message) => {
    setSnackMessage(message || 'Something went wrong');
    setVisibleSnack(true);
  };

  const resetSettings = () => {
    setUsersPlaying([]);
    setSelectGameMode('X01');
    setSelectStartPoints('501');
    setCustomStartPoints('');
    setShowCustomPoints(false);
    setSelectCheckOut('Any Out');
    setSelectLegs(1);
    setSelectSets(0);
    setIsTraining(false);
    setRandomizePlayers(true);
    setNewUserName('');
    setShowAddUser(false);
  };

  const loadData = async () => {
    if (!user) return;

    resetSettings();
    setIsFetchingUsers(true);

    try {
      const ownDartsUser = await getDartsUser(user.displayName);
      const authUser = await getAuthUser(user.displayName);
      const friendsDisplayNames = authUser?.friends || [];

      const friendsDartsUsers = await Promise.all(
        friendsDisplayNames.map((friendDisplayName) => getDartsUser(friendDisplayName))
      );

      const visibleFriends = friendsDartsUsers.filter((friend) => friend && friend.visible === true);

      setUsersNotPlaying([ownDartsUser, ...visibleFriends].filter(Boolean));
    } catch (error) {
      console.error('Failed to load darts users:', error);
      showError('Failed to load players');
    } finally {
      setIsFetchingUsers(false);
    }

    try {
      const availability = await getESP32Availability();
      setWLEDAvailable(!!availability?.available);
      setWLEDon(!!availability?.available);
    } catch (error) {
      console.error('Failed to check WLED availability:', error);
      setWLEDAvailable(false);
      setWLEDon(false);
    }
  };

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetModalRef.current?.present();
      loadData();
    },
    close: () => {
      bottomSheetModalRef.current?.close();
    }
  }));

  useEffect(() => {
    if (usersPlaying.length > 0) {
      const maxPodium = Math.min(3, usersPlaying.length);
      const options = [];
      for (let i = 1; i <= maxPodium; i++) options.push(i);

      setPodiumOptions(options);
      setUsersPodium((prev) => (typeof prev === 'number' && prev <= maxPodium ? prev : 1));
    } else {
      setPodiumOptions([]);
      setUsersPodium('None');
    }
  }, [usersPlaying.length]);

  const handleAddPlayer = (playerUser) => {
    setUsersPlaying((prev) => [...prev, playerUser]);
    setUsersNotPlaying((prev) => prev.filter((notPlayingUser) => notPlayingUser._id !== playerUser._id));
  };

  const handleRemovePlayer = (playerUser) => {
    setUsersPlaying((prev) => prev.filter((notPlayingUser) => notPlayingUser._id !== playerUser._id));
    if (!playerUser.temporary) {
      setUsersNotPlaying((prev) => [...prev, playerUser]);
    }
  };

  const handleAddingNewUser = async () => {
    const trimmedName = newUserName.trim();
    if (!trimmedName) return;

    try {
      const existingUser = await getDartsUser(trimmedName);
      if (existingUser && !existingUser.message) {
        showError("This user exists, you can't add it as a guest");
        return;
      }
    } catch (error) {
      console.error('Failed to check existing user:', error);
    }

    const userInList = usersPlaying.find((playingUser) => playingUser.displayName === trimmedName);
    if (userInList) {
      showError('This user is already playing');
      return;
    }

    const tempUser = {
      temporary: true,
      _id: `temp_user_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      displayName: trimmedName,
      gamesPlayed: 0,
      podiums: {
        firstPlace: 0,
        secondPlace: 0,
        thirdPlace: 0
      },
      overAllPoints: 0,
      highestEndingAvg: 0,
      highestTurnPoints: 0,
      highestCheckout: 0,
      throws: {
        normal: 0,
        doubles: 0,
        triples: 0,
        overthrows: 0,
        doors: 0
      }
    };

    setUsersPlaying((prev) => [...prev, tempUser]);
    setNewUserName('');
    setShowAddUser(false);
  };

  const handleSelectStartPoints = (value) => {
    if (value === 'Custom') {
      setShowCustomPoints(true);
      return;
    }
    setShowCustomPoints(false);
    setCustomStartPoints('');
    setSelectStartPoints(value);
  };

  const handleConfirmCustomStartPoints = () => {
    const parsed = parseInt(customStartPoints, 10);
    if (!parsed || parsed <= 0) {
      showError('Enter a valid start points value');
      return;
    }
    setSelectStartPoints(String(parsed));
    setShowCustomPoints(false);
  };

  const handleStart = async () => {
    if (!user) return;

    setLoading(true);

    try {
      if (!isTraining && !user.verified) {
        showError('You have to be verified to play official game');
        return;
      }

      if (usersPlaying.length === 0) {
        showError('You have to select users to play');
        return;
      }

      if (usersPlaying.length === 1 && !isTraining) {
        showError('You have to select at least 2 players to play');
        return;
      }

      if (selectLegs === 0 && selectSets === 0) {
        showError('You must set at least legs or sets to a value greater than 0');
        return;
      }

      const updatedUsers = await getInitialUsersGameState(usersPlaying, selectStartPoints, randomizePlayers);

      const gameData = {
        created_by: user.displayName,
        users: updatedUsers,
        podiums: usersPodium,
        podium: {
          1: null,
          2: null,
          3: null
        },
        turn: updatedUsers[0].displayName,
        active: true,
        gameMode: selectGameMode,
        startPoints: selectStartPoints,
        checkOut: selectCheckOut,
        legs: selectLegs,
        sets: selectSets,
        round: 1,
        training: isTraining
      };

      const createdGame = await postDartsGame(gameData);

      if (!createdGame || createdGame.message) {
        showError(createdGame?.message || 'Failed to create game');
        return;
      }

      gameData._id = createdGame._id;
      gameData.gameCode = createdGame.gameCode;

      setGame(gameData);

      await ensureSocketConnection();
      trackRoom(createdGame.gameCode);
      socket.emit('joinLiveGamePreview', JSON.stringify({ gameCode: createdGame.gameCode }));

      if (WLEDon) {
        const espResponse = await postESP32JoinGame(createdGame.gameCode);
        if (espResponse?.message) {
          showError(espResponse.message);
        }
      }

      bottomSheetModalRef.current?.close();
      router.push({ pathname: '/(darts)/dartsgame', params: { gameCode: createdGame.gameCode } });
    } catch (error) {
      console.error('Failed to start game:', error);
      showError(error.message || 'Error starting game');
    } finally {
      setLoading(false);
    }
  };

  const renderBackdrop = useCallback((backdropProps) => <BottomSheetBackdrop {...backdropProps} />, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      topInset={insets.top + 64}
      backgroundStyle={{ backgroundColor: '#000000' }}
      handleIndicatorStyle={{ backgroundColor: '#ffffff' }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        className="flex-1 w-full h-full px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <Text className="text-white text-2xl font-psemibold text-center mt-2 mb-4">Create New Game</Text>

        <Text className="text-white font-psemibold text-lg mb-2">Playing</Text>
        {usersPlaying.length === 0 ? (
          <Text className="text-white/50 font-pregular mb-2">No players added yet</Text>
        ) : (
          <View className="flex-row flex-wrap mb-2">
            {usersPlaying.map((playingUser) => (
              <TouchableRipple
                key={playingUser._id}
                onPress={() => handleRemovePlayer(playingUser)}
                className="bg-lime-500 rounded-full mr-2 mb-2"
              >
                <View className="flex-row items-center px-3 py-2">
                  <Text className="text-black font-pregular mr-1">{playingUser.displayName}</Text>
                  <X size={14} color="black" />
                </View>
              </TouchableRipple>
            ))}
          </View>
        )}

        <Text className="text-white font-psemibold text-lg mb-2 mt-2">Add players</Text>
        {isFetchingUsers ? (
          <ActivityIndicator color="#fff" className="mb-2" />
        ) : usersNotPlaying.length === 0 ? (
          <Text className="text-white/50 font-pregular mb-2">No more players to add</Text>
        ) : (
          <View className="flex-row flex-wrap mb-2">
            {usersNotPlaying.map((notPlayingUser) => (
              <TouchableRipple
                key={notPlayingUser._id}
                onPress={() => handleAddPlayer(notPlayingUser)}
                className="border border-white/40 rounded-full mr-2 mb-2"
              >
                <View className="flex-row items-center px-3 py-2">
                  <Plus size={14} color="white" />
                  <Text className="text-white font-pregular ml-1">{notPlayingUser.displayName}</Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        )}

        {showAddUser ? (
          <View className="flex-row items-center mt-1 mb-3">
            <TextInput
              className="bg-creamy flex-1 h-12 font-pregular rounded-xl px-2"
              placeholder="Guest name"
              value={newUserName}
              onChangeText={setNewUserName}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              cursorColor="black"
              returnKeyType="done"
              onSubmitEditing={handleAddingNewUser}
            />
            <TouchableRipple onPress={handleAddingNewUser} className="ml-2 bg-lime-500 rounded-xl p-3">
              <Check size={20} color="black" />
            </TouchableRipple>
            <TouchableRipple
              onPress={() => {
                setShowAddUser(false);
                setNewUserName('');
              }}
              className="ml-2 bg-red rounded-xl p-3"
            >
              <X size={20} color="white" />
            </TouchableRipple>
          </View>
        ) : (
          <TouchableRipple onPress={() => setShowAddUser(true)} className="mt-1 mb-3 border border-white/40 rounded-xl">
            <Text className="text-white font-pregular text-center py-3">+ Add guest player</Text>
          </TouchableRipple>
        )}

        <View className="flex-row items-center mb-3 mt-2">
          <Checkbox
            status={isTraining ? 'checked' : 'unchecked'}
            onPress={() => setIsTraining((prev) => !prev)}
            color="#84cc16"
            uncheckedColor="#ffffff"
          />
          <Text className="text-white font-pregular text-lg">Training</Text>
        </View>

        <Text className="text-white font-psemibold text-lg mb-2">Game Mode</Text>
        <View className="flex-row flex-wrap mb-1">
          {gameModeOptions.map((mode) => (
            <OptionChip key={mode} label={mode} selected={selectGameMode === mode} onPress={() => setSelectGameMode(mode)} />
          ))}
        </View>

        {selectGameMode === 'X01' && (
          <>
            <Text className="text-white font-psemibold text-lg mb-2 mt-2">Start Points</Text>
            <View className="flex-row flex-wrap mb-1">
              {startPointsOptions.map((points) => (
                <OptionChip
                  key={points}
                  label={points}
                  selected={!showCustomPoints && selectStartPoints === points}
                  onPress={() => handleSelectStartPoints(points)}
                />
              ))}
              <OptionChip
                label={isCustomStartPoints && !showCustomPoints ? selectStartPoints : 'Custom'}
                selected={showCustomPoints || isCustomStartPoints}
                onPress={() => handleSelectStartPoints('Custom')}
              />
            </View>

            {showCustomPoints && (
              <View className="flex-row items-center mb-3">
                <TextInput
                  className="bg-creamy flex-1 h-12 font-pregular rounded-xl px-2"
                  placeholder="Custom points"
                  keyboardType="numeric"
                  value={customStartPoints}
                  onChangeText={setCustomStartPoints}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  cursorColor="black"
                  returnKeyType="done"
                  onSubmitEditing={handleConfirmCustomStartPoints}
                />
                <TouchableRipple onPress={handleConfirmCustomStartPoints} className="ml-2 bg-lime-500 rounded-xl p-3">
                  <Check size={20} color="black" />
                </TouchableRipple>
              </View>
            )}

            <Text className="text-white font-psemibold text-lg mb-2 mt-1">Check-Out</Text>
            <View className="flex-row flex-wrap mb-1">
              {checkOutOptions.map((option) => (
                <OptionChip key={option} label={option} selected={selectCheckOut === option} onPress={() => setSelectCheckOut(option)} />
              ))}
            </View>
          </>
        )}

        <Text className="text-white font-psemibold text-lg mb-2 mt-2">Legs</Text>
        <View className="flex-row flex-wrap mb-1">
          {legsSetsOptions.map((num) => (
            <OptionChip key={num} label={String(num)} selected={selectLegs === num} onPress={() => setSelectLegs(num)} />
          ))}
        </View>

        <Text className="text-white font-psemibold text-lg mb-2 mt-1">Sets</Text>
        <View className="flex-row flex-wrap mb-1">
          {legsSetsOptions.map((num) => (
            <OptionChip key={num} label={String(num)} selected={selectSets === num} onPress={() => setSelectSets(num)} />
          ))}
        </View>

        <Text className="text-white font-psemibold text-lg mb-2 mt-2">Podium</Text>
        {podiumOptions.length === 0 ? (
          <Text className="text-white/50 font-pregular mb-3">Select players first</Text>
        ) : (
          <View className="flex-row flex-wrap mb-1">
            {podiumOptions.map((place) => (
              <OptionChip key={place} label={String(place)} selected={usersPodium === place} onPress={() => setUsersPodium(place)} />
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between mt-3 mb-3">
          <Text className="text-white font-pregular text-lg">Randomize turn order</Text>
          <Switch value={randomizePlayers} onValueChange={setRandomizePlayers} color="#84cc16" />
        </View>

        {WLEDAvailable && (
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-pregular text-lg">WLED lights</Text>
            <Switch value={WLEDon} onValueChange={setWLEDon} color="#84cc16" />
          </View>
        )}

        <CustomButton
          title="Start"
          onPress={handleStart}
          isLoading={loading}
          isDisabled={loading || usersPlaying.length === 0}
          containerStyle="mt-2 mb-8 w-full"
        />
      </BottomSheetScrollView>

      <CustomSnackBar title={snackMessage} visible={visibleSnack} setVisible={setVisibleSnack} />
    </BottomSheetModal>
  );
});

export default CreateGameSheet;
