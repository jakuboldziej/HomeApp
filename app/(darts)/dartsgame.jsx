import { Text, View, AppState } from 'react-native'
import { useContext, useState, useRef } from 'react'
import CustomButton from '../../components/Custom/CustomButton'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { socket, ensureSocketConnection } from '../../lib/socketio'
import { DartsGameContext } from '../../context/DartsGameContext'
import GameKeyboard from '../../components/dartsGame/GameKeyboard'
import GameSummary from '../../components/dartsGame/GameSummary'
import { useKeepAwake } from 'expo-keep-awake'
import LoadingScreen from '../../components/LoadingScreen'
import { getDartsGame } from '../../lib/fetch'
import { DrawerActions } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'

const DartsGame = () => {
  useKeepAwake();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  const { game, setGame } = useContext(DartsGameContext);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [visibleModal, setVisibleModal] = useState(false);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  useEffect(() => {
    let mounted = true;

    // Prevent back button
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
      }
    });

    const initializeGame = async () => {
      try {
        const parsedGame = JSON.parse(params.game);

        await ensureSocketConnection();

        if (mounted) {
          socket.emit("joinLiveGamePreview", JSON.stringify({
            gameCode: parsedGame.gameCode
          }));

          setGame(parsedGame);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        if (mounted) {
          router.replace("/darts");
        }
      }
    };

    initializeGame();

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('DartsGame: App came to foreground, refreshing game state...');

        if (game && game.gameCode) {
          try {
            await ensureSocketConnection();

            socket.emit("joinLiveGamePreview", JSON.stringify({
              gameCode: game.gameCode
            }));

            const freshGame = await getDartsGame(game._id);
            if (freshGame && mounted) {
              setGame(freshGame);
              console.log('DartsGame: Game state refreshed from database');
            }
          } catch (error) {
            console.error('DartsGame: Failed to refresh game state:', error);
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [game?.gameCode, game?._id]);

  useEffect(() => {
    if (!game || isLoading) return;

    if (game.active === false) {
      // router.replace('dartsgamemodal');
      showModal();
    } else hideModal();

    setCurrentUser(game.users.find((user) => user.displayName === game.turn));
  }, [game]);

  if (!game || !currentUser) return <LoadingScreen text="Loading game..." />

  return (
    <SafeAreaView className="h-full bg-black">
      <View className="w-full h-full flex flex-col items-center justify-evenly">
        <IconButton
          icon="menu"
          iconColor="white"
          size={28}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ position: 'absolute', top: 8, right: 8, zIndex: visibleModal ? -1 : 10 }}
        />
        <Text className="font-pregular text-white text-xl absolute top-2 left-2">Round: {game.round}</Text>
        <View className="flex flex-col items-center">
          <Text className="font-pregular text-white text-3xl">{currentUser.displayName}</Text>
          <Text className="font-pbold text-white text-2xl mt-2">{currentUser.points}</Text>
          <View className="flex flex-row w-44 justify-between mt-2">
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T1</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[1]}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T2</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[2]}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className="font-psemibold text-white text-xl">T3</Text>
              <Text className="font-psemibold text-white text-xl">{currentUser.turns[3]}</Text>
            </View>
          </View>
        </View>
        <View>
          <GameKeyboard />
        </View>
        <GameSummary visibleModal={visibleModal} hideModal={hideModal} />
      </View>
    </SafeAreaView>
  )
}

export default DartsGame