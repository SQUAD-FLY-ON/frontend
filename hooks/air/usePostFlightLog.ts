import { postFlightLog } from "@/libs/(tabs)/air/flightLogs";
import { ApiResponse, myFlightLogsContents, postFlightLogRequest } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UsePostFlightLogOptions {
  memberId: string;
  onSuccess?: (response: ApiResponse<myFlightLogsContents> | null | undefined) => void;
}

export const usePostFlightLog = ({ memberId, onSuccess }: UsePostFlightLogOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: postFlightLogRequest) => {
      return postFlightLog(memberId, request);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["my-flight-logs"] });
      onSuccess?.(response);
    },
  });
};
