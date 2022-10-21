const azdev = require('azure-devops-node-api');

const token = process.env.TOKEN;
if (!token) {
    throw new Exception('No token provided');
}

const releaseBranch = process.argv[2];
if (!releaseBranch) {
    throw new Exception('No release branch provided');
}

const orgUrl = 'https://dev.azure.com/mseng';
const authHandler = azdev.getPersonalAccessTokenHandler(token);

const azureDevOpsRepoId = 'fb240610-b309-4925-8502-65ff76312c40';
const project = 'AzureDevOps';
const pullRequestToCreate = {
    sourceRefName: `refs/heads/${releaseBranch}`,
    targetRefName: 'refs/heads/master',
    title: 'Courtesy Bump of Tasks',
    description: 'Autogenerated PR to bump the versions of our first party tasks'
};

const createPullRequest = async () => {
    console.log('Getting connection');
    const connection = new azdev.WebApi(orgUrl, authHandler);
    console.log('Getting Git API');
    const gitApi = await connection.getGitApi();
    console.log('Creating PR');
    const res = await gitApi.createPullRequest(pullRequestToCreate, azureDevOpsRepoId, project);
    const prLink = `${res.repository.webUrl}/pullrequest/${res.pullRequestId}`;
    console.log(`Created PR ${prLink}`);
    const prLinkRes = prLink || 'https://dev.azure.com/mseng/AzureDevOps/_git/AzureDevOps/pullrequests?_a=active&createdBy=fe107a2d-fcce-6506-8e35-5554dbe120fd';
    console.log(`##vso[task.setvariable variable=PrID]${res.pullRequestId}`);
    console.log(`##vso[task.setvariable variable=PrLink]${prLinkRes}`);
}

try {
    createPullRequest();
} catch (err) {
    console.log(err);
    throw err;
}
