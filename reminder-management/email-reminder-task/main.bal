import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;

import wso2/choreo.sendemail as ChoreoEmail;

configurable string reminderApiUrl = ?;

type Reminder record {
    string reminderDate;
    string email;
    int id;
    string name;
    string phoneNumber;
    string description;
};

public function main() returns error? {
    io:println("Reminder URL: " + reminderApiUrl);
    http:Client remindersApiEndpoint = check new (reminderApiUrl);

    // Fetching the reminders
    Reminder[] reminders = check remindersApiEndpoint->/reminders(upcoming = "true");

    foreach Reminder reminder in reminders {
        // Sending an email to the user
        check sendEmail(reminder);
    }
}

function sendEmail(Reminder reminder) returns error? {

    // Format the date as "April 8, 2024, at 5:30 AM"
    string formattedReminderDate = check getIstTimeString(reminder.reminderDate);

    // Capitalize the service name
    string description = convertAndCapitalize(reminder.description);

    // Appending branding details to the content
    string finalContent = string `
Dear ${reminder.name},

You have scheduled reminder to remind at ${formattedReminderDate}

Description: ${description} .

`;

    ChoreoEmail:Client emailClient = check new ();
    string sendEmailResponse = check emailClient->sendEmail(reminder.email, "Reminder", finalContent);
    log:printInfo("Email sent successfully to: " + reminder.email + " with response: " + sendEmailResponse);
}

function getIstTimeString(string utcTimeString) returns string|error {
    time:Utc utcTime = check time:utcFromString(utcTimeString);

    time:TimeZone zone = check new ("Asia/Colombo");
    time:Civil istTime = zone.utcToCivil(utcTime);

    string emailFormattedString = check time:civilToEmailString(istTime, time:PREFER_TIME_ABBREV);
    return emailFormattedString;
}

function convertAndCapitalize(string input) returns string {
    string:RegExp r = re `-`;
    // Split the input string by '-'
    string[] parts = r.split(input);

    // Capitalize the first letter of each part and join them with a space
    string result = "";
    foreach var word in parts {
        string capitalizedWord = word.substring(0, 1).toUpperAscii() + word.substring(1).toLowerAscii();
        if (result.length() > 0) {
            result = result + " " + capitalizedWord;
        } else {
            result = capitalizedWord;
        }
    }

    return result;
}
