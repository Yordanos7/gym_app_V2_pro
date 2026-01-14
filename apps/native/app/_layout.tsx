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

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = (segments as string[]).includes("(auth)");
    
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, isPending, segments]);

  if (isPending) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

function StackLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="(auth)" />
			<Stack.Screen name="(onboarding)" />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}

export default function Layout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<KeyboardProvider>
				<AppThemeProvider>
					<HeroUINativeProvider>
						<AuthCheck>
						  <StackLayout /> 
						</AuthCheck>
					</HeroUINativeProvider>
				</AppThemeProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}
