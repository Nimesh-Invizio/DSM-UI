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
  }


};

export default apiContract;