import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

export class LoginScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    email: "",
    password: "",
    errorMessage: null,
  };
  //Login Handler
  //TODO: get it to log in and display le home page and keep user logged in.
  //you could use async storage to store and remove user shit

  handleLogin = async () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
      //other data key value pairs
    };
    if (this.state.email == "") {
      this.setState({
        errorMessage: "A valid e-mail is required for logging in.",
      });
    }
    if (this.state.password == "") {
      this.setState({
        errorMessage: "A valid password is required for logging in.",
      });
    } else {
      await axios
        .post("https://grem-api.herokuapp.com/users/login", data)
        .then((response) => {
          console.info("response: " + response.data);
          Alert.alert("Logged In!", "'Enjoy freedom!'");
          this.setState({ isLoggedIn: "true" });
          this.props.navigation.navigate("App");
        })
        .catch((err) => {
          if (err.message == "Request failed with status code 401") {
            this.setState({
              errorMessage: "Sign In Failed, check your email and password.",
            });
          }
          if (err.message == "Network Error") {
            this.setState({
              errorMessage: "Network Error.",
            });
          }
          console.error(err.message);
        });
      await AsyncStorage.setItem("isLoggedIn", this.state.isLoggedIn).catch(
        (err) => {
          console.error(err);
        }
      );
    }
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content"></StatusBar>
          <Image
            source={require("../assets/Logo.png")}
            style={{
              width: "100%",
              height: "50%",
              marginTop: -24,
            }}
          ></Image>

          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Email Address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>
            <View style={{ marginTop: 32 }}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              ></TextInput>
            </View>
          </View>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && (
              <Text style={styles.error}>{this.state.errorMessage}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{ color: "white", fontWeight: "500" }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              marginTop: 32,
            }}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text style={{ color: "#d3d3d3", fontSize: 14, fontWeight: "400" }}>
              New To Grem?
              <Text style={{ fontWeight: "300", color: "red", fontSize: 16 }}>
                Join the revolution!
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  errorMessage: {
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    marginTop: -12,
    marginHorizontal: 32,
  },
  inputTitle: {
    color: "#8A8F9E",
    fontSize: 10,
    textTransform: "uppercase",
  },
  input: {
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "white",
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: "magenta",
    borderRadius: 4,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
});
export default LoginScreen;
