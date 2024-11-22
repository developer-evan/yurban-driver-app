import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Edit } from "react-feather"; // Make sure to import your Edit icon
import config from "@/lib/config";
import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/getProfile";
import { Colors } from "@/constants/Colors";
import { LogOut, MapPinned, Pen, User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  profilePicture: string;
  firstName: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  user: {
    profilePicture: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phoneNumber: string;
    county: string;
    gender: string;
  };
}

const Profile = () => {
  // const [user, setUser] = useState<User | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Function to fetch profile data
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axiosInstance.get(`${config.apiUrl}/profile`);
  //       setUser(response.data);
  //       setIsLoading(false);
  //     } catch (err: any) {
  //       setError(err.message || "Failed to load profile");
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error?.toString()}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "user_id",
        "username",
        "session_token",
        "email",
      ]);
      console.log("User logged out successfully.");
      router.push("/(auth)" as any); 
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          // flex: 1,
          // justifyContent: "center",
          // alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            width: "100%",
            // backgroundColor: "#f8f9fa",
            gap: 20,
          }}
        >
          <Image
            source={{ uri: user?.user?.profilePicture }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.name}>
              {user?.user?.firstName} {user?.user?.lastName}
            </Text>
            <Text style={styles.role}>
              {user?.user?.role || "Not available"}
            </Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="#6c757d"
            style={styles.icon}
          />
          <Text style={styles.detailText}>{user?.user?.email}</Text>
        </View>

        <View style={styles.detailContainer}>
          <FontAwesome
            name="phone"
            size={24}
            color="#6c757d"
            style={styles.icon}
          />
          <Text style={styles.detailText}>
            {user?.user?.phoneNumber || "Not available"}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <MapPinned size={24} color="#6c757d" style={styles.icon} />
          <Text style={styles.detailText}>
            {user?.user?.subCounty || "Not available"} -
            {user?.user?.county || "Not available"}
          </Text>
        </View>

        <View style={styles.detailContainer}>
          <User size={24} color="#6c757d" style={styles.icon} />
          <Text style={styles.detailText}>
            {user?.user?.gender || "Not available"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.light.tint,
          width: "85%",
          padding: 12,
          borderRadius: 10,
          marginVertical: 6,
          marginHorizontal: 6,
          justifyContent: "center",
        }}
        onPress={handleLogout}
      >
        {/* <Pen size={24} color="white" style={styles.icon} /> */}
        <LogOut size={24} color="white" style={styles.icon} />
        <Text style={[styles.detailText, { color: "white" }]}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
    padding: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    // borderColor: "#A78BFA",
    borderColor: Colors.light.tint,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  role: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 20,
    fontStyle: "italic",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 8,
    borderRadius: 10,
    marginVertical: 3,
  },
  icon: {
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#1E90FF",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#d9534f",
  },
});
