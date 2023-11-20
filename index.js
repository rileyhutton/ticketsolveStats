function formatURL(urlInput) {
    const clientNameRegex = /^([a-z]|-|[0-9])+$/is
    if (clientNameRegex.test(urlInput)) {
        return urlInput + ".ticketsolve.co.uk"
    } else {
        const fullURLRegex = /([a-z]|-|[0-9])+\.([a-z]|-|[0-9]){1,63}\.([a-z]{2}\.)?([a-z]{2,3})/i
        let result = urlInput.match(fullURLRegex)
        if (result == null) {
            throw new Error('URL invalid!');
        }
        return result[0]
    }
}
