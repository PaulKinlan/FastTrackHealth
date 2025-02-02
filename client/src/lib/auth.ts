import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
}

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/auth/user"],
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/signout", {});
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });
}
