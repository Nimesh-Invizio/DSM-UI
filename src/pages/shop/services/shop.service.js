import { api } from './api.setup';

const apiContract = {
  deleteQuotations: async (serverId, shopId) => {
    try {
      const response = await api.delete(`/${serverId}/shops/${shopId}/quotations-delete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data : error.message);
    }
  },
};

export default apiContract;