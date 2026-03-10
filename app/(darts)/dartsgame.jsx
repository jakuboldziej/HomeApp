import { Text, View, AppState, useWindowDimensions } from 'react-native'
import { useContext, useState, useRef, useMemo, useEffect } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { socket, ensureSocketConnection, trackRoom } from '../../lib/socketio'
import { DartsGameContext } from '../../context/DartsGameContext'
import GameKeyboard from '../../components/dartsGame/GameKeyboard'
import GameSummary from '../../components/dartsGame/GameSummary'
import { useKeepAwake } from 'expo-keep-awake'
import LoadingScreen from '../../components/LoadingScreen'
import { getDartsGame } from '../../lib/fetch'
import { DrawerActions } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import NumberTicker from '../../components/Custom/NumberTicker'
import { AuthContext } from '../../context/AuthContext'

const DartsGame = () => {
  useKeepAwake()

  const { gameCode } = useLocalSearchParams()
  const navigation = useNavigation()
  const { height } = useWindowDimensions()

  const { user } = useContext(AuthContext)
  const { game, setGame, overthrow } = useContext(DartsGameContext)

  const appState = useRef(AppState.currentState)

  const [isLoading, setIsLoading] = useState(true)
  const [visibleModal, setVisibleModal] = useState(false)

  const hideModal = () => setVisibleModal(false)

  const sizes = useMemo(() => {
    const isSmallScreen = height < 700
    const isMediumScreen = height < 850

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
    }
  }, [height])

  const { currentUser, nextUser } = useMemo(() => {
    if (!game?.users?.length) {
      return { currentUser: null, nextUser: null }
    }

    const currentIndex = game.users.findIndex(
      u => u.displayName === game.turn
    )

    const safeIndex = currentIndex === -1 ? 0 : currentIndex
    const nextIndex = (safeIndex + 1) % game.users.length

    return {
      currentUser: game.users[safeIndex],
      nextUser: game.users.length > 1 ? game.users[nextIndex] : null
    }
  }, [game])

  const canUserInteract =
    game &&
    user &&
    (game.users.some(u => u.displayName === user.displayName) ||
      game?.tournamentId?.admin === user?.displayName)

  useEffect(() => {
    if (!gameCode) return

    let mounted = true

    const initializeGame = async () => {
      try {
        setIsLoading(true)

        await ensureSocketConnection()

        const fetchedGame = await getDartsGame(gameCode)

        if (!fetchedGame) {
          router.replace("/darts")
          return
        }

        if (!mounted) return

        setGame(fetchedGame)

        trackRoom(fetchedGame.gameCode)

        socket.emit(
          "joinLiveGamePreview",
          JSON.stringify({ gameCode: fetchedGame.gameCode })
        )

        setIsLoading(false)

      } catch (error) {
        console.error("Failed to initialize game:", error)
        router.replace("/darts")
      }
    }

    initializeGame()

    return () => {
      mounted = false
    }
  }, [gameCode])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === "GO_BACK") {
        e.preventDefault()
      }
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {

    const subscription = AppState.addEventListener('change', async (nextAppState) => {

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {

        const currentGame = game
        if (!currentGame?.gameCode) return

        try {

          await ensureSocketConnection()

          socket.emit(
            "joinLiveGamePreview",
            JSON.stringify({ gameCode: currentGame.gameCode })
          )

          const freshGame = await getDartsGame(currentGame.gameCode)

          if (freshGame) {
            setGame(freshGame)
          }

        } catch (error) {
          console.error('Failed to refresh game:', error)
        }
      }

      appState.current = nextAppState
    })

    return () => subscription.remove()

  }, [game])

  useEffect(() => {
    if (game && !game.active) {
      setVisibleModal(true)
    }
  }, [game?.active])

  if (isLoading || !game || !currentUser) {
    return <LoadingScreen text="Loading game..." />
  }

  const isOverthrow = overthrow === currentUser.displayName

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

            {[1, 2, 3].map(turn => (
              <View key={turn} className="flex flex-col items-center">
                <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>
                  T{turn}
                </Text>
                <Text className={`font-psemibold text-white ${sizes.turnsSize}`}>
                  {currentUser.turns?.[turn] ?? ''}
                </Text>
              </View>
            ))}

          </View>

          {nextUser && (
            <View className={`flex flex-row items-center ${sizes.nextUserSpacing} opacity-60`}>
              <Text className={`font-pregular text-gray-400 ${sizes.nextUserPointsSize}`}>
                Next:
              </Text>

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
          {canUserInteract
            ? <GameKeyboard />
            : <Text className="text-white/50">Spectating mode</Text>
          }
        </View>

        <GameSummary visibleModal={visibleModal} hideModal={hideModal} />

      </View>
    </SafeAreaView>
  )
}

export default DartsGame