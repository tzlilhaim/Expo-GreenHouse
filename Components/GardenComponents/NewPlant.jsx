import React, { useState } from "react"
import axios from "axios"
import {
  Text,
  View,
  Button,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native"
import { Input } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import { useUtilityStore } from "../../App"
import LoadingState from "../UtilityComponents/LoadingState"
import EmptyState from "../UtilityComponents/EmptyState"
import { observer } from "mobx-react"
import { ScrollView } from "react-native-gesture-handler"

const NewPlant = observer((props) => {
  const store = useUtilityStore()
  const [isSearched, setIsSearched] = useState(false)
  const [inputs, setInputs] = useState({
    search: "",
    nickname: "",
    wateringFrequency: 1,
  })
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const serverUrl = `${store.utilityStore.serverUrl}:3001`
  const gardenArea = props.route.params.area
  console.log(props)
  const [step, setStep] = useState(1)
  const instructions = {
    1: "First, enter your plant to gather information.",
    2: "Now select your plant from the list below.",
    3: "Almost done! Please fill-in the remaining fields in the form.",
  }

  const goBackToSearch = () => {
    setInputs({ ...inputs, search: "" })
    setIsSearched(false)
  }
  const goBackToPlantResults = () => {
    setSelectedPlant(null)
  }

  const handleSearch = async () => {
    try {
      store.utilityStore.showLoadingState(
        "Searching for matching plants!",
        "This might take a few seconds..."
      )
      const results = await axios.get(`${serverUrl}/plantForm/${inputs.search}`)
      if (results.data.length) {
        setSearchResults(results.data)
        setStep(2)
      } else {
        store.utilityStore.showEmptyState(
          "Couldn't find any plants with this name. Please change your search and try again.",
          goBackToSearch()
        )
      }
      store.utilityStore.hideLoadingState()
      setIsSearched(true)
    } catch (err) {
      setSearchResults(null)
      store.utilityStore.showSnackBar(
        "Oops, something went wrong. Please try again"
      )
      store.utilityStore.hideLoadingState()
      console.log(err)
    }
  }

  const handleResultPress = async (event) => {
    try {
      const plantName = event.target.innerHTML
      const p = searchResults.find((p) => p.name === plantName)
      if (p) {
        store.utilityStore.showLoadingState(
          "Searching for matching plants!",
          "This might take a few seconds..."
        )
        const results = await axios.post(
          `${serverUrl}/plantForm/${plantName}/info`,
          { detailsUrl: p.detailsUrl }
        )
        if (
          results.data.conditions.length ||
          results.data ||
          results.data.diseases.length
        ) {
          setSelectedPlant(results.data)
          setStep(3)
        } else {
          store.utilityStore.showEmptyState(
            "We're sorry, this plant is currently unsupported.",
            goBackToPlantResults
          )
        }
        store.utilityStore.hideLoadingState()
      } else {
        setSelectedPlant(null)
        store.utilityStore.showEmptyState(
          "Couldn't find this plant. Please try again.",
          goBackToPlantResults
        )
        store.utilityStore.hideLoadingState()
      }
    } catch (err) {
      setSelectedPlant(null)
      store.utilityStore.showSnackBar(
        "Oops, something went wrong. Please try again"
      )
      store.utilityStore.hideLoadingState()
      console.log(err)
    }
  }

  const savePlantToDB = async () => {
    if (inputs.nickname === "" || inputs.wateringFrequency === "") {
      alert("All fields are required!")
    } else {
      try {
        store.utilityStore.showLoadingState(
          `Saving your plant ${inputs.nickname}!`,
          "This might take a short while..."
        )
        const plant = await axios.post(`${serverUrl}/plant`, {
          nickname: inputs.nickname,
          scientific_name: selectedPlant.scientific_name,
          garden_area_id: gardenArea.id,
          img_link: selectedPlant.img_link,
          watering_frequency: inputs.wateringFrequency,
          conditions: selectedPlant.conditions,
          diseases: selectedPlant.diseases,
          measurements: selectedPlant.measurements,
          external_link: selectedPlant.external_link,
        })
        store.utilityStore.hideLoadingState()
        if (plant.data) {
          store.utilityStore.showSnackBar(
            `Successfully added ${inputs.nickname} to your ${gardenArea.name} garden!`
          )
          props.navigation.navigate("MyGarden", { plantID })
        }
      } catch (err) {
        store.utilityStore.showSnackBar(
          "Oops, something went wrong. Please try again"
        )
        store.utilityStore.hideLoadingState()

        console.log(err)
      }
    }
  }

  return store.utilityStore.loadingState.isShown ? (
    <LoadingState />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView>
        <ImageBackground
          source={require("../../assets/background/background2.jpg")}
          style={styles.image}
        />
        <Text style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.title}>Add new plant</Text>
            <Text style={styles.subtitles}>{instructions[step]}</Text>
            <View className="search-plant">
              <Input
                placeholder="Plant name"
                value={inputs.search}
                onChangeText={(value) =>
                  setInputs({ ...inputs, search: value })
                }
                leftIcon={<Icon name="search" size={24} color="black" />}
              />
              <Button
                title="Search"
                onPress={handleSearch}
                disabled={inputs.search === ""}
                color={"#6e963f"}
              />
              {isSearched ? (
                <View className="search-results">
                  {selectedPlant === null ? (
                    <>
                      <Text style={styles.subtitles}>
                        Found {searchResults.length} plants that match your
                        search:
                      </Text>
                      {searchResults.length ? (
                        searchResults.map((result, index) => (
                          <Button
                            key={`result-${index}`}
                            title={result.name}
                            onPress={handleResultPress}
                            color="hsla(87, 25%, 73%, 0.88)"
                          />
                        ))
                      ) : (
                        <EmptyState />
                      )}
                    </>
                  ) : (
                    <View className="plant-info">
                      <Text>
                        Scientific Name: {selectedPlant.scientific_name}
                      </Text>
                      <Input
                        placeholder="Nickname"
                        value={inputs.nickname}
                        onChangeText={(value) =>
                          setInputs({ ...inputs, nickname: value })
                        }
                      />
                      <Text>Garden Area: {gardenArea.name}</Text>
                      <View>
                        <Text>Should be watered each</Text>
                        <Input
                          type="number"
                          placeholder=""
                          value={inputs.wateringFrequency}
                          onChangeText={(value) =>
                            setInputs({ ...inputs, wateringFrequency: value })
                          }
                        />
                        <Text>Days</Text>
                      </View>
                      <Image source={{ uri: selectedPlant.img_link }} />
                      <Button title="Add Plant" onPress={savePlantToDB} />
                    </View>
                  )}
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>
          <Text style={styles.step}>Step {step}/3</Text>
        </Text>
      </ScrollView>
    </View>
  )
})
export default NewPlant

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "white",
    paddingLeft: 20,
    zIndex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    zIndex: 0,
    opacity: 0.8,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    margin: 20,
    padding: 10,
  },
  form: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  step: { color: "#6e963f", fontSize: 18, letterSpacing: 2 },
  subtitles: { color: "#6e963f", fontSize: 14, fontWeight: "bold" },
  option: {
    borderWidth: 2,
    borderColor: "black",
    marginTop: 10,
    padding: 5,
  },
})
