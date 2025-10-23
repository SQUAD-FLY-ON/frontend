import { apiClient } from "@/api/apiClient";
import { ApiResponse, myFlightLogs, myFlightLogsRequest } from "@/types/api";

export async function fetchFlightLogs(request: myFlightLogsRequest) {
  console.log("[fetchFlightLogs] request:", request);
  const response: ApiResponse<myFlightLogs> = await apiClient.get(
    "/flight-logs/me",
    {
      params: request,
    }
  );
  console.log("[fetchFlightLogs] response:", response);
  return response.data.content;
}
