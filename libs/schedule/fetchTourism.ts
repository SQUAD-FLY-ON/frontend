import { apiClient } from "@/api/apiClient";
import { ApiResponse, TourismRequest, TourismResponse } from "@/types/api";

export async function fetchTourism(request: TourismRequest) {
  const response: ApiResponse<TourismResponse> = await apiClient.get('/tourism/nearby',{params:request});
  return response.data.content;

}