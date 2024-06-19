import { api } from '../../../utils/api.setup';

const apiContract = {
 
  getAllShops: async (serverId) => {
    try {
      const response = await api.get(`servers/${serverId}/list-all-shops`);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  createDevice: async (serverId,shopId,data) => {
    try{
      const response = await api.post(`servers/${serverId}/shops/${shopId}/devices`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};

    } catch(error){
      throw new Error(error.response ? error.response.data : error.message)
    }
  },
  getDevices: async (serverId,shopId) => {
    try {
      const response = await api.get(`servers/${serverId}/shops/${shopId}/devices`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  getDeviceById: async (serverId,shopId,id) => {
    try {
      const response = await api.get(`servers/${serverId}/shops/${shopId}/devices/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  deleteDevice: async (serverId,shopId,id) => {
    try {
      const response = await api.delete(`servers/${serverId}/shops/${shopId}/devices/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  updateDevice: async (serverId,shopId,deviceId,data) => {
    try {
      const response = await api.patch(`servers/${serverId}/shops/${shopId}/devices/${deviceId}`,data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },



};

export default apiContract;