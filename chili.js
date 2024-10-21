import { jsonifyChiliResponse } from "./utils.js";

// Get API key
export async function generateAPIKey(user, pass, environment, url) {
    // Rewrite to better handle errors
    let result = {
        response: "",
        isOK: false,
        error: "",
    };

    try {
        const response = await fetch(
            url + `/system/apikey?environmentNameOrURL=${environment}`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ userName: user, password: pass }),
            },
        );

        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`GenerateApiKey failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            if (responseJSON.succeeded == "false") {
                result.isOK = false;
                result.error = Error(responseJSON.errorMessage);
            } else {
                result.isOK = true;
                result.response = responseJSON.key;
            }
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}

// Upload resource
export async function resourceItemAdd(type, name, path, content, apikey, url) {
    // Rewrite to better handle errors
    let result = {
        response: "",
        isOK: false,
        error: "",
    };

    try {
        const response = await fetch(
            url + `/resources/${type}/items?newName=${name}&folderPath=${path}`,
            {
                method: "POST",
                headers: {
                    "api-key": apikey,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ xml: content }),
            },
        );

        if (!response.ok) {
            result.isOK = false;
            result.error = Error(`ResourceItemAdd failed with message: ${response.status} ${response.statusText}, ${await response.text()}`);
        } else {
            const responseJSON = jsonifyChiliResponse(await response.text());
            if (responseJSON.succeeded == "false") {
                result.isOK = false;
                result.error = Error(responseJSON.errorMessage);
            } else {
                result.isOK = true;
                result.response = responseJSON.id;
            }
        }
    } catch (err) {
        result.isOK = false;
        result.error = err;
    }
    return result;
}