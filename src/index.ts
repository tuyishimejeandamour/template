import { TPM } from './tpm';

export function index(): Promise<any> {
  return TPM();
};

index();
