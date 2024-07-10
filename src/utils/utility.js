import Axios from "axios";

const GetData = async () => {
  try {
    // Fetch all data again after saving changes
    const response = await Axios.get("http://localhost:8188/api/v1/servers/");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default GetData;
