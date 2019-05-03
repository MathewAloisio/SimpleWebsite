// A NodeJS module for generating random characters and strings.
const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * randomCharacter
 * Gets a random character in the range [A-Za-z0-9].
 * @returns A random character in the range [A-Za-z0-9].
 */
function randomCharacter() {
    return charList.charAt(Math.floor(Math.random() * charList.length));
}

function randomString(pLength) {
    let strOut = "";
    for (let i = 0; i < pLength; ++i) {
        strOut += randomCharacter();
    }

    return strOut;
}

module.exports = { randomCharacter, randomString };