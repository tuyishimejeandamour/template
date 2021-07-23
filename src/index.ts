import { TPM } from './tpm';
import { isDefined } from './tpm/platform/checking/types.checking';
import { usage } from './tpm/platform/log/logger.util';

export function index(): Promise<any> {
  let erro:Function = Object.create(null);
  console.log(erro);
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
