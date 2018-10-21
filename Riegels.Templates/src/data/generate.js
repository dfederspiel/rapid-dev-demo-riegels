// https://lodash.com/
// https://github.com/Marak/faker.js
module.exports = function () {
    var faker = require('faker');
    var moment = require('moment');
    var _ = require('lodash');
    return {
        config: {
            // Config for quicktype c# generators
            quicktype: {
                distributionPath: './dist/csharp/',
                rootUrl: 'http://localhost:3000',
                modelServicePaths: [
                    {
                        fileName: "Article",
                        url: "/api/articles"
                    }
                ]
            }
        },
        // build random algorithm to find permutations of various properties
        heroVideos: _.times(5, function (n) {
            return {
                id: n,
                heading: "Test",
                subHeading: "Subheading",
                videos: [{
                    id: 0,
                    url: 'http://',
                    mimeType: 'video/webm',
                    date: faker.date.future
                }]
            }
        }),
        sitefinitySelectors: [{
            id: 0,
            tag: 'sf-library-selector',
            attributes: {
                type: {
                    name: "type",
                    default: "sf-library-selector"
                },
                mediaType: {
                    name: "sf-media-type",
                    default: "images"
                },
                multiSelect: {
                    name: "sf-multiselect",
                    default: "false"
                },
                sortable: {
                    name: "sf-sortable",
                    default: "false"
                },
                provider: {
                    name: "sf-provider",
                    default: "properties.ProviderName.PropertyValue"
                },
                selectedIds: {
                    name: "sf-selected-ids",
                    default: "properties.SelectedItemId.PropertyValue"
                },
                selectedItems: {
                    name: "sf-selected-items",
                    default: "properties.SelectedItem.PropertyValue"
                }
            }
        }],
        articles: _.times(20, function (n) {
            var article = {
                id: n,
                title: faker.random.words(Math.ceil(Math.random() * 10)),
                date: faker.date.past(),
                authorId: faker.random.number({
                    min: 0,
                    max: 19
                }),
                body: faker.lorem.words(Math.ceil(Math.random() * 100))
            };
            return article;
        }),
        authors: _.times(20, function (n) {
            return {
                id: n,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                bio: faker.lorem.words(Math.ceil(Math.random() * 50)),
                website: faker.internet.url()
            };
        }),
        ipsum: _.times(1000, function (n) {
            return faker.lorem.words(1);
        }),
        events: {
            "accessRole": "owner",
            "defaultReminders": [],
            "description": "Events for Riegels Pipe and Tobacco",
            "etag": "\"p330dptufjmcds0g\"",
            items: _.times(5, () => {
                return {
                    "anyoneCanAddSelf": null,
                    "attachments": [{
                        "fileId": "0B6LiBzzwZVZ_UEVNODV1WnVmUWM",
                        "fileUrl": "https://drive.google.com/a/federnet.com/file/d/0B6LiBzzwZVZ_UEVNODV1WnVmUWM/view?usp=drive_web",
                        "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg",
                        "mimeType": "image/jpeg",
                        "title": "Danielle - Grand Wayne (19 of 34) - Fixed.jpg",
                        "ETag": null
                    }],
                    "attendees": null,
                    "attendeesOmitted": null,
                    "colorId": null,
                    "conferenceData": null,
                    "created": "2018-10-21T16:30:07.000Z",
                    "creator": {
                        "displayName": "David Federspiel",
                        "email": "david@federnet.com",
                        "id": null,
                        "self": null
                    },
                    "description": "<b>Lorem ipsum dolor sit amet</b>,&nbsp;<br><br>consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                    "end": {
                        "date": null,
                        "dateTime": "2018-10-23T14:15:00-04:00",
                        "timeZone": null,
                        "ETag": null
                    },
                    "endTimeUnspecified": null,
                    "etag": "\"3080297729744000\"",
                    "extendedProperties": {
                        "private": {
                            "everyoneDeclinedDismissed": "-1"
                        },
                        "shared": null
                    },
                    "gadget": null,
                    "guestsCanInviteOthers": null,
                    "guestsCanModify": null,
                    "guestsCanSeeOtherGuests": null,
                    "hangoutLink": null,
                    "htmlLink": "https://www.google.com/calendar/event?eid=MWVzYnYzb2hpOW5nb3I5OTAwb2N2YTZmaG4gZmVkZXJuZXQuY29tX291dDhyNzJ2Z3M4cWFjZWE4MWhhaG50bWQwQGc",
                    "iCalUID": "1esbv3ohi9ngor9900ocva6fhn@google.com",
                    "id": "1esbv3ohi9ngor9900ocva6fhn",
                    "kind": "calendar#event",
                    "location": "Riegel's Pipe & Tobacco Shop, 624 S Calhoun St, Fort Wayne, IN 46802, USA",
                    "locked": null,
                    "organizer": {
                        "displayName": "Riegels",
                        "email": "federnet.com_out8r72vgs8qacea81hahntmd0@group.calendar.google.com",
                        "id": null,
                        "self": true
                    },
                    "originalStartTime": null,
                    "privateCopy": null,
                    "recurrence": null,
                    "recurringEventId": null,
                    "reminders": {
                        "overrides": null,
                        "useDefault": true
                    },
                    "sequence": 2,
                    "source": null,
                    "start": {
                        "date": null,
                        "dateTime": "2018-10-23T11:15:00-04:00",
                        "timeZone": null,
                        "ETag": null
                    },
                    "status": "confirmed",
                    "summary": "Kickoff October Party",
                    "transparency": null,
                    "updated": "2018-10-21T19:07:44.872Z",
                    "visibility": null
                }
            }),
            "kind": "calendar#events",
            "nextPageToken": null,
            "nextSyncToken": null,
            "summary": "Riegels",
            "timeZone": "America/New_York",
            "updated": "2018-10-21T19:07:44.872Z"
        }
    };
};