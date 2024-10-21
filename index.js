import * as fs from "fs"
import { buildBaseURL, cleanDoc } from "./utils.js";
import { generateAPIKey, resourceItemAdd } from "./chili.js";

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
const baseurl = buildBaseURL(config.environment, config.isSandbox);
// Get API key
let apikey;
if(config.auth.apikey.trim() != ""){
    apikey = config.auth.apikey;
}
else {
    const apikeyFetch = await generateAPIKey(config.auth.user, config.auth.pass, config.environment, baseurl);
    apikey = apikeyFetch.isOK ? apikeyFetch.response : "FAILED";
    if (apikey == "FAILED") {
        throw new Error(apikeyFetch.error);
    }
}
// Get each file in docsToUpload folder, upload as resource
fs.readdirSync('./docsToUpload').forEach(async(file) => {
    const docXML = cleanDoc(fs.readFileSync(`./docsToUpload/${file}`, 'utf-8'));
    await resourceItemAdd(config.resourceType, file, config.uploadDirectory, docXML, apikey, baseurl);
});