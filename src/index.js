/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

import Alexa from 'ask-sdk-core';
import Axios from 'axios';
import DateFormat from 'dateformat';

const PERMISSIONS = ['read::alexa:device:all:address:country_and_postal_code'];

const regions = {
    '2025': {
        'Deutschland':             ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '25.12.', '26.12.'],
        'Baden-Württemberg':       ['01.01.', '06.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Bayern':                  ['01.01.', '06.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '15.08.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Berlin':                  ['01.01.', '08.03.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '25.12.', '26.12.'],
        'Brandenburg':             ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Bremen':                  ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Hamburg':                 ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Hessen':                  ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '03.10.', '25.12.', '26.12.'],
        'Mecklenburg-Vorpommern':  ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Niedersachsen':           ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Nordrhein-Westfalen':     ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Rheinland-Pfalz':         ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Saarland':                ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '15.08.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Sachsen':                 ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '03.10.', '31.10.', '19.11.', '25.12.', '26.12.'],
        'Sachsen-Anhalt':          ['01.01.', '06.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Schleswig-Holstein':      ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Thüringen':               ['01.01.', '18.04.', '21.04.', '01.05.', '29.05.', '09.06.', '19.06.', '20.09.', '03.10.', '31.10.', '25.12.', '26.12.'],
    },
    '2026': {
        'Deutschland':             ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '25.12.', '26.12.'],
        'Baden-Württemberg':       ['01.01.', '06.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Bayern':                  ['01.01.', '06.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '15.08.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Berlin':                  ['01.01.', '08.03.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '25.12.', '26.12.'],
        'Brandenburg':             ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Bremen':                  ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Hamburg':                 ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Hessen':                  ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '03.10.', '25.12.', '26.12.'],
        'Mecklenburg-Vorpommern':  ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Niedersachsen':           ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Nordrhein-Westfalen':     ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Rheinland-Pfalz':         ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Saarland':                ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '15.08.', '03.10.', '01.11.', '25.12.', '26.12.'],
        'Sachsen':                 ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '03.10.', '31.10.', '18.11.', '25.12.', '26.12.'],
        'Sachsen-Anhalt':          ['01.01.', '06.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Schleswig-Holstein':      ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '03.10.', '31.10.', '25.12.', '26.12.'],
        'Thüringen':               ['01.01.', '03.04.', '06.04.', '01.05.', '14.05.', '25.05.', '04.06.', '20.09.', '03.10.', '31.10.', '25.12.', '26.12.'],
    },
};

const SKILL_NAME = 'Der nächste Feiertag in ';
const GET_FACT_MESSAGE = 'Der nächste gesetzliche Feiertag in ';
const NOTIFY_MISSING_PERMISSIONS = 'Bitte aktivieren Sie die Standortberechtigungen in der Alexa App.';
const NO_POSTAL_CODE_MESSAGE = 'Bitte verwenden Sie die Alexa App, um Ihre Postleitanzahl anzugeben.';
const HELP_MESSAGE = 'Du kannst sagen, „Wann ist der nächste Feiertag“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?';
const HELP_REPROMPT = 'Wie kann ich dir helfen?';
const FALLBACK_MESSAGE = 'Feiertag kann dir damit nicht helfen.';
const FALLBACK_REPROMPT = 'Was kann ich dir helfen?';
const STOP_MESSAGE = 'Auf Wiedersehen!';
const ERROR_MESSAGE = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';

const amznProfileUrlBase = 'https://api.amazon.com/user/profile?access_token=';

const GetNewFactHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest'
            || (request.type === 'IntentRequest'
                && request.intent.name === 'GetNewFactIntent');
    },
    async handle(handlerInput) {
        const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;

        const consentToken = requestEnvelope.context.System.user.permissions
            && requestEnvelope.context.System.user.permissions.consentToken;
        if (!consentToken) {

            // Try using the legacy account linking
            if (requestEnvelope.session.user.accessToken != undefined) {

                const profileUrl = amznProfileUrlBase + requestEnvelope.session.user.accessToken;
                try {
                    const profile = await Axios.get(profileUrl);
                    const postalCode = profile.data.postal_code;
                    console.log('Got postal code from linked profile', postalCode);

                    // Get the region's next holiday
                    const region = detectBundesland(postalCode);
                    const date = detectHoliday(region);

                    // Create speech output
                    const speechOutput = GET_FACT_MESSAGE + region + ' ist ' + date + '.';
                    return responseBuilder
                        .speak(speechOutput)
                        .withSimpleCard(SKILL_NAME + region, date)
                        .getResponse();
                } catch (error) {
                    console.error('Got error when fetching linked profile:', error, ', url: ', profileUrl);
                }
            }

            console.log('Using default because no info');

            // Get the default next holiday
            const region = detectBundesland(0);
            const date = detectHoliday(region);
            // Create speech output
            const speechOutput = GET_FACT_MESSAGE + region + ' ist ' + date + '. ' + NOTIFY_MISSING_PERMISSIONS;
            return responseBuilder
                .speak(speechOutput)
                .withAskForPermissionsConsentCard(PERMISSIONS)
                .getResponse();
        }
        try {
            const { deviceId } = requestEnvelope.context.System.device;
            const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
            const address = await deviceAddressServiceClient.getCountryAndPostalCode(deviceId);

            // if no postal code available, return basic response asking for more data
            if (address.postalCode === null) {

                console.log('Using default because no postal code entered');

                // Get the default next holiday
                const region = detectBundesland(0);
                const date = detectHoliday(region);
                // Create speech output
                const speechOutput = GET_FACT_MESSAGE + region + ' ist ' + date + '. ' + NO_POSTAL_CODE_MESSAGE;

                return responseBuilder
                    .speak(speechOutput)
                    .withSimpleCard(SKILL_NAME + region, date)
                    .getResponse();
            } else {

                console.log('Address successfully retrieved', address);

                // Get the region's next holiday
                const region = detectBundesland(address.postalCode);
                const date = detectHoliday(region);

                // Create speech output
                const speechOutput = GET_FACT_MESSAGE + region + ' ist ' + date + '.';
                return responseBuilder
                    .speak(speechOutput)
                    .withSimpleCard(SKILL_NAME + region, date)
                    .getResponse();
            }
        } catch (error) {
            console.error('Got error:', error);
            if (error.name !== 'ServiceError') {
                return responseBuilder.speak(ERROR_MESSAGE).getResponse();
            }
            throw error;
        }
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(HELP_MESSAGE)
            .reprompt(HELP_REPROMPT)
            .getResponse();
    },
};

const FallbackHandler = {
    // 2018-May-01: AMAZON.FallbackIntent is only currently available in en-US locale.
    //              This handler will not be triggered except in that locale, so it can be
    //              safely deployed for any locale.
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt(FALLBACK_REPROMPT)
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak(STOP_MESSAGE)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(ERROR_MESSAGE)
            .getResponse();
    },
};

function detectHoliday(region) {
    const now = new Date();
    const year = now.getFullYear();
    const holidays = regions[year.toString()][region];
    const today = DateFormat(now, 'mmdd');
    var resultDate = holidays[0];
    var resultYear = year + 1;
    var dow;
    for (var i = 0; i < holidays.length; ++i) {
        // make format mmdd to have the sorting right
        const date = holidays[i].substr(3,2) + holidays[i].substr(0,2);
        if (date >= today) {
            resultDate = holidays[i];
            resultYear = year;
            // prepend the day of the week
            const holiday = new Date(resultYear.toString() + '-' + resultDate.substr(3,2) + '-' + resultDate.substr(0,2));
            dow = getDayOfWeek(holiday);
            // skip Sundays
            if (dow != 'Sonntag') {
                break;
            }
        }
    }
    return 'am ' + dow + ', dem ' + replaceMonth(resultDate);
}

