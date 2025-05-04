import axios, { AxiosError, AxiosResponse } from "axios";

interface AxiosFetchProps<D = unknown> {
  fetchType: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  data?: D;
  token?: string | null;
}

interface ApiError {
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  meta?: Record<string, unknown>;
}

interface ErrorResponseData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const axiosFetch = async <T = unknown, D = unknown>({
  fetchType,
  url,
  data,
  token = null,
}: AxiosFetchProps<D>): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      headers,
      withCredentials: true,
    };

    const fullUrl = `${process.env.API_URL}${url}`;

    let response: AxiosResponse<T>;
    switch (fetchType) {
      case "get":
        response = await axios.get<T>(fullUrl, config);
        break;
      case "post":
        response = await axios.post<T>(fullUrl, data, config);
        break;
      case "put":
        response = await axios.put<T>(fullUrl, data, config);
        break;
      case "delete":
        response = await axios.delete<T>(fullUrl, { ...config, data });
        break;
      case "patch":
        response = await axios.patch<T>(fullUrl, data, config);
        break;
      default:
        throw new Error(`Invalid fetch type: ${fetchType}`);
    }

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponseData>;

    if (!axiosError.response) {
      return {
        data: null,
        error: {
          message: "خطا در اتصال به سرور",
          statusCode: 503,
        },
      };
    }

    const { status: statusCode, data: responseData } = axiosError.response;
    let message = "خطای سرور";

    if (responseData) {
      if (typeof responseData === "string") {
        message = responseData;
      } else if (typeof responseData === "object") {
        message =
          typeof responseData.message === "string"
            ? responseData.message
            : typeof responseData.error === "string"
            ? responseData.error
            : message;
      }
    }

    return {
      data: null,
      error: {
        message,
        statusCode,
        details: typeof responseData === "object" ? responseData : undefined,
      },
    };
  }
};

export { axiosFetch, type ApiResponse, type ApiError };
