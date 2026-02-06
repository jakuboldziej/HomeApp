import { Text, View, AppState, useWindowDimensions } from 'react-native'
import { useContext, useState, useRef, useMemo } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { socket, ensureSocketConnection, trackRoom } from '../../lib/socketio'
import { DartsGameContext } from '../../context/DartsGameContext'
import GameKeyboard from '../../components/dartsGame/GameKeyboard'
import GameSummary from '../../components/dartsGame/GameSummary'
import { useKeepAwake } from 'expo-keep-awake'
import LoadingScreen from '../../components/LoadingScreen'
import { getDartsGame } from '../../lib/fetch'
import { DrawerActions } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import NumberTicker from '../../components/Custom/NumberTicker';

const DartsGame = () => {
  useKeepAwake();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const { width, height } = useWindowDimensions();

  const { game, setGame, overthrow } = useContext(DartsGameContext);

  const [currentUser, setCurrentUser] = useState(null);
  const [nextUser, setNextUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [visibleModal, setVisibleModal] = useState(false);

  const sizes = useMemo(() => {
    const isSmallScreen = height < 700;
    const isMediumScreen = height >= 700 && height < 850;

    return {
      currentNameSize: isSmallScreen ? 'text-2xl' : isMediumScreen ? 'text-3xl' : 'text-4xl',
      currentPointsSize: isSmallScreen ? 'text-xl' : isMediumScreen ? 'text-2xl' : 'text-3xl',
      turnsSize: isSmallScreen ? 'text-lg' : 'text-xl',
      turnsWidth: isSmallScreen ? 'w-36' : 'w-44',
      nextUserNameSize: isSmallScreen ? 'text-base' : 'text-lg',
      nextUserPointsSize: isSmallScreen ? 'text-sm' : 'text-base',
      roundSize: isSmallScreen ? 'text-lg' : 'text-xl',
      spacing: isSmallScreen ? 'mt-1' : 'mt-2',
      nextUserSpacing: isSmallScreen ? 'mt-3' : 'mt-4',
    };
  }, [height]);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    // Prevent back button
    navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault();
      }
    });

    const initializeGame = async () => {
      if (hasInitializedRef.current) {
        return;
      }

      try {
        const parsedGame = JSON.parse(params.game);
        hasInitializedRef.current = true;

        await ensureSocketConnection();

        if (mounted) {
          trackRoom(parsedGame.gameCode);
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

        const currentGame = game;
        if (currentGame && currentGame.gameCode) {
          try {
            await ensureSocketConnection();

            socket.emit("joinLiveGamePreview", JSON.stringify({
              gameCode: currentGame.gameCode
            }));

            const freshGame = await getDartsGame(currentGame._id);
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
  }, []);

  useEffect(() => {
    if (!game || isLoading) return;

    if (game.active === false) {
      // router.replace('dartsgamemodal');
      showModal();
    } else hideModal();

    if (!game.users || game.users.length === 0) {
      console.warn('DartsGame: No users in game');
      return;
    }

    const currentUserIndex = game.users.findIndex((user) => user.displayName === game.turn);

    if (currentUserIndex === -1) {
      console.warn('DartsGame: Current turn user not found, using first user');
      setCurrentUser(game.users[0]);
      setNextUser(game.users.length > 1 ? game.users[1] : null);
      return;
    }

    setCurrentUser(game.users[currentUserIndex]);

    const nextUserIndex = (currentUserIndex + 1) % game.users.length;
    setNextUser(game.users.length > 1 ? game.users[nextUserIndex] : null);
  }, [game]);

  if (!game || !currentUser) return <LoadingScreen text="Loading game..." />

  const isOverthrow = overthrow === currentUser.displayName;

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
        <Text className={`font-pregular text-white ${sizes.roundSize} absolute top-2 left-2`}>
          Round: {game.round}
        </Text>

        <View className="flex flex-col items-center">
          <Text className={`font-pregular text-white ${sizes.currentNameSize}`}>
            {currentUser.displayName}
          </Text>
          <NumberTicker
            value={currentUser.points}
            startValue={game.startPoints}
            className={`font-pbold ${sizes.currentPointsSize} ${sizes.spacing}`}
            style={{ color: isOverthrow ? '#E00000' : 'white' }}
          />
          <View className={`flex flex-row ${sizes.turnsWidth} justify-between ${sizes.spacing}`}>
            <View className="flex flex-col items-center">
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>T1</Text>
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>{currentUser.turns?.[1] ?? ''}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>T2</Text>
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>{currentUser.turns?.[2] ?? ''}</Text>
            </View>
            <View className="flex flex-col items-center">
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>T3</Text>
              <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>{currentUser.turns?.[3] ?? ''}</Text>
            </View>
          </View>

          {nextUser && (
            <View className={`flex flex-row items-center ${sizes.nextUserSpacing} opacity-60`}>
              <Text className={`font-pregular text-gray-400 ${sizes.nextUserPointsSize}`}>Next: </Text>
              <Text className={`font-psemibold text-white ${sizes.nextUserNameSize}`}>
                {nextUser.displayName}
              </Text>
              <Text className={`font-pregular text-gray-400 ${sizes.nextUserPointsSize} ml-2`}>
                ({nextUser.points} pts)
              </Text>
            </View>
          )}
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