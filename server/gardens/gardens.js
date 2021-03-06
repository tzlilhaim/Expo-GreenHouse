const controller = require("../../db/controllers/controller")

const getAllGardenAreasOfUser = async (userId) => {
  const  allGardens = await controller.gardens.getAllGardens(userId)
  return allGardens
}
const saveGardenAreaToDB = async (gardenInfo) => {
  const  newGarden = await controller.gardens.createGarden(gardenInfo)
  return newGarden
}
const saveGardenConditionsToDB = async (gardenConditions ,gardenAreaId) => {
  const conditions = []
  for (let conditionFullDetails of gardenConditions) {
    const condition = await controller.gardens.associateGardenCondition(
      conditionFullDetails,
      gardenAreaId
      )
      if (condition.error) {
        return condition
      } else {
        conditions.push(condition)
      }
    }
    return conditions
  }
  const getPlantsOfGardenArea = async (gardenId) => {
    const  allPlants = await controller.gardens.getAllPlants(gardenId)
    return allPlants
  }
const updateGardenInfo = async (gardenId, updatedDetails) => {
  const updatedGarden = await controller.gardens.updateGarden(
    gardenId,
    updatedDetails
  )

  return updatedGarden
}
const deleteGardenArea = async (gardenId) => {
  const  allGardens = await controller.gardens.deleteGarden(gardenId)
  return allGardens
}

module.exports = { 
  saveGardenAreaToDB, 
  getAllGardenAreasOfUser, 
  saveGardenConditionsToDB,
  getPlantsOfGardenArea,
  updateGardenInfo,
  deleteGardenArea
}
