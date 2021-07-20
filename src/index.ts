import { TPM } from './tpm';
import { BASECOMMANDS } from './tpm/base/models/commands.model';
import { isDefined } from './tpm/platform/checking/types.checking';
import { showError, usage } from './tpm/platform/log/logger.util';

export function index(): Promise<any> {
  const _args = process.argv;
  const af = _args[2]
  if (isDefined(_args[2])) {

    // if (BASECOMMANDS.indexOf(af) == -1) {
    //   showError(`
      
    //   ${af} The command '${af}' is not recognized as the name of a  operable command. Check the spelling of the name
      
    //   `);
    //   process.exit(1)
    // } else {
      return TPM();
    
  } else {
    usage();
    process.exit(1);
  }
  
};

index();
