import { apiClient } from "../client";

export const posterApi = {
  // GET all posters
  getPosters: async () => {
    const response = await apiClient.get(`/posters`);
    return response.data;
  },

  // POST create new poster - accept FormData
  createPoster: async (payload: FormData) => {
    const response = await apiClient.post(`/posters`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // DELETE poster by ID - remove payload parameter
  deletePoster: async (id: string) => {
    const response = await apiClient.delete(`/posters/${id}`);
    return response.data;
  },

  // PUT update poster - accept FormData
  updatePoster: async (id: string, payload: FormData) => {
    const response = await apiClient.put(`/posters/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}