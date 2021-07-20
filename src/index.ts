import { TPM } from './tpm';
import { BASECOMMANDS } from './tpm/base/models/commands.model';
import { isDefined } from './tpm/platform/checking/types.checking';
import { showError, usage } from './tpm/platform/log/logger.util';

export function index(): Promise<any> {
  const _args = process.argv;
  const af = _args[2]
  if (isDefined(_args[2])) {

      return TPM();
    
  } else {
    usage();
    process.exit(1);
  }
  
};

index();
