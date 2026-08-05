import apiRequestGlobal, { apiRequestForm } from "#src/config/axios.config";

interface RequestWithData<TData> {
  url: string;
  data: TData;
}

interface GetRequest {
  url: string;
  searchParams?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

const handleGlobalPostRequest = <TResponse, TData>({ url, data }: RequestWithData<TData>) =>
  apiRequestGlobal.post<TResponse>(url, data).then((response) => response.data);

const handleGlobalPostFormRequest = <TResponse>({ url, data }: RequestWithData<FormData>) =>
  apiRequestForm.post<TResponse>(url, data).then((response) => response.data);

const handleGlobalPutRequest = <TResponse, TData>({ url, data }: RequestWithData<TData>) =>
  apiRequestGlobal.put<TResponse>(url, data).then((response) => response.data);

const handleGlobalPatchRequest = <TResponse, TData>({ url, data }: RequestWithData<TData>) =>
  apiRequestGlobal.patch<TResponse>(url, data).then((response) => response.data);

const handleGlobalDeleteRequest = <TResponse, TData>({ url, data }: RequestWithData<TData>) =>
  apiRequestGlobal.delete<TResponse>(url, { data }).then((response) => response.data);

const handleGlobalGetRequestQuery = <TResponse>({ url, searchParams = {}, signal }: GetRequest) =>
  apiRequestGlobal.get<TResponse>(url, { params: searchParams, signal }).then((response) => response.data);

export {
  handleGlobalGetRequestQuery,
  handleGlobalDeleteRequest,
  handleGlobalPostRequest,
  handleGlobalPutRequest,
  handleGlobalPatchRequest,
  handleGlobalPostFormRequest,
};
