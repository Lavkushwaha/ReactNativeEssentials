import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
  } from "react-native";
import MapView,{Marker} from 'react-native-maps';

import * as firebase from 'firebase';

var config= {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
     
!firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

class Search extends Component{

  static navigationOptions={
    title:"Select Vehicle Nearby"
  }


  state = {
    mapRegion: null,
    lastLat: null,
    lastLong: null,
    isLoading1:true,
    isLoading2:true,
    data:[],
  }

  componentDidMount(){
     var db = firebase.database();
    var ref = db.ref("/users/1/mycars/");

    try{

      ref.on('value', (snap) =>{
        dres=[],
        snap.forEach(ss => {
          var item = ss.val();
          item.key = ss.key;
          item.latlng=[ss.val().latitude,ss.val().longitude],
          dres.push(item);
          
        })
        this.setState({
          data:dres,
          isLoading1:false
        })
      });
    }
    catch(err){
      console.warn(err.message);
    }
  }
  

  componentWillMount() {

    this.watchID = navigator.geolocation.watchPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.01,
        longitudeDelta: 0.01
      }
      this.onRegionChange(region, region.latitude, region.longitude);
    });
//........................................................................................................
   
//.........................................................................................................

  }
  
  onRegionChange =(region, lastLat, lastLong)=> {
    this.setState({
       mapRegion: region,
      // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong,
      isLoading1:false
     
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  


  render(){
    
    if(this.state.isLoading1 && this.state.isLoading2){
      return(<Text>isLoading</Text>);
      
    }
    else{
    
    return (
      
      <View style={{flex:1}}>

       <MapView
          style={styles.map}
          region={this.state.mapRegion}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          onRegionChange={() => this.onRegionChange()}>

        {
          this.state.data.map(marker => (
          <MapView.Marker
            coordinate={{longitude: marker.longitude, latitude: marker.latitude}}
            title={marker.name}
            description={marker.brand}
            onPress={() => this.props.navigation.navigate('SingleCarView')}
            image={require('../../../img/marker.png')}
           
           >
          </MapView.Marker>
        ))
          }

        </MapView>
          
      </View>
    );
    
  }


  }
}
export default Search;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});