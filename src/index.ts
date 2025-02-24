// import AWS object without services
import AWS from 'aws-sdk/global';
import { SSM } from 'aws-sdk';
import {AWSError} from 'aws-sdk/lib/error';
import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  const inputs = SanitizeInputs();

  // AWS Configure
  if (inputs.assumeRole == "true") {
  AWS.config.update({
    region: inputs.region,
  });
} else {
  AWS.config.update({
    accessKeyId: inputs.accessKeyId,
    secretAccessKey: inputs.secretAccessKey,
    region: inputs.region,
  });

}


  // Run Send Command
  const ssm = new SSM();
  ssm.sendCommand(
    {
      InstanceIds: inputs.instanceIds,
      DocumentName: inputs.documentName,
      Comment: inputs.comment,
      Parameters: {
        sha: [inputs.sha],
        tag: [inputs.tag],
        branch: [inputs.branch],
      },
    },
    (err: AWSError) => {
      if (err) throw err;

      console.log(err);

      core.setOutput('AWSError', err);
    }
  );
} catch (err) {
  if (err instanceof TypeError) {
  console.error(err, err.stack);
  core.setFailed(err);
  } else {
    console.error(err);
    core.setFailed("Unknown error");
  }
}

function SanitizeInputs() {
  // AWS
  const _assumeRole = core.getInput("aws-assume-role", { required: false });
  var _accessKeyId
  var _secretAccessKey

  if (_assumeRole != "true") {
     _accessKeyId = core.getInput("aws-access-key-id", { required: true });
     _secretAccessKey = core.getInput("aws-secret-access-key", {required: true });
  }
  const _region = core.getInput("aws-region", { required: true });


  // SSM Send Command
  const _instanceIds = core.getInput("instance-ids", { required: true });
  const _comment = core.getInput("comment", { required: true });
  const _branch = core.getInput("branch", { required: true });
  const _tag = core.getInput("tag", { required: true });
  const _sha = core.getInput("branch", { required: true });
  const _documentName = core.getInput("document", { required: true });
  return {
    accessKeyId: _accessKeyId,
    secretAccessKey: _secretAccessKey,
    region: _region,
    instanceIds: _instanceIds.split(/\n/),
    comment: _comment,
    documentName: _documentName,
    branch: _branch,
    tag: _tag,
    sha: _sha,
    assumeRole: _assumeRole,
  };
}
