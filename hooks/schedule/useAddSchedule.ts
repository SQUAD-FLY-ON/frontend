import { fetchAddSchedule } from "@/libs/schedule/fetchAddSchedule";
import { AddScheduleRequest } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (apiData: AddScheduleRequest) => {
      return fetchAddSchedule(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySchedule"] });
    },
  });

  return { ...mutation, queryClient };
};
