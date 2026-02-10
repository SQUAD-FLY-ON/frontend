import { apiClient } from "@/api/apiClient";
import { ApiResponse, TourismRequest, TourismResponse } from "@/types/api";

type TourismEndpoint = '/tourism/nearby' | '/tourism/attractions' | '/tourism/restaurants';

async function fetchTourismByType(endpoint: TourismEndpoint, request: TourismRequest) {
  const response: ApiResponse<TourismResponse> = await apiClient.get(endpoint, { params: request });
  return response.data.content;
}

export const fetchTourism = (req: TourismRequest) => fetchTourismByType('/tourism/nearby', req);
export const fetchAttractions = (req: TourismRequest) => fetchTourismByType('/tourism/attractions', req);
export const fetchRestaurants = (req: TourismRequest) => fetchTourismByType('/tourism/restaurants', req);
