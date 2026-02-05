import { apiClient } from "@/api/apiClient";
import { ApiResponse, myFlightLogs, myFlightLogsRequest } from "@/types/api";

export async function fetchFlightLogs(request: myFlightLogsRequest) {
  const response: ApiResponse<myFlightLogs> = await apiClient.get(
    "/flight-logs/me",
    {
      params: request,
    }
  );
  return response.data.content;
}
