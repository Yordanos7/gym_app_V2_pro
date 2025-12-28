import "@/global.css"; // here the css is imported as global 

import { Stack } from "expo-router"; 
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useSession } from "@/lib/use-session"; // here is the better auth is came and used for the  auth  create by the fetch by the server

import SplashScreen from "@/components/SplashScreen"; 

function AuthCheck() {
  const { data: session, isPending } = useSession();
  const segments = useSegments(); // this is use for show where the user is in screen 
  const router = useRouter();

   // this useeffect use for make  the auth applied when user is open the app 
  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!session && !inAuthGroup) {
      // Redirect to welcome screen if not authenticated
      router.replace("/(auth)/welcome");
    } else if (session && inAuthGroup) {
      // Redirect to tabs if authenticated and in auth group
      router.replace("/(tabs)");
    }
  }, [session, isPending, segments]);

  if (isPending) {
    return <SplashScreen />;
  }

  return null;
}
 // this is a place where the react native now about the app like make on the screen route 
 // This defines HOW navigation works between the main sections of your app
function StackLayout() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}
// this StackLayout() → Navigation rules
export default function Layout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardProvider>
				<AppThemeProvider>
					<HeroUINativeProvider>
						<AuthCheck /> 
						<StackLayout /> 
					</HeroUINativeProvider>
				</AppThemeProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}
