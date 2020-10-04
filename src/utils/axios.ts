import { SIimageModel } from './../store/imageSetModel';
import axiosCore, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export type axiosResponse<D extends unknown> =
  | { type: 'SUCCESS'; data?: D, headers: AxiosResponse['headers'] }
  | { type: 'ERROR'; message?: string; statusCode?: string };

type axiosReturnTypes = AxiosResponse | AxiosError;

function isAxiosError(returnValue: axiosReturnTypes): returnValue is AxiosError {
  return 'isAxiosError' in returnValue;
}

type setSpinnerFn = (setSpinner: boolean) => void;

class Axios {
  axiosInstance = axiosCore.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  setSpinner?: setSpinnerFn;

  callAxios = async <D extends unknown>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<axiosResponse<D>> => {
    let response: axiosReturnTypes;
    try {
      this.setSpinner && this.setSpinner(true);
      response = await this.axiosInstance.request<D>({ method, url, data, ...config });
    } catch (e) {
      response = e;
    }
    this.setSpinner && this.setSpinner(false);
    if (!isAxiosError(response!)) {
      return { type: 'SUCCESS', data: response!.data, headers: response.headers };
    } else {
      return {
        type: 'ERROR',
        message: typeof response.response === 'string' ? response.response : undefined,
        statusCode: response.code,
      };
    }
  };

  setSessionToken = (token: string) => {
    this.axiosInstance.defaults.headers.common['session-token'] = token
  }

  login = async (username: string, password: string) => {
    const response = await this.post<{token: string}>('/login', {username, password})
    if (response.type === 'SUCCESS') {
      this.setSessionToken(response.data?.token!)
    }
    return response;
  }

  get = async <D extends unknown>(url: string, data?: any): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('GET', url, data);
  };

  postImage = async <D extends SIimageModel>(
    url: string,
    data: FormData
  ): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('POST', url, data, {
      headers: { 'content-type': 'multipart/form-data' },
    });
  };

  put = async <D extends unknown>(url: string, data?: any): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('PUT', url, data);
  };

  post = async <D extends unknown>(url: string, data?: any, config?: AxiosRequestConfig): Promise<axiosResponse<D>> => {
    return await this.callAxios<D>('POST', url, data);
  };
}

export const axios = new Axios();
