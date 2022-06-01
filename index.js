const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// versionCode — A positive integer [...] -> https://developer.android.com/studio/publish/versioning
const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
// versionName — A string used as the version number shown to users [...] -> https://developer.android.com/studio/publish/versioning
const versionNameRegexPattern = /(versionName(?:\s|=)*)(.*)/;

try {
    const now = Math.floor(new Date().getTime()/1000.0);
    const offset = Math.floor(new Date("2020-01-01").getTime()/1000.0);
    
    const gradlePath = core.getInput('gradlePath');
    const versionCode = (now - offset).toString();
    const versionName = `${core.getInput('versionName')}-b${versionCode}`;
    
    console.log(`Gradle Path : ${gradlePath}`);
    console.log(`Version Code : ${versionCode}`);
    console.log(`Version Name : ${versionName}`);

    fs.readFile(gradlePath, 'utf8', function (err, data) {
        newGradle = data;
        if (versionCode.length > 0)
            newGradle = newGradle.replace(versionCodeRegexPattern, `$1${versionCode}`);
        if (versionName.length > 0)
            newGradle = newGradle.replace(versionNameRegexPattern, `$1\"${versionName}\"`);
        fs.writeFile(gradlePath, newGradle, function (err) {
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
