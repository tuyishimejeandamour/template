import { showError, showTitleAndBanner, usage } from './tpm/platform/log/logger.util';
import { TpmEnviroment } from './tpm/base/env/tpm.env';
import { checkparsedargv } from './tpm/tempelating/args.tempelate';
import { BASECOMMANDS } from './tpm/base/models/commands.model';
import { blue } from 'kleur';


export async function TPM(): Promise<any> {
    new TpmEnviroment();
    const passedargv = checkparsedargv();
    if (passedargv) {
        if (passedargv[0] == BASECOMMANDS.INFO) {
            showTitleAndBanner(true);
            usage();
        }
        else if (passedargv[0] == BASECOMMANDS.HELP) {
            showTitleAndBanner();
        }
        else if (passedargv[0] == BASECOMMANDS.VERSION) {
            showTitleAndBanner();
        }
        else if (passedargv[0] == BASECOMMANDS.NEW) {
            showTitleAndBanner();
        }
        else if (passedargv[0] == BASECOMMANDS.CREATE) {
            showTitleAndBanner();
        }
        else if (passedargv[0] == BASECOMMANDS.INSTALL || passedargv[0] == BASECOMMANDS.I) {
            showTitleAndBanner();
        }
        else if (passedargv[0] == BASECOMMANDS.PUBLISH) {
            showTitleAndBanner();
        }else{
        showError(`
      
      ${blue(passedargv[0])}: The command '${passedargv[0]}' is not recognized as the name of a  operable command. Check the spelling of the name
      
      `);
      process.exit(1) 
        }
        
    }
    process.exit(1);
}
