import { apiClient } from "@/api/apiClient";
import { ApiResponse, TourismRequest, TourismResponse } from "@/types/api";

export async function fetchRestaurants(request: TourismRequest) {
  const response: ApiResponse<TourismResponse> = await apiClient.get('/tourism/restaurants',{params:request});
  return response.data.content;

}