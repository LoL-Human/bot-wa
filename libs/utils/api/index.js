const { default: axios } = require('axios')
const config = require('@config')

const apiBaseUrl = {
    lolhuman: 'https://api.lolhuman.xyz',
}

const apiKey = {
    lolhuman: {
        key: 'apikey',
        value: config.apikey,
    },
}

/**
 *
 * @param { string } apiName
 * @returns { import('axios').AxiosInstance }
 */
const api = (apiName) => {
    return axios.create({
        baseURL: apiBaseUrl[apiName],
        params: {
            [apiKey[apiName].key]: apiKey[apiName].value,
        },
    })
}

module.exports = api
