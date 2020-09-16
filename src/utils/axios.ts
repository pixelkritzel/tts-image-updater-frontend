import { SIimageModel } from './../store/imageSetModel';
import axiosCore, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export type axiosResponse<D extends unknown> =
  | { type: 'SUCCESS'; data?: D }
  | { type: 'ERROR'; message?: string; statusCode?: string };

type axiosReturnTypes = AxiosResponse | AxiosError;

function isAxiosError(returnValue: axiosReturnTypes): returnValue is AxiosError {
  return 'isAxisError' in returnValue;
}

class Axios {
  axiosInstance = axiosCore.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  callAxios = async <D extends unknown>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<axiosResponse<D>> => {
    let response: axiosReturnTypes;
    try {
      response = await this.axiosInstance.request<D>({ method, url, data, ...config });
    } catch (e) {
      response = e;
    }

    if (!isAxiosError(response!)) {
      return { type: 'SUCCESS', data: response!.data };
    } else {
      return {
        type: 'ERROR',
        message: typeof response.response === 'string' ? response.response : undefined,
        statusCode: response.code,
      };
    }
  };

  get = async <D extends unknown>(url: string, data?: any): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('GET', url, data);
  };

  postImage = async <D extends SIimageModel>(
    url: string,
    data?: FormData
  ): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('POST', url, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  };

  put = async <D extends unknown>(url: string, data?: any): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('PUT', url, data);
  };
}

export const axios = new Axios();
