import { useQuery } from "@tanstack/react-query";
import { fetchCertificates } from "../api/certificates";

export function useCertificates(userId: string) {
  return useQuery({ queryKey: ["certificates", userId], queryFn: () => fetchCertificates(userId) });
}