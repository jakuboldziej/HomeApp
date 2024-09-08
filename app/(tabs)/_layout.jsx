import { Tabs } from 'expo-router';
import { House, Package, PackageOpen, Target, User } from 'lucide-react-native';
import CustomTabBar from '../../components/Custom/CustomTabBar';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        contentStyle: { backgroundColor: 'black' }
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <House color={focused ? 'green' : 'black'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="darts"
        options={{
          title: 'Darts',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Target color={focused ? 'green' : 'black'} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="cloud"
        options={{
          title: 'Cloud',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            focused ? <PackageOpen color="green" size={22} /> : <Package color="black" size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <User color={focused ? 'green' : 'black'} size={22} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;