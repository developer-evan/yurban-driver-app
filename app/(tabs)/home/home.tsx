import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await axiosInstance.patch(`${config.apiUrl}/auth/update-status`, {
        status: newStatus ? "Online" : "Offline",
        // console.log("status", newStatus ? "Online" : "Offline") // added this line
      });
      setIsOnline(newStatus);
      ToastAndroid.show(
        `You are now ${newStatus ? "Online" : "Offline"}`,

        // ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location ? location.latitude : 0,
            longitude: location ? location.longitude : 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {location && <Marker coordinate={location} title="Your Location" />}
        </MapView>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {isOnline ? "You are ONLINE" : "You are OFFLINE"}
        </Text>
        {/* <Text style={styles.promotionText}>
          (Enjoy 5% Extra on Rides Today!)
        </Text> */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: isOnline ? "red" : "green" },
          ]}
          onPress={toggleStatus}
        >
          <Text style={styles.toggleButtonText}>
            {isOnline ? "GO OFFLINE" : "GO ONLINE"}
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
  },
  statusText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },
  promotionText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
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
