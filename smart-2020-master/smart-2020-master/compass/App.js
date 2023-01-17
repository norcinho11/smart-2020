import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, StatusBar, Dimensions } from "react-native";
import { Magnetometer } from "expo-sensors";
import Constants from "expo-constants";

export default function App() {
  const [degree, setDegree] = useState(0);

  const screen = Dimensions.get("window");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // paddingTop: Constants.statusBarHeight,
    },
    compassContainer: {
      flex: 1,
      backgroundColor: "#FBFFFE",
      alignItems: "center",
      justifyContent: "center",
      
    },
    image: {
      flex: 1,
      aspectRatio: 0.5,
      resizeMode: "contain",
    },
    fontStyle: {
      fontSize: 48,
    },
    header: {
      flex: 1,
      backgroundColor: "#00b83a",
      width: screen.width,
      maxWidth: screen.width,
      height: screen.height / 6,
      maxHeight: screen.height / 6,
    },
    Text: {
      color: "#fff",
      alignItems: "flex-start",
      fontSize: 28,
      paddingTop: 30
    },
  });

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, []);

  const start = () => {
    Magnetometer.setUpdateInterval(18);
    Magnetometer.addListener((data) => {
      try {
        // let { x, y, z } = data;
          // let degree = round(compassHeading(x, y, z));
          let degree = round(_angle(data));
            degree =  degree - 90 >= 0
            ? parseInt(degree) - parseInt(90)
            : parseInt(degree) + parseInt(271);
          setDegree((360 - degree));
          
      } catch {
        setDegree(0);
      }
    });
  };

  const stop = () => {
    Magnetometer.removeAllListeners();
  };


   const compass_image = require("./assets/compass.png");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0014" />
      <View style={styles.header}><Text style={styles.Text}>Compass</Text></View>
      <View style={styles.compassContainer}>
        <Image
          style={[
            {
              transform: [{ rotate: degree + "deg" }],
            },
            styles.image,
          ]}
          source={compass_image}
        />

        <Text style={styles.fontStyle}>{degree}</Text>
      </View>
    </View>
  );
}

const _angle = magnetometer => {
  let angle = 0;
  if (magnetometer) {
    let {x, y} = magnetometer;
    if (Math.atan2(y, x) >= 0) {
      angle = Math.atan2(y, x) * (180 / Math.PI);
    } else {
      angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
    }
  }
  return Math.round(angle);
};

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

function round(num) {
  if (!num) {
    return 0;
  }

  num = Math.floor(num * 1000) / 1000;
  return num.toFixed(0);
}

function compassHeading(alpha, beta, gamma) {
  var _x = beta ? beta * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos(_x);
  var cY = Math.cos(_y);
  var cZ = Math.cos(_z);
  var sX = Math.sin(_x);
  var sY = Math.sin(_y);
  var sZ = Math.sin(_z);

  // Calculate Vx and Vy components
  var Vx = -cZ * sY - sZ * sX * cY;
  var Vy = -sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  var compassHeading = Math.atan(Vx / Vy);

  // Convert compass heading to use whole unit circle
  if (Vy < 0) {
    compassHeading += Math.PI;
  } else if (Vx < 0) {
    compassHeading += 2 * Math.PI;
  }

  return compassHeading * (180 / Math.PI); // Compass Heading (in degrees)
}
