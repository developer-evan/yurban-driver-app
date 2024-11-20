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
  }   
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
    data:user,
    isLoading,
    error    
  } =useQuery({
    queryKey: ["profile"],
    queryFn:getUserProfile,
  })

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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          width: "100%",
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
          <Text style={styles.role}>{user?.user?.role || "Not available"}</Text>
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
        <FontAwesome
          name="globe"
          size={24}
          color="#6c757d"
          style={styles.icon}
        />
        <Text style={styles.detailText}>
          {user?.user?.county || "Not available"}
        </Text>
      </View>

      <View style={styles.detailContainer}>
        <MaterialIcons
          name="location-on"
          size={24}
          color="#6c757d"
          style={styles.icon}
        />
        <Text style={styles.detailText}>
          {user?.user?.gender || "Not available"}
        </Text>
      </View>

      {/* <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#6B21A8",
          width: "100%",
          padding: 12,
          borderRadius: 10,
          marginVertical: 6,
          justifyContent: "center",
        }}
      >
        <Edit size={18} color="white" />
        <Text style={[styles.detailText, { color: "white" }]}>
          Edit Profile
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#A78BFA",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A78BFA",
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
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
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
