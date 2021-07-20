import { showTitleAndBanner, usage } from './tpm/platform/log/logger.util';
import { TpmEnviroment } from './tpm/base/env/tpm.env';
import { newLoginQuestion } from './tpm/base/questions/open/login.question';
import { checkparsedargv } from './tpm/tempelating/args.tempelate';
import { BASECOMMANDS } from './tpm/base/models/commands.model';


export async function TPM(): Promise<any> {
    new TpmEnviroment();
    showTitleAndBanner();
    const passedargv = checkparsedargv();
    console.log(passedargv);
    if (passedargv) {
        if (passedargv[0] == BASECOMMANDS.INFO) {
            usage();
        }
        else if (passedargv[0] == BASECOMMANDS.HELP) {
            
        }
        else if (passedargv[0] == BASECOMMANDS.VERSION) {
            
        }
        else if (passedargv[0] == BASECOMMANDS.NEW) {
            
        }
        else if (passedargv[0] == BASECOMMANDS.CREATE) {
            
        }
        else if (passedargv[0] == BASECOMMANDS.INSTALL || passedargv[0] == BASECOMMANDS.I) {
            
        }
        else if (passedargv[0] == BASECOMMANDS.PUBLISH) {
            
        }
        
    }
    const providerAnswer = await newLoginQuestion();
     console.log(providerAnswer)
    // if (providerAnswer.provider === ProviderValue.GITHUB) {
    //     return await githubActions();
    // } else if (providerAnswer.provider === ProviderValue.GITLAB)  {
    //     return await gitlabActions();
    // } else if (providerAnswer.provider === ProviderValue.BITBUCKET)  {
    //     return await bitbucketActions();
    // } else if (providerAnswer.provider === ProviderValue.CODECOMMIT)  {
    //     return await codecommitActions();
    // }
    process.exit(1);
}
