import { mockDelay } from "./client";
import { certificates } from "../mockData/certificates";
import type { Certificate } from "../../types";

export async function fetchCertificates(userId: string): Promise<Certificate[]> {
  return mockDelay(certificates.filter((c) => c.userId === userId));
}