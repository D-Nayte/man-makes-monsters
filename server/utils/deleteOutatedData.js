import consoleSuccess from "../utils/consoleSuccess.js";

const deleteOutatedData = async (LobbyCollection) => {
  // Delete documents that are older than 48hours
  const currentTime = Date.now();
  const deleteThreshold = currentTime - 172800000; //172800000; // 48 hours in milliseconds
  const collection = await LobbyCollection.find();

  collection.forEach((dataSet) => {
    const DataTime = new Date(dataSet.createdAt).getTime();
    if (DataTime < deleteThreshold)
      LobbyCollection.deleteOne({ _id: dataSet._id }, (err) =>
        console.warn("Cannot delete data: ", err)
      );
  });
  consoleSuccess("Deleted old data after 48h successfully");
};
export default deleteOutatedData;
