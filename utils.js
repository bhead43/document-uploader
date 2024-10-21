import { XMLParser } from "fast-xml-parser";

// parse CHILI API XML responses to JSON
export function jsonifyChiliResponse(response) {
    const fastXmlParser = new XMLParser({
        ignoreAttributes: false,
        attrNodeName: false,
        attributeNamePrefix: "",
    });

    let data = fastXmlParser.parse(response);
    const firstKeys = Object.keys(data);
    if (firstKeys.length == 1) {
        if (typeof data[firstKeys[0]] == "object") {
            data = data[firstKeys[0]];
        }
    }
    return data;
}

// Strip hidden characters from start of XML
export function cleanDoc(docXML){
    return docXML.replace(/^\uFEFF/gm, "");
}

// Build base url for API
export function buildBaseURL(environment, isSandbox = false) {
    return `https://${environment}.${isSandbox ? "chili-publish-sandbox" : "chili-publish"}.online/rest-api/v1.2`;
}