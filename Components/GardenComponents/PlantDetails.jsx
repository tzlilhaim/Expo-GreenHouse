import { NavigationHelpersContext } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { usePlantsStore } from '../../App';
import { Card, Icon } from 'react-native-elements';
import plantIcon from '../../assets/plant.png'

// this component will be responsible to determine a plant details format
// and rendering them from a given plant details object

export default function PlantDetails(props){
    const store         = usePlantsStore(),
          {serverUrl}   = store.utilityStore,
          {plantID}     = props.route.params,
          navigation    = props.navigation,
          [plantData, setPlantData] = useState({}), 
          [conditions, setConditions] = useState([])


    const getPlantDetails = () =>{
        fetch(`${serverUrl}:3001/plant/${plantID}`, {
            method: 'GET'
            })
            .then(response => response.json())
            .then(responseJson => {
                setPlantData(responseJson[0])
                setConditions(responseJson[0].conditions.map(c => ({name:c.name , value:c.value})))
            })
            .catch(err => {
                console.log(err);
                alert(err)
            })
    }

    useEffect(()=>{
        getPlantDetails()
    
    },[])

    const notifyWatering=()=>{
        navigation.navigate('ScheduleNotifications', {plant})
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Card>
                <Text style={styles.title}>{plantData.nickname}</Text>
                    {plantData.img_link 
                        ? <Image
                            style={styles.tinyLogo}
                            source={{uri:plantData.img_link}}
                        />
                        : null
                    }
                <Text>
                        <Text style={styles.header}>Scientific Name: </Text>  
                        {plantData.scientific_name}
                </Text>
                <Text>
                    <Text style={styles.header}>Watering:</Text>  
                    Every {plantData.watering_frequency} days
                </Text>
                <Card.Divider />
                <ScrollView>
                    <Text>
                        <Text style={styles.header}>Growing Conditions: </Text>  
                    </Text>
                    {conditions.map((c, i) => <Text key={i}><Text style={styles.header}>{c.name}: </Text> {c.value} </Text> )}
                </ScrollView>
                <Button
                    title="notify watering"
                    onPress={notifyWatering}
                /> 
            </Card>
            
        </View>
        
    )
}

const styles = StyleSheet.create({
    tinyLogo: {
        width: 100,
        height: 100,
    },
    title:{
        fontSize:30, 
        fontWeight: "bold"
    }, 
    header:{
        fontSize:15, 
        fontWeight: "bold"
    }
});