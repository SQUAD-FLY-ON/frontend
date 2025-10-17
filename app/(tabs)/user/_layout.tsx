import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="my-flight-records" options={{ headerShown: false }} />
      <Stack.Screen
        name="flight-detail/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
