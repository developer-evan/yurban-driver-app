import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";
import Maps from "@/components/Maps";

export default function HomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the driver's current location
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

  // Function to toggle online/offline status
  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await axios.post("/update-status", {
        status: newStatus ? "Online" : "Offline",
      });
      setIsOnline(newStatus);
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
      {/* Display current location map */}
      {/* <MapView
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
        {location && <Marker coordinate={location} title="You are here" />}
      </MapView> */}

      {/* <MapViewDirections
  origin={location}
  destination={{ latitude: destLat, longitude: destLng }}
  apikey="AIzaSyBjHiDRnIv_k2j1dMb6XIZYRWuFT5aYCQY"
  strokeWidth={3}
  strokeColor="blue"
/> */}
      <View
        style={{
          width: "100%",
          height: "50%",
          // position: "absolute",
        }}
      >
        <Maps />
      </View>

      {/* Status Toggle Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isOnline ? "Go Offline" : "Go Online"}
          onPress={toggleStatus}
          color={isOnline ? "red" : "green"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
