import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MapView from "react-native-maps";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/services/getProfile";
import { updateDriverStatus } from "@/services/updateDriverStatus";

export default function HomeScreen() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: any) => {
      return updateDriverStatus(newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      ToastAndroid.show("Status updated successfully!", ToastAndroid.SHORT);
    },
    onError: (error: any) => {
      ToastAndroid.show(
        error?.response?.data?.message || "Something went wrong",
        ToastAndroid.LONG
      );
    },
  });

  const toggleStatus = () => {
    const newStatus = user?.user?.status === "Online" ? "Offline" : "Online";
    updateStatusMutation.mutate({ status: newStatus });
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} />
      </View>

      {/* Status Controls */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {user?.user?.status === "Online"
            ? "You are ONLINE"
            : "You are OFFLINE"}
        </Text>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            {
              backgroundColor:
                user?.user?.status === "Online" ? "red" : "green",
            },
          ]}
          onPress={toggleStatus}
        >
          <Text style={styles.toggleButtonText}>
            {user?.user?.status === "Online" ? "GO OFFLINE" : "GO ONLINE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statusContainer: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#1a1a1a",
    opacity: 0.8,
  },
  statusText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  toggleButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