function replaceMonth(str) {
    str = str.replace('.01.', '. Januar');
    str = str.replace('.02.', '. Februar');
    str = str.replace('.03.', '. März');
    str = str.replace('.04.', '. April');
    str = str.replace('.05.', '. Mai');
    str = str.replace('.06.', '. Juni');
    str = str.replace('.07.', '. Juli');
    str = str.replace('.08.', '. August');
    str = str.replace('.09.', '. September');
    str = str.replace('.10.', '. Oktober');
    str = str.replace('.11.', '. November');
    str = str.replace('.12.', '. Dezember');
    return str;
}

function getDayOfWeek(date) {
    switch (date.getDay()) {
        case 0: return 'Sonntag';
        case 1: return 'Montag';
        case 2: return 'Dienstag';
        case 3: return 'Mittwoch';
        case 4: return 'Donnerstag';
        case 5: return 'Freitag';
        case 6: return 'Samstag';
        default: return '';
    }
}

function detectBundesland(c) {
    if (c >= 1001 && c <= 1936) return 'Sachsen';
    if (c >= 1941 && c <= 1998) return 'Brandenburg';
    if (c >= 2601 && c <= 2999) return 'Sachsen';
    if (c >= 3001 && c <= 3253) return 'Brandenburg';
    if (c >= 4001 && c <= 4579) return 'Sachsen';
    if (c >= 4581 && c <= 4639) return 'Thüringen';
    if (c >= 4641 && c <= 4889) return 'Sachsen';
    if (c >= 4891 && c <= 4938) return 'Brandenburg';
    if (c >= 6001 && c <= 6548) return 'Sachsen-Anhalt';
    if (c >= 6551 && c <= 6578) return 'Thüringen';
    if (c >= 6601 && c <= 6928) return 'Sachsen-Anhalt';
    if (c >= 7301 && c <= 7919) return 'Thüringen';
    if (c >= 7919 && c <= 7919) return 'Sachsen';
    if (c >= 7919 && c <= 7919) return 'Thüringen';
    if (c >= 7919 && c <= 7919) return 'Sachsen';
    if (c >= 7920 && c <= 7950) return 'Thüringen';
    if (c >= 7951 && c <= 7951) return 'Sachsen';
    if (c >= 7952 && c <= 7952) return 'Thüringen';
    if (c >= 7952 && c <= 7952) return 'Sachsen';
    if (c >= 7953 && c <= 7980) return 'Thüringen';
    if (c >= 7982 && c <= 7982) return 'Sachsen';
    if (c >= 7985 && c <= 7985) return 'Thüringen';
    if (c >= 7985 && c <= 7985) return 'Sachsen';
    if (c >= 7985 && c <= 7989) return 'Thüringen';
    if (c >= 8001 && c <= 9669) return 'Sachsen';
    if (c >= 10001 && c <= 14330) return 'Berlin';
    if (c >= 14401 && c <= 14715) return 'Brandenburg';
    if (c >= 14715 && c <= 14715) return 'Sachsen-Anhalt';
    if (c >= 14723 && c <= 16949) return 'Brandenburg';
    if (c >= 17001 && c <= 17256) return 'Mecklenburg-Vorpommern';
    if (c >= 17258 && c <= 17258) return 'Brandenburg';
    if (c >= 17258 && c <= 17259) return 'Mecklenburg-Vorpommern';
    if (c >= 17261 && c <= 17291) return 'Brandenburg';
    if (c >= 17301 && c <= 17309) return 'Mecklenburg-Vorpommern';
    if (c >= 17309 && c <= 17309) return 'Brandenburg';
    if (c >= 17309 && c <= 17321) return 'Mecklenburg-Vorpommern';
    if (c >= 17321 && c <= 17321) return 'Brandenburg';
    if (c >= 17321 && c <= 17322) return 'Mecklenburg-Vorpommern';
    if (c >= 17326 && c <= 17326) return 'Brandenburg';
    if (c >= 17328 && c <= 17331) return 'Mecklenburg-Vorpommern';
    if (c >= 17335 && c <= 17335) return 'Brandenburg';
    if (c >= 17335 && c <= 17335) return 'Mecklenburg-Vorpommern';
    if (c >= 17337 && c <= 17337) return 'Brandenburg';
    if (c >= 17337 && c <= 19260) return 'Mecklenburg-Vorpommern';
    if (c >= 19271 && c <= 19273) return 'Niedersachsen';
    if (c >= 19273 && c <= 19273) return 'Mecklenburg-Vorpommern';
    if (c >= 19273 && c <= 19306) return 'Mecklenburg-Vorpommern';
    if (c >= 19307 && c <= 19357) return 'Brandenburg';
    if (c >= 19357 && c <= 19417) return 'Mecklenburg-Vorpommern';
    if (c >= 20001 && c <= 21037) return 'Hamburg';
    if (c >= 21039 && c <= 21039) return 'Schleswig-Holstein';
    if (c >= 21039 && c <= 21170) return 'Hamburg';
    if (c >= 21202 && c <= 21449) return 'Niedersachsen';
    if (c >= 21451 && c <= 21521) return 'Schleswig-Holstein';
    if (c >= 21522 && c <= 21522) return 'Niedersachsen';
    if (c >= 21524 && c <= 21529) return 'Schleswig-Holstein';
    if (c >= 21601 && c <= 21789) return 'Niedersachsen';
    if (c >= 22001 && c <= 22113) return 'Hamburg';
    if (c >= 22113 && c <= 22113) return 'Schleswig-Holstein';
    if (c >= 22115 && c <= 22143) return 'Hamburg';
    if (c >= 22145 && c <= 22145) return 'Schleswig-Holstein';
    if (c >= 22145 && c <= 22145) return 'Hamburg';
    if (c >= 22145 && c <= 22145) return 'Schleswig-Holstein';
    if (c >= 22147 && c <= 22786) return 'Hamburg';
    if (c >= 22801 && c <= 23919) return 'Schleswig-Holstein';
    if (c >= 23921 && c <= 23999) return 'Mecklenburg-Vorpommern';
    if (c >= 24001 && c <= 25999) return 'Schleswig-Holstein';
    if (c >= 26001 && c <= 27478) return 'Niedersachsen';
    if (c >= 27483 && c <= 27498) return 'Schleswig-Holstein';
    if (c >= 27499 && c <= 27499) return 'Hamburg';
    if (c >= 27501 && c <= 27580) return 'Bremen';
    if (c >= 27607 && c <= 27809) return 'Niedersachsen';
    if (c >= 28001 && c <= 28779) return 'Bremen';
    if (c >= 28784 && c <= 29399) return 'Niedersachsen';
    if (c >= 29401 && c <= 29416) return 'Sachsen-Anhalt';
    if (c >= 29431 && c <= 31868) return 'Niedersachsen';
    if (c >= 32001 && c <= 33829) return 'Nordrhein-Westfalen';
    if (c >= 34001 && c <= 34329) return 'Hessen';
    if (c >= 34331 && c <= 34353) return 'Niedersachsen';
    if (c >= 34355 && c <= 34355) return 'Hessen';
    if (c >= 34355 && c <= 34355) return 'Niedersachsen';
    if (c >= 34356 && c <= 34399) return 'Hessen';
    if (c >= 34401 && c <= 34439) return 'Nordrhein-Westfalen';
    if (c >= 34441 && c <= 36399) return 'Hessen';
    if (c >= 36401 && c <= 36469) return 'Thüringen';
    if (c >= 37001 && c <= 37194) return 'Niedersachsen';
    if (c >= 37194 && c <= 37195) return 'Hessen';
    if (c >= 37197 && c <= 37199) return 'Niedersachsen';
    if (c >= 37201 && c <= 37299) return 'Hessen';
    if (c >= 37301 && c <= 37359) return 'Thüringen';
    if (c >= 37401 && c <= 37649) return 'Niedersachsen';
    if (c >= 37651 && c <= 37688) return 'Nordrhein-Westfalen';
    if (c >= 37689 && c <= 37691) return 'Niedersachsen';
    if (c >= 37692 && c <= 37696) return 'Nordrhein-Westfalen';
    if (c >= 37697 && c <= 38479) return 'Niedersachsen';
    if (c >= 38481 && c <= 38489) return 'Sachsen-Anhalt';
    if (c >= 38501 && c <= 38729) return 'Niedersachsen';
    if (c >= 38801 && c <= 39649) return 'Sachsen-Anhalt';
    if (c >= 40001 && c <= 48432) return 'Nordrhein-Westfalen';
    if (c >= 48442 && c <= 48465) return 'Niedersachsen';
    if (c >= 48466 && c <= 48477) return 'Nordrhein-Westfalen';
    if (c >= 48478 && c <= 48480) return 'Niedersachsen';
    if (c >= 48481 && c <= 48485) return 'Nordrhein-Westfalen';
    if (c >= 48486 && c <= 48488) return 'Niedersachsen';
    if (c >= 48489 && c <= 48496) return 'Nordrhein-Westfalen';
    if (c >= 48497 && c <= 48531) return 'Niedersachsen';
    if (c >= 48541 && c <= 48739) return 'Nordrhein-Westfalen';
    if (c >= 49001 && c <= 49459) return 'Niedersachsen';
    if (c >= 49461 && c <= 49549) return 'Nordrhein-Westfalen';
    if (c >= 49551 && c <= 49849) return 'Niedersachsen';
    if (c >= 50101 && c <= 51597) return 'Nordrhein-Westfalen';
    if (c >= 51598 && c <= 51598) return 'Rheinland-Pfalz';
    if (c >= 51601 && c <= 53359) return 'Nordrhein-Westfalen';
    if (c >= 53401 && c <= 53579) return 'Rheinland-Pfalz';
    if (c >= 53581 && c <= 53604) return 'Nordrhein-Westfalen';
    if (c >= 53614 && c <= 53619) return 'Rheinland-Pfalz';
    if (c >= 53621 && c <= 53949) return 'Nordrhein-Westfalen';
    if (c >= 54181 && c <= 55239) return 'Rheinland-Pfalz';
    if (c >= 55240 && c <= 55252) return 'Hessen';
    if (c >= 55253 && c <= 56869) return 'Rheinland-Pfalz';
    if (c >= 57001 && c <= 57489) return 'Nordrhein-Westfalen';
    if (c >= 57501 && c <= 57648) return 'Rheinland-Pfalz';
    if (c >= 58001 && c <= 59966) return 'Nordrhein-Westfalen';
    if (c >= 59969 && c <= 59969) return 'Hessen';
    if (c >= 59969 && c <= 59969) return 'Nordrhein-Westfalen';
    if (c >= 60001 && c <= 63699) return 'Hessen';
    if (c >= 63701 && c <= 63774) return 'Bayern';
    if (c >= 63776 && c <= 63776) return 'Hessen';
    if (c >= 63776 && c <= 63928) return 'Bayern';
    if (c >= 63928 && c <= 63928) return 'Baden-Württemberg';
    if (c >= 63930 && c <= 63939) return 'Bayern';
    if (c >= 64201 && c <= 64753) return 'Hessen';
    if (c >= 64754 && c <= 64754) return 'Baden-Württemberg';
    if (c >= 64754 && c <= 65326) return 'Hessen';
    if (c >= 65326 && c <= 65326) return 'Rheinland-Pfalz';
    if (c >= 65327 && c <= 65391) return 'Hessen';
    if (c >= 65391 && c <= 65391) return 'Rheinland-Pfalz';
    if (c >= 65392 && c <= 65556) return 'Hessen';
    if (c >= 65558 && c <= 65582) return 'Rheinland-Pfalz';
    if (c >= 65583 && c <= 65620) return 'Hessen';
    if (c >= 65621 && c <= 65626) return 'Rheinland-Pfalz';
    if (c >= 65627 && c <= 65627) return 'Hessen';
    if (c >= 65629 && c <= 65629) return 'Rheinland-Pfalz';
    if (c >= 65701 && c <= 65936) return 'Hessen';
    if (c >= 66001 && c <= 66459) return 'Saarland';
    if (c >= 66461 && c <= 66509) return 'Rheinland-Pfalz';
    if (c >= 66511 && c <= 66839) return 'Saarland';
    if (c >= 66841 && c <= 67829) return 'Rheinland-Pfalz';
    if (c >= 68001 && c <= 68312) return 'Baden-Württemberg';
    if (c >= 68501 && c <= 68519) return 'Hessen';
    if (c >= 68520 && c <= 68549) return 'Baden-Württemberg';
    if (c >= 68601 && c <= 68649) return 'Hessen';
    if (c >= 68701 && c <= 69234) return 'Baden-Württemberg';
    if (c >= 69235 && c <= 69239) return 'Hessen';
    if (c >= 69240 && c <= 69429) return 'Baden-Württemberg';
    if (c >= 69430 && c <= 69431) return 'Hessen';
    if (c >= 69434 && c <= 69434) return 'Baden-Württemberg';
    if (c >= 69434 && c <= 69434) return 'Hessen';
    if (c >= 69435 && c <= 69469) return 'Baden-Württemberg';
    if (c >= 69479 && c <= 69488) return 'Hessen';
    if (c >= 69489 && c <= 69502) return 'Baden-Württemberg';
    if (c >= 69503 && c <= 69509) return 'Hessen';
    if (c >= 69510 && c <= 69514) return 'Baden-Württemberg';
    if (c >= 69515 && c <= 69518) return 'Hessen';
    if (c >= 70001 && c <= 74592) return 'Baden-Württemberg';
    if (c >= 74594 && c <= 74594) return 'Bayern';
    if (c >= 74594 && c <= 76709) return 'Baden-Württemberg';
    if (c >= 76711 && c <= 76891) return 'Rheinland-Pfalz';
    if (c >= 77601 && c <= 79879) return 'Baden-Württemberg';
    if (c >= 80001 && c <= 87490) return 'Bayern';
    //if (c >= 87491 && c <= 87491) return 'Außerhalb der BRD';
    if (c >= 87493 && c <= 87561) return 'Bayern';
    //if (c >= 87567 && c <= 87569) return 'Außerhalb der BRD';
    if (c >= 87571 && c <= 87789) return 'Bayern';
    if (c >= 88001 && c <= 88099) return 'Baden-Württemberg';
    if (c >= 88101 && c <= 88146) return 'Bayern';
    if (c >= 88147 && c <= 88147) return 'Baden-Württemberg';
    if (c >= 88147 && c <= 88179) return 'Bayern';
    if (c >= 88181 && c <= 89079) return 'Baden-Württemberg';
    if (c >= 89081 && c <= 89081) return 'Bayern';
    if (c >= 89081 && c <= 89085) return 'Baden-Württemberg';
    if (c >= 89087 && c <= 89087) return 'Bayern';
    if (c >= 89090 && c <= 89198) return 'Baden-Württemberg';
    if (c >= 89201 && c <= 89449) return 'Bayern';
    if (c >= 89501 && c <= 89619) return 'Baden-Württemberg';
    if (c >= 90001 && c <= 96489) return 'Bayern';
    if (c >= 96501 && c <= 96529) return 'Thüringen';
    if (c >= 97001 && c <= 97859) return 'Bayern';
    if (c >= 97861 && c <= 97877) return 'Baden-Württemberg';
    if (c >= 97888 && c <= 97892) return 'Bayern';
    if (c >= 97893 && c <= 97896) return 'Baden-Württemberg';
    if (c >= 97896 && c <= 97896) return 'Bayern';
    if (c >= 97897 && c <= 97900) return 'Baden-Württemberg';
    if (c >= 97901 && c <= 97909) return 'Bayern';
    if (c >= 97911 && c <= 97999) return 'Baden-Württemberg';
    if (c >= 98501 && c <= 99998) return 'Thüringen';
    return 'Deutschland';
}

const skillBuilder = Alexa.SkillBuilders.custom();

export const handler = skillBuilder
    .addRequestHandlers(
        GetNewFactHandler,
        HelpHandler,
        ExitHandler,
        FallbackHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
