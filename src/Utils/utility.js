import Axios from "axios";

const GetData = async () => {
  try {
    // Fetch all data again after saving changes
    const response = await Axios.get("http://101.53.133.52:8183/api/v1/servers/");
    // Update the data in your parent component or wherever you manage the data
    // For example:
    // setTableData(response.data.data);
    console.log(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default GetData;
