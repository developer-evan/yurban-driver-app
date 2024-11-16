import { Colors } from "@/constants/Colors";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";

const ridesData = [
  {
    id: "1",
    code: "RC001",
    customerName: "John Doe",
    pickup: "Downtown",
    dropoff: "Airport",
    fare: "KES 250",
    distance: "15 km",
    duration: "25 min",
    startedTime: "10:00 AM",
    date: "16th Nov, 2024",
    status: "Completed",
  },
  {
    id: "2",
    code: "RC002",
    customerName: "Jane Smith",
    pickup: "Central Park",
    dropoff: "Brooklyn",
    fare: "KES 180",
    distance: "10 km",
    duration: "20 min",
    startedTime: "2:30 PM",
    date: "15th Nov, 2024",
    status: "Cancelled",
  },
  {
    id: "3",
    code: "RC003",
    customerName: "Michael Johnson",
    pickup: "Times Square",
    dropoff: "Harlem",
    fare: "KES 30",
    distance: "20 km",
    duration: "35 min",
    startedTime: "5:45 PM",
    date: "14th Nov, 2024",
    status: "Completed",
  },
];

const MyRides = () => {
  const renderRideCard = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.rideCode}>#{item.code}</Text>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Customer:</Text>
          <Text style={styles.detailValue}>{item.customerName}</Text>
        </View>
      </View>
      {/* <View style={styles.details}>
        <Text style={styles.detailLabel}>Customer:</Text>
        <Text style={styles.detailValue}>{item.customerName}</Text>
      </View> */}
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>From:</Text>
          <Text style={styles.detailValue}>{item.pickup}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>To:</Text>
          <Text style={styles.detailValue}>{item.dropoff}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Fare:</Text>
          <Text style={styles.detailValue}>{item.fare}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Distance:</Text>
          <Text style={styles.detailValue}>{item.distance}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Started:</Text>
          <Text style={styles.detailValue}>{item.startedTime}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{item.duration}</Text>
        </View>
      </View>
      {/* <View style={styles.details}>
        <Text style={styles.detailLabel}>Date:</Text>
        <Text style={styles.detailValue}>{item.date}</Text>
      </View> */}
      <Text
        style={[
          styles.status,
          item.status === "Completed" ? styles.completed : styles.cancelled,
        ]}
      >
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ridesData}
        renderItem={renderRideCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  rideCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  completed: {
    color: "green",
  },
  cancelled: {
    color: "red",
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
});
