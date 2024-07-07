import { queryKeys } from "../../queries";
import { ApiResponse } from "@/api/type";
import { get, getSsr } from "@/api/client";

export const getGptColumnDetail = async(id: number) => {
  const response: ApiResponse = await get(
    `/api/v1/main/column/${id}`,
    queryKeys.gptColumnDetail(id),
  );

  if (response.status === "FAIL") {
    return null;
  }

  return response.data;
}

export const getSsrGptColumnDetail = async(id: number) => {
  const response: ApiResponse = await getSsr(
    `/api/v1/main/column/${id}`,
    queryKeys.gptColumnDetail(id),
  );

  if (response.status === "FAIL") {
    return null;
  }

  return response.data;
}