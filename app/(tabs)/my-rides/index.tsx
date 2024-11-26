import { Colors } from "@/constants/Colors";
import { axiosInstance } from "@/lib/axiosInstance";
import config from "@/lib/config";
import { getDriverRides } from "@/services/getDriverRides";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";

type Ride = {
  _id: string;
  customerId: { firstName: string; lastName: string };
  pickupLocation: string;
  dropoffLocation: string;
  requestedAt: string;
  passengerNumber: number;
  status: string;
};

const MyRides = () => {
  const {
    data: rides,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Ride[]>({
    queryKey: ["rides"],
    queryFn: getDriverRides,
  });

  const handleCompleteRide = async (id: string) => {
    try {
      await axiosInstance.patch(`${config.apiUrl}/rides/${id}/complete`);
      // alert("Ride marked as completed successfully!");
      ToastAndroid.show(
        "Ride marked as completed successfully!",
        ToastAndroid.SHORT
      );
      refetch(); // Refresh the ride list after status update
    } catch (error) {
      // console.error("Failed to complete the ride:", error);
      // alert("An error occurred while completing the ride.");
      ToastAndroid.show(
        "An error occurred while completing the ride.",
        ToastAndroid.SHORT
      );
    }
  };

  const renderRideCard = ({ item }: { item: Ride }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/(tabs)/my-rides/ride-details/${item._id}` as any);
      }}
    >
      <View style={styles.header}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Customer:</Text>
          <Text style={styles.detailValue}>
            {item.customerId?.firstName} {item.customerId?.lastName}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{item.pickupLocation}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailLabel}>To:</Text>
        <Text style={styles.detailValue}>{item.dropoffLocation}</Text>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Requested Time:</Text>
          <Text style={styles.detailValue}>
            {new Date(item.requestedAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Passenger Count:</Text>
          <Text style={styles.detailValue}>{item.passengerNumber}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text
            style={[
              styles.status,
              item.status === "Pending"
                ? styles.pending
                : item.status === "Accepted"
                ? styles.accepted
                : item.status === "Completed"
                ? styles.completed
                : styles.cancelled,
            ]}
          >
            {item.status}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/(tabs)/my-rides/ride-details/${item._id}` as any);
          }}
        >
          <Text style={{ color: Colors.dark.tint }}>View Details</Text>
        </TouchableOpacity>
      </View>
      {item.status === "Accepted" && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleCompleteRide(item._id);
          }}
        >
          <Text
            style={{
              color: Colors.dark.text,
              textAlign: "center",
              padding: 10,
              backgroundColor: Colors.light.tint,
              borderRadius: 20,
              marginTop: 8,
            }}
          >
            Complete Ride
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
        <Text>Loading rides...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load rides.</Text>
        <Text>{(error as Error)?.message}</Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!rides || rides.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No rides found.</Text>
      </View>
    );
  }

  // return (
  //   <View style={styles.container}>
  //     <FlatList
  //       data={rides}
  //       renderItem={renderRideCard}
  //       keyExtractor={(item) => item._id}
  //       contentContainerStyle={styles.listContainer}
  //       showsVerticalScrollIndicator={false}
  //       onRefresh={refetch}
  //       refreshing={isLoading}
  //     />
  //   </View>
  // );
  return (
    <View style={styles.container}>
      <FlatList
        data={rides.sort(
          (a, b) =>
            new Date(b.requestedAt).getTime() -
            new Date(a.requestedAt).getTime()
        )}
        renderItem={renderRideCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
};

export default MyRides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: Colors.dark.tint,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  accepted: {
    color: "green",
  },
  completed: {
    color: "#007BFF",
  },
  cancelled: {
    color: "red",
  },
  pending: {
    color: "orange",
  },

  details: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: Colors.dark.tint,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
