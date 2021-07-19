// import sinon from 'sinon';
// import { expect } from 'chai';
// import { TPM } from './tpm';
// // import * as logger from './utils/logger.util';
// // import * as questions from './questions/provider.question';
// // import { ProviderValue, Answer, LicenseValue } from './models/choice';
// // import * as github from './actions/github.actions';
// // import * as gitlab from './actions/gitlab.actions';
// // import * as codecommit from './actions/codecommit.actions';
// // import * as bitbucket from './actions/bitbucket.actions';

// describe('src/tpm', () => {
//     let sandbox: sinon.SinonSandbox;
//     let showTitleAndBannerStub: sinon.SinonStub;
//     let providerQuestionStub: sinon.SinonStub;
//     let githubActionStub: sinon.SinonStub;
//     let gitlabActionStub: sinon.SinonStub;
//     let codecommitActionStub: sinon.SinonStub;
//     let bitbucketActionStub: sinon.SinonStub;

//     const mockAnswer: Answer = {
//         files: {},
//         userName: 'someUser',
//         licenses: LicenseValue.MIT,
//         provider: ProviderValue.GITHUB,
//         overwrite: false,
//     }

//     beforeEach(() => {
//         sandbox = sinon.createSandbox();
//         showTitleAndBannerStub = sandbox.stub(logger, 'showTitleAndBanner');
//         providerQuestionStub = sandbox.stub(questions, 'providerQuestion').resolves(mockAnswer);
//         githubActionStub = sandbox.stub(github, 'githubActions').resolves(mockAnswer);
//         gitlabActionStub = sandbox.stub(gitlab, 'gitlabActions').resolves(mockAnswer);
//         codecommitActionStub = sandbox.stub(codecommit, 'codecommitActions').resolves(mockAnswer);
//         bitbucketActionStub = sandbox.stub(bitbucket, 'bitbucketActions').resolves(mockAnswer);
//     });

//     afterEach(() => {
//         sandbox.restore();
//     });

//     it('should always call showTitleAndBanner and providerQuestion', async () => {
//         await TPM();
//         expect(showTitleAndBannerStub).to.be.calledOnce;
//         expect(providerQuestionStub).to.be.calledOnce;
//     });

//     it(`should call gitLabActions actions if chosen`, async () => {
//         mockAnswer.provider = ProviderValue.GITLAB;
//         const cgx: Promise<any> = await TPM();
//         expect(gitlabActionStub).to.be.calledOnce;
//     })
//     it(`should call github actions if chosen`, async () => {
//         mockAnswer.provider = ProviderValue.GITHUB;
//         const cgx: Promise<any> = await TPM();
//         expect(githubActionStub).to.be.calledOnce;
//     })
//     it(`should call codecommit actions if chosen`, async () => {
//         mockAnswer.provider = ProviderValue.CODECOMMIT;
//         const cgx: Promise<any> = await TPM();
//         expect(codecommitActionStub).to.be.calledOnce;
//     })
//     it(`should call bitbucket actions if chosen`, async () => {
//         mockAnswer.provider = ProviderValue.BITBUCKET;
//         const cgx: Promise<any> = await TPM();
//         expect(bitbucketActionStub).to.be.calledOnce;
//     })

// });
