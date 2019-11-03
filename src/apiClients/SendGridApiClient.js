var SendGridApiClient = /** @class */ (function () {
    function SendGridApiClient(apiKey) {
        this.apiKey = apiKey;
        // remove this log when this API key is finally used somewhere
        console.log("SendGridAPIClient initialized with api key " + this.apiKey);
    }
    SendGridApiClient.prototype.sendEmail = function (senderEmailAddress, recipientEmailAddress, emailBody) {
        console.log("sendEmail called with arguments:", senderEmailAddress, recipientEmailAddress, emailBody);
    };
    return SendGridApiClient;
}());
//export default SendGridApiClient;
