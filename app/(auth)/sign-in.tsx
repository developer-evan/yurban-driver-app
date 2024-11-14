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
import Toast from "react-native-root-toast";

const API_URL = "http://192.168.100.114:8000/api/auth/login";

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneNumber || !pin) {
      Alert.alert("Error", "Please enter both phone number and pin.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        phoneNumber,
        pin,
      });

      const { message, token, role } = response.data;

      // Check if the role is 'Driver'
      if (role === "Driver") {
        // Redirect to the driver dashboard or next screen
        // Alert.alert("Login Success", "Welcome Driver!", [
        //   { text: "OK", onPress: () => console.log("Driver logged in") },
        // ]);
        Toast.show(message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });

        router.push("/(tabs)/home/home");
        // Save token or navigate to the next screen if necessary
      } else {
        // Alert.alert("Error", "Only drivers can log in.");
        Toast.show("Only drivers can log in.", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          backgroundColor: Colors.light.tint,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Invalid credentials or server issue.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            // marginBottom: 20,
            textAlign: "left",
          }}
        >
          Login
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#888",
            textAlign: "left",
          }}
        >
          Sign in to your account
        </Text>
      </View>

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
      {/* forget passweord  */}
      <Text
        style={{
          fontSize: 14,
          color: Colors.light.tint,
          textAlign: "right",
          marginBottom: 20,
        }}
      >
        Forget Password?
      </Text>

      {/* <Button title="Login" onPress={handleLogin} /> */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/sign-up")}
        >
          Sign Up
        </Text>
      </Text>

      {/* <Text style={styles.footer}>Only drivers can login.</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#888",
  },
  button: {
    // backgroundColor: Colors.light.tint,
    // padding: 12,
    // borderRadius: 10,
    // width: "100%",
    // alignItems: "center",
    // backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 15,
    backgroundColor: Colors.light.tint,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    color: Colors.light.tint,
  },
});
