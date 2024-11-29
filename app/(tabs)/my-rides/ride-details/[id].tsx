import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
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
  updatedAt: string | number | Date;
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

const DEFAULT_LOCATION: Coordinates = {
  latitude: -1.286389,
  longitude: 36.817223,
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
    retry: 1,
  });

  const updateRideStatus = async (status: string) => {
    try {
      const response = await axiosInstance.patch(
        `${config.apiUrl}/rides/${id}`,
        { status }
      );

      if (response.status === 200) {
        ToastAndroid.show(
          `Ride status updated to ${status}`,
          ToastAndroid.SHORT
        );
        router.push("/(tabs)/my-rides");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load ride details. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={DEFAULT_LOCATION}
          title="Nairobi"
          description="Default Location"
        />
      </MapView>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Ride Details</Text>
        <Text>
          Passenger Name:{" "}
          {ride?.customerId
            ? `${ride.customerId.firstName} ${ride.customerId.lastName}`
            : "-"}
        </Text>
        <Text>Phone Number: {ride?.customerId?.phoneNumber || "-"}</Text>
        <Text>Pickup Location: {ride?.pickupLocation || "Default Location"}</Text>
        <Text>Dropoff Location: {ride?.dropoffLocation || "Default Location"}</Text>
        <Text>Passengers: {ride?.passengerNumber || "-"}</Text>
        <Text
          style={{
            color:
              ride?.status === "Pending"
                ? "orange"
                : ride?.status === "Accepted"
                ? "green"
                : ride?.status === "Rejected"
                ? "red"
                : "#007BFF",
          }}
        >
          Status: {ride?.status || "-"}
        </Text>
        <Text>
          Time Requested:{" "}
          {ride?.requestedAt
            ? new Date(ride.requestedAt).toLocaleString()
            : "-"}
        </Text>
        {ride?.status === "Completed" && (
          <Text>
            Time Completed:{" "}
            {ride?.updatedAt
              ? new Date(ride.updatedAt).toLocaleString()
              : "-"}
          </Text>
        )}
        {ride?.status === "Completed" ? (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  declineButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  successMessageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d4edda",
    borderRadius: 5,
  },
  successMessage: {
    color: "#155724",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RideDetails;
