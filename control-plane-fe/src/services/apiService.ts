import axios, { AxiosResponse } from 'axios';

const apiEndpoint = process.env.BACKEND_URL; // replace 'backend_url_here' with the actual URL of your backend service

const api = axios.create({
  baseURL: apiEndpoint,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

interface Instance {
  name: string;
  ip: string;
  port: number;
}

const apiService = {

  createInstance: async (): Promise<string> => {
    const response: AxiosResponse<string> = await api.post('/createInstance');
    return response.data;
  },

  deleteInstance: async (instanceName: string): Promise<string> => {
    const response: AxiosResponse<string> = await api.delete(`/deleteInstance/${instanceName}`);
    return response.data;
  },

  listInstances: async (): Promise<Instance[]> => {
    const response: AxiosResponse<Instance[]> = await api.get('/listInstances');
    return response.data;
  }
};

export default apiService;