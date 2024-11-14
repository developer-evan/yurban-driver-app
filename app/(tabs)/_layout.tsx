import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {
            // Use a solid background on Android to prevent rendering issues
            // backgroundColor: Colors[colorScheme ?? "light"].background,
            // marginHorizontal: 10,
            // borderRadius: 25,
            // marginBottom: 10,
            // padding: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home/home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore/explore"
        options={{
          title: "My Rides",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="car.fill" color={color} />
          ),
        }}
      />
      {/* profile  */}
      <Tabs.Screen
        name="profile/profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            // <IconSymbol size={28} name="person" color={color} />
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
