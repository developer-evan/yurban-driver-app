import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getRideDetails } from "@/services/getRideDetails";
import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Ride = {
  customerId: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    email: string;
    county: string;
    subCounty: string;
  };
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoordinates: Coordinates;
  dropoffCoordinates: Coordinates;
  passengerNumber: number;
  status: string;
  requestedAt: string;
};

const RideDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  if (!id) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid ride ID. Please try again.</Text>
      </View>
    );
  }

  const {
    data: ride,
    isLoading,
    error,
  } = useQuery<Ride>({
    queryKey: ["ride", id],
    queryFn: () => getRideDetails(id as string),
  });

  const updateRideStatus = async (status: string) => {
    try {
      const response = await axiosInstance.patch(
        `${config.apiUrl}/rides/${id}`,
        { status }
      );

      if (response.status === 200) {
        // Alert.alert("Success", `Ride status updated to ${status}`);
        ToastAndroid.show(
          `Ride status updated to ${status}`,
          ToastAndroid.SHORT
        );
        router.push("/(tabs)/my-rides");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      // Alert.alert("Error", "Failed to update ride status. Please try again.");
      ToastAndroid.show(
        "Failed to update ride status. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleAccept = () => updateRideStatus("Accepted");
  const handleDecline = () => updateRideStatus("Rejected");

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading ride details...</Text>
      </View>
    );
  }

  if (error || !ride) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load ride details. Please try again later.
        </Text>
      </View>
    );
  }

  const pickupCoordinates = ride.pickupCoordinates || {
    latitude: 0,
    longitude: 0,
  };
  const dropoffCoordinates = ride.dropoffCoordinates || {
    latitude: 0,
    longitude: 0,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupCoordinates.latitude || 0,
          longitude: pickupCoordinates.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pickupCoordinates.latitude && pickupCoordinates.longitude && (
          <Marker
            coordinate={pickupCoordinates}
            title="Pickup Location"
            description={ride.pickupLocation}
          />
        )}
        {dropoffCoordinates.latitude && dropoffCoordinates.longitude && (
          <Marker
            coordinate={dropoffCoordinates}
            title="Dropoff Location"
            description={ride.dropoffLocation}
          />
        )}
        {pickupCoordinates.latitude && dropoffCoordinates.latitude && (
          <Polyline
            coordinates={[pickupCoordinates, dropoffCoordinates]}
            strokeColor="#007BFF"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Ride Details</Text>
        <Text>
          Passenger Name:{" "}
          {`${ride.customerId?.firstName || ""} ${
            ride.customerId?.lastName || ""
          }`}
        </Text>
        <Text>Phone Number: {ride.customerId?.phoneNumber || "N/A"}</Text>
        <Text>Pickup Location: {ride.pickupLocation || "N/A"}</Text>
        <Text>Dropoff Location: {ride.dropoffLocation || "N/A"}</Text>
        <Text>Passengers: {ride.passengerNumber || "N/A"}</Text>
        <Text
          style={{
            color:
              ride.status === "Pending"
                ? "orange"
                : ride.status === "Accepted"
                ? "green"
                : ride.status === "Rejected"
                ? "red"
                : "#007BFF",
          }}
        >
          Status: {ride.status || "N/A"}
        </Text>
        <Text>
          Requested At:{" "}
          {ride.requestedAt
            ? new Date(ride.requestedAt).toLocaleString()
            : "N/A"}
        </Text>

        {ride.status === "Completed" ? (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessage}>
              The ride has been completed successfully!
            </Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDecline}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* <View style={styles.actions}>
        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  map: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  successText: {
    color: "green",
    backgroundColor: "#e6ffe6",
  },
  pendingText: {
    color: "orange",
    backgroundColor: "#fff4e6",
  },
  rejectedText: {
    color: "red",
    backgroundColor: "#ffe6e6",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  declineButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "#dc3545",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  successMessageContainer: {
    padding: 16,
    backgroundColor: "#d4edda",
    borderRadius: 5,
    marginVertical: 20,
  },
  successMessage: {
    color: "#155724",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default RideDetails;
