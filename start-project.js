const { 
  IAMClient, 
  CreateUserCommand, 
  AttachUserPolicyCommand,
  CreateLoginProfileCommand,
  CreateAccessKeyCommand,
  PutRolePermissionsBoundaryCommand
} = require("@aws-sdk/client-iam");

const {
  CloudFormationClient,
  CreateStackCommand,
  DescribeStacksCommand 
} = require("@aws-sdk/client-cloudformation");

const fs = require('fs');

var sleep = require('sleep');

const cfClient = new CloudFormationClient();

const iamClient = new IAMClient();

const projectData = JSON.parse(fs.readFileSync('project.json', 'utf8'));

console.log('Please wait...');

console.log('Creating Stack...');

runCommand();

function runCommand() {
  createStack().then(function (outputs) {
    console.log('Stack creation complete...');
    const users = projectData.users;
    
    var data;
    users.forEach(function (user) {  
      createUser(user, outputs[0].OutputValue).then(function (response) {
        data = 'User: ' + user;
        data += '\r\n'; 
        data += 'Password: Abc.12345';
        data += '\r\n'; 
        data += 'AccessKeyId: ' + response.AccessKey.AccessKeyId;
        data += '\r\n'; 
        data += 'SecretAccessKey: ' + response.AccessKey.SecretAccessKey;
        fs.writeFile(user + '-credentials.txt', data, function (err) {
          if (err) return console.log(err);
        });
        console.log(user + 'named created');
      });
    });
    console.log('Repository URL: ' + outputs[1].OutputValue);
  });
}

async function createStack() {
  try {
    await cfClient.send(new CreateStackCommand({
      StackName: 'master-devops-stack',
      TemplateBody: fs.readFileSync('repo_permisos.yml', 'utf8'),
      Parameters: [
        {
          ParameterKey: 'RepositoryName',
          ParameterValue: projectData.repoName
        }
      ],
      Capabilities: ['CAPABILITY_NAMED_IAM']
    }));

    var loop = true;
    var response;
    do {
      sleep.sleep(10);
      response  = await cfClient.send(new DescribeStacksCommand({
        StackName: 'master-devops-stack'
      }));
    } while (response.Stacks[0].StackStatus == 'CREATE_COMPLETE' ? false : true);
    return response.Stacks[0].Outputs;
  } catch (err) {
    throw err;
  }
}

async function createUser(user, policyArn) {
  try {
    await iamClient.send(new CreateUserCommand({
      UserName: user
    }));

    await iamClient.send(new AttachUserPolicyCommand({
      UserName: user,
      PolicyArn: policyArn
    }));
    
    await iamClient.send(new CreateLoginProfileCommand({
      UserName: user,
      Password: 'Abc.12345',
      PasswordResetRequired: false
    }));

    return await iamClient.send(new CreateAccessKeyCommand({
      UserName: user
    }));
  } catch (err) {
    throw err;
  }
}