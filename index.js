const xmlParser = require('xml2js')
const var_dump = require('var_dump')

function formatURL(urlInput) {
    const clientNameRegex = /^([a-z]|-|[0-9])+$/is
    if (clientNameRegex.test(urlInput)) {
        return urlInput + ".ticketsolve.com"
    } else {
        const fullURLRegex = /([a-z]|-|[0-9])+\.([a-z]|-|[0-9]){1,63}\.([a-z]{2}\.)?([a-z]{2,3})/i
        let result = urlInput.match(fullURLRegex)
        if (result == null) {
            throw new Error('URL invalid!');
        }
        return result[0]
    }
}
async function getShowsArray(clientUrl) {
    const showsXmlUrl = "https://" + clientUrl + "/shows.xml"
    const response = await fetch(showsXmlUrl)
    const content = await response.text()
    const data = await xmlParser.parseStringPromise(content)
    const showsXml = await data['venues']['venue'][0]['shows'][0]['show']

    let showsArray = [];
    showsXml.forEach(function(show) {
        let events = []
        show['events'][0]['event'].forEach(function(event) {
            events.push({'url': event['feed'][0]['url'][0]})
        })
        let showDict = {'name': show['name'][0].trim(), 'id': show['$']['id'], 'image': show['images'][0]['image'][0]['url'][1]['_'], 'events': events}
        showsArray.push(showDict)


    })
    return showsArray;
}

async function fetchEvent(eventUrl) {
    const response = await fetch(eventUrl)
    const content = await response.text()
    const data = await xmlParser.parseStringPromise(content)
    const eventDict = {'name': data['event']['name'][0].trim(), 'available': parseInt(data['event']['available'][0]), 'capacity': parseInt(data['event']['capacity'][0])}
    eventDict["percent"] = eventDict['available']/eventDict['capacity']
    return eventDict;
}

async function getEventsInfo(show) {
    const events = show["events"]
    let eventsInfo = []
    events.forEach(function(event) {
        fetchEvent(event['url'])
            .then((eventInfo) => {
                eventsInfo.push(eventInfo)
                }
            )
    })
    return eventsInfo
}

function logShowList(showsArray) {
    let i = 0;
    showsArray.forEach(function(show) {
        console.log(i.toString() + ": " + show['name'])
        i += 1;
    })
}



const url = formatURL("lancastergrand")
getShowsArray(url)
    .then((showsArray) => {
        logShowList(showsArray)
        getEventsInfo(showsArray[69])
            .then((eventsArray) => {
                console.log(eventsArray)
            })
    })

