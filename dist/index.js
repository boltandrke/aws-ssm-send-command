"use strict";
exports.__esModule = true;
// import AWS object without services
var aws_sdk_1 = require("aws-sdk");
var core = require("@actions/core");
try {
    var inputs = SanitizeInputs();
    // AWS Configure
    if (inputs.assumeRole == "true") {
        aws_sdk_1["default"].config.update({
            region: inputs.region
        });
    }
    else {
        aws_sdk_1["default"].config.update({
            accessKeyId: inputs.accessKeyId,
            secretAccessKey: inputs.secretAccessKey,
            region: inputs.region
        });
    }
    // Run Send Command
    var ssm = new aws_sdk_1["default"].SSM();
    ssm.sendCommand({
        InstanceIds: inputs.instanceIds,
        DocumentName: inputs.documentName,
        Comment: inputs.comment,
        Parameters: {
            sha: [inputs.sha],
            tag: [inputs.tag],
            branch: [inputs.branch]
        }
    }, function (err) {
        if (err)
            throw err;
        console.log(err);
        core.setOutput('AWSError', err);
    });
}
catch (err) {
    if (err instanceof TypeError) {
        console.error(err, err.stack);
        core.setFailed(err);
    }
    else {
        console.error(err);
        core.setFailed("Unknown error");
    }
}
function SanitizeInputs() {
    // AWS
    var _assumeRole = core.getInput("aws-assume-role", { required: false });
    var _accessKeyId;
    var _secretAccessKey;
    if (_assumeRole == "true") {
        var _accessKeyId_1 = core.getInput("aws-access-key-id", { required: false });
        var _secretAccessKey_1 = core.getInput("aws-secret-access-key", { required: false });
    }
    else {
        var _accessKeyId_2 = core.getInput("aws-access-key-id", { required: true });
        var _secretAccessKey_2 = core.getInput("aws-secret-access-key", { required: true });
    }
    var _region = core.getInput("aws-region", { required: true });
    // SSM Send Command
    var _instanceIds = core.getInput("instance-ids", { required: true });
    var _comment = core.getInput("comment");
    var _branch = core.getInput("branch");
    var _tag = core.getInput("tag");
    var _sha = core.getInput("branch");
    var _documentName = core.getInput("document");
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
        assumeRole: _assumeRole
    };
}
