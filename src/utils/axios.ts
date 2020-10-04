import axiosCore, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';

export type axiosResponse<D extends unknown> =
  | { type: 'SUCCESS'; data?: D; headers: AxiosResponse['headers'] }
  | { type: 'ERROR'; message?: string; statusCode?: string };

type axiosReturnTypes = AxiosResponse | AxiosError;

function isAxiosError(returnValue: axiosReturnTypes): returnValue is AxiosError {
  return 'isAxiosError' in returnValue;
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
    this.axiosInstance.defaults.headers.common['session-token'] = token;
  };
}

export const axios = new Axios();
