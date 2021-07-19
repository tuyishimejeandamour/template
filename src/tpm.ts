import { showTitleAndBanner } from './tpm/platform/log/logger.util';
import { TpmEnviroment } from './tpm/base/env/tpm.env';
import { newLoginQuestion } from './tpm/base/questions/open/login.question';


export async function TPM(): Promise<any> {
    new TpmEnviroment();
    showTitleAndBanner();
     
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
