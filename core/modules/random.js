// A NodeJS module for generating random characters and strings.
const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
module.exports = {
    /**
     * randomCharacter
     * Gets a random character in the range [A-Za-z0-9].
     * @returns A random character in the range [A-Za-z0-9].
     */
    randomCharacter: () => {
        return characters.charAt(Math.floor(Math.random() * charList.length));
    },

    /**
     * randomString
     * @description Generates and returns a random string of pLength composed of characters in the range [A-Za-z0-0].
     * @param {*} pLength - The # of characters in the randomly generated string.
     * @returns a random string of pLength composed of characters in the range [A-Za-z0-0].
     */
    randomString: (pLength) => {
        let strOut = "";
        for (let i = 0; i < pLength; ++i) {
            strOut += randomCharacter();
        }

        return strOut;
    }
}