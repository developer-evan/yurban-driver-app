import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, MapPinned, User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getUserProfile } from "@/services/getProfile";
import { Colors } from "@/constants/Colors";

const Profile = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const cachedUser = await AsyncStorage.getItem("user_profile");
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }
      const fetchedUser = await getUserProfile();
      await AsyncStorage.setItem("user_profile", JSON.stringify(fetchedUser));
      return fetchedUser;
    },
  });

  if (error) {
    Alert.alert(
      "Error",
      "Failed to load profile. Please check your internet connection."
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user_id",
        "username",
        "session_token",
        "email",
        "user_profile",
      ]);
      console.log("User logged out successfully.");
      router.push("/(auth)" as any);
    } catch (error) {
      console.error("Failed to log out:", error);
      Alert.alert("Logout Error", "Failed to log out. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity
          onPress={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}
        >
          <Text style={{ color: Colors.light.tint, marginTop: 10 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
        <Image
            source={{
              uri: "https://avatar.iran.liara.run/public/boy?username=Ash",
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>
              {user?.user?.firstName ?? "-"} {user?.user?.lastName ?? "-"}
            </Text>
            <Text style={styles.role}>{user?.user?.role ?? "-"}</Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Email</Text>
          <View style={styles.detailContainer}>
            <MaterialIcons name="email" size={24} color="#6c757d" />
            <Text style={styles.detailText}>{user?.user?.email ?? "-"}</Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Phone</Text>
          <View style={styles.detailContainer}>
            <FontAwesome name="phone" size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.phoneNumber ?? "-"}
            </Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>County</Text>
          <View style={styles.detailContainer}>
            <MapPinned size={24} color="#6c757d" />
            <Text style={styles.detailText}>{user?.user?.county ?? "-"}</Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Sub-County</Text>
          <View style={styles.detailContainer}>
            <MapPinned size={24} color="#6c757d" />
            <Text style={styles.detailText}>
              {user?.user?.subCounty ?? "-"}
            </Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Gender</Text>
          <View style={styles.detailContainer}>
            <User size={24} color="#6c757d" />
            <Text style={styles.detailText}>{user?.user?.gender ?? "-"}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="white" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  role: {
    fontSize: 16,
    color: "#6c757d",
  },
  detailSection: {
    marginBottom: 8,
    paddingBottom: 5,
  },
  detailLabel: {
    color: Colors.light.tint,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.tint,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
  },
});
