import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './styles/theme';
import { useFonts } from 'expo-font';
import { Screen } from './styles/global';
import Header from './components/Header';
import Bottom from './components/Bottom';
import { View } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Bold: require('./assets/fonts/WantedSansStd-SemiBold.otf'),
    Medium: require('./assets/fonts/WantedSansStd-Medium.otf'),
    Regular: require('./assets/fonts/WantedSansStd-Regular.otf'),
  });

  if (!fontsLoaded) {
    return null; // 추후 로딩으로 변경
  }

  return (
    <ThemeProvider theme={theme}>
      <Screen>
        <View style={{ flex: 1 }}>
          <Header />

          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: theme.colors.background },
              }}
            />
          </View>

          <Bottom />
        </View>
      </Screen>
    </ThemeProvider>
  );
}
