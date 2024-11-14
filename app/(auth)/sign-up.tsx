import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { counties } from "@/constants/counties";
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-root-toast";

const API_URL = "http://192.168.100.114:8000/api/auth/register"; // Update with your API URL

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [subCounties, setSubCounties] = useState<string[]>([]);
  const [subCounty, setSubCounty] = useState("");
  const router = useRouter();

  // Handle county selection and populate sub-counties
  const handleCountySelect = (countyName: React.SetStateAction<string>) => {
    setCounty(countyName);
    const selectedCounty = counties.find((c) => c.name === countyName);
    setSubCounties(selectedCounty ? selectedCounty.sub_counties : []);
    setSubCounty(""); // Reset sub-county selection
  };

  const handleSignUp = async () => {
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !pin ||
      !gender ||
      !email ||
      !county ||
      !subCounty
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        firstName,
        lastName,
        phoneNumber,
        pin,
        gender,
        email,
        role: "Driver",
        county,
        subCounty,
      });

      const { message } = response.data;
      // Alert.alert("Success", message, [
      //   { text: "OK", onPress: () => router.push("/(auth)/sign-in") },
      // ]);
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: Colors.light.tint,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      router.push("/(auth)/sign-in");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      // Alert.alert("Error", errorMessage);
      Toast.show(errorMessage, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        backgroundColor: Colors.light.tint,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Sign Up</Text>
        <Text style={styles.subtitleText}>Register for an account</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        keyboardType="numeric"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />

      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={handleCountySelect}
          items={counties.map((county) => ({
            label: county.name,
            value: county.name,
          }))}
          style={pickerSelectStyles}
          placeholder={{ label: "Select County", value: null }}
        />
      </View>

      {subCounties.length > 0 && (
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSubCounty(value)}
            items={subCounties.map((sub) => ({ label: sub, value: sub }))}
            style={pickerSelectStyles}
            placeholder={{ label: "Select Sub-County", value: null }}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/sign-in")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
  },
  subtitleText: {
    fontSize: 14,
    color: "#888",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  halfInput: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#888",
  },
  link: {
    color: Colors.light.tint,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerContainer: {
    padding: 10,
    marginBottom: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
  },
});
