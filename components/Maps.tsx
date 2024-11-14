import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'

const Maps = () => {
  return (
    <MapView
    provider={PROVIDER_DEFAULT}
    style={{ 
        // flex: 1,
        width: "100%",
        height: "100%",
        // position: "absolute",
     }}
     tintColor='black'
     mapType='standard'
        showsUserLocation={true}
        // followsUserLocation={true}
        // showsMyLocationButton={true}
        // showsCompass={true}
        // showsScale={true}
        // showsBuildings={true}
        // showsTraffic={true}
        // showsIndoors={true}
        // showsIndoorLevelPicker={true}
        showsPointsOfInterest={false}
        userInterfaceStyle='light'
    >
      <Text>Maps</Text>
    </MapView>
  )
}

export default Maps

const styles = StyleSheet.create({})