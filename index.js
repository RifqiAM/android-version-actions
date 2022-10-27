const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// versionCode — A positive integer [...] -> https://developer.android.com/studio/publish/versioning
const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
// versionName — A string used as the version number shown to users [...] -> https://developer.android.com/studio/publish/versioning
const versionNameRegexPattern = /(versionName(?:\s|=)*)(.*)/;
const projectVersionRegexPattern = /(CURRENT_PROJECT_VERSION(?:\s|=)*)(.*);/;

try {
    const filePath = core.getInput('filePath');
    const versionCode = (parseInt(core.getInput('initialVersionCode')) + parseInt(github.context.runNumber)).toString()
    const versionName = core.getInput('versionName')
    const buildName = `${core.getInput('versionName')}-b${versionCode}`;
    
    console.log(`File Path : ${filePath}`);
    console.log(`Version Code : ${versionCode}`);
    console.log(`Version Name : ${versionName}`);
    console.log(`Build Name : ${buildName}`);

    fs.readFile(filePath, 'utf8', function (err, data) {
        let newFile = data;
        if (versionCode.length > 0)
            newFile = newFile.replace(versionCodeRegexPattern, `$1${versionCode}`);
            newFile = newFile.replace(projectVersionRegexPattern, `$1${versionCode}`);
        if (versionName.length > 0)
            newFile = newFile.replace(versionNameRegexPattern, `$1\"${versionName}\"`);
        fs.writeFile(filePath, newFile, function (err) {
            if (err) throw err;
            if (versionCode.length > 0)
                console.log(`Successfully override version code ${versionCode}`)
            if (versionName.length > 0)
                console.log(`Successfully override version code ${versionName}`)
            core.setOutput("result", `Done`);
        });
    });

} catch (error) {
    core.setFailed(error.message);
}
