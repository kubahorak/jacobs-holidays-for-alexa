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

const Alexa = require('alexa-sdk');
const Request = require('request');

const APP_ID = 'amzn1.ask.skill.ce8ae59b-efe3-4c0b-a55c-3c83fdc9aeb3';

const amznProfileUrlBase = 'https://api.amazon.com/user/profile?access_token=';

const regions = {
    'Deutschland':            '14. April',
    'Baden-Württemberg':      '14. April',
    'Bayern':                 '14. April',
    'Berlin':                 '14. April',
    'Brandenburg':            '14. April',
    'Bremen':                 '14. April',
    'Hamburg':                '14. April',
    'Hessen':                 '14. April',
    'Mecklenburg-Vorpommern': '14. April',
    'Niedersachsen':          '14. April',
    'Nordrhein-Westfalen':    '14. April',
    'Rheinland-Pfalz':        '14. April',
    'Saarland':               '14. April',
    'Sachsen':                '14. April',
    'Sachsen-Anhalt':         '14. April',
    'Schleswig-Holstein':     '14. April',
    'Thüringen':              '14. April',
};

const languageStrings = {
    'de-DE': {
        translation: {
            SKILL_NAME: 'Feiertag',
            GET_FACT_MESSAGE: 'Der nächste gesetzliche Feiertag in ',
            HELP_MESSAGE: 'Du kannst sagen, „Wann ist der nächste Feiertag“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            LINK_MESSAGE: 'Bitte verwenden Sie die Begleit-App, um auf Amazon zu authentifizieren und deshalb Ihr Bundesland zu angeben.',
            ERROR_MESSAGE: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {

        console.log('Event: ' + JSON.stringify(this.event));

        // if no amazon token, return a LinkAccount card
        if (this.event.session.user.accessToken == undefined) {

            // Get the region's next holiday
            var region = detectBundesland(0);
            const date = regions[region];
            // Create speech output
            const speechOutput = this.t('GET_FACT_MESSAGE') + region + ' ist am ' + date + '.';

            this.emit(':tellWithLinkAccountCard', speechOutput + ' ' + this.t('LINK_MESSAGE'));
        } else {

            var profileUrl = amznProfileUrlBase + this.event.session.user.accessToken;
            var that = this;
            Request(profileUrl, function(error, response, body) {
                if (response.statusCode == 200) {
                    console.log("Got profile:", body);
                    var profile = JSON.parse(body);
                    var postalCode = profile.postal_code;

                    // Get the region's next holiday
                    var region = detectBundesland(postalCode);
                    const date = regions[region];

                    // Create speech output
                    const speechOutput = that.t('GET_FACT_MESSAGE') + region + ' ist am ' + date + '.';
                    that.emit(':tellWithCard', speechOutput, that.t('SKILL_NAME'), date);
                } else {
                    console.error("Got error:", error);
                    that.emit(':tell', that.t('ERROR_MESSAGE'));
                }
            });
        }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

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

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
