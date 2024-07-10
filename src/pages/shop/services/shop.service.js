import { api } from '../../../utils/api.setup';

const apiContract = {
  deleteQuotations: async (serverId, shopId,data) => {
    try {
      const response = await api.post(`servers/${serverId}/shops/${shopId}/quotations-delete`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  deleteProducts: async (serverId, shopId,data) => {
    try {
      const response = await api.post(`servers/${serverId}/shops/${shopId}/products-delete`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  allImagesDelete: async (serverId, shopId,data) => {
    try {
      const response = await api.post(`servers/${serverId}/shops/${shopId}/all-images-delete`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  staleImagesDelete: async (serverId, shopId,data) => {
    try {
      const response = await api.post(`servers/${serverId}/shops/${shopId}/stale-images-delete`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  quotationProductImageSync: async (serverId, shopId,data) => {
    try {
      const response = await api.patch(`servers/${serverId}/shops/${shopId}/quotation-product-image-sync`,data);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  getAllShops: async (serverId) => {
    try {
      const response = await api.get(`servers/${serverId}/list-all-shops`);
      return {status:response?.status || 500,message:response?.data?.message || '',data:response?.data?.data || []};
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
  deleteShop: async (serverId, shopId) => {
    try {
      const response = await api.delete(`servers/${serverId}/shops/${shopId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },

};

export default apiContract;