import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Button, Text, View } from 'react-native';
import MyGarden from '../GardenComponents/MyGarden'
import PlantIdentify from '../IdentifyComponents/PlantIdentify'
import { createStackNavigator } from '@react-navigation/stack';


const isLoggedIn = true;


export default function Home({ navigation }) {

    const hendlePress = (componentName) => {
        return (navigation.navigate(componentName))
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Button title="Menu" onPress={() => navigation.toggleDrawer()} />
            <Text>Hello, world!</Text>
            {isLoggedIn
                ? <>
                    <Button
                        onPress={() => hendlePress('MyGarden')}
                        title="Tend Garden"
                        color="green"
                    />
                    <Button
                        onPress={() => hendlePress('PlantIdentify')}
                        title="Identify Plants"
                        color="green"
                    />

                </>
                : <>
                    <Button
                        onPress={onPressGetStarted}
                        title="Get Started"
                        color="#841584"
                        accessibilityLabel="Get Started"
                    />
                </>
            }
        </View>
    )
}
