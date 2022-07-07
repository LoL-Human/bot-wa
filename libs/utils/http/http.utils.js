const { default: axios, AxiosRequestConfig, AxiosResponse } = require('axios')
const FormData = require('form-data')
const qs = require('querystring')

/**
 *
 * @param { string } url
 * @param { FormData | {} } formdata
 * @param { AxiosRequestConfig } options
 * @returns { Promise<AxiosResponse> }
 */
const post = async (url, formdata, options) => {
    return new Promise((resolve, reject) => {
        if (!(formdata instanceof FormData)) {
            return axios
                .post(url, qs.stringify(formdata), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    ...options,
                })
                .then(resolve)
                .catch(reject)
        } else {
            return axios
                .post(url, formdata, { headers: formdata.getHeaders(), ...options })
                .then(resolve)
                .catch(reject)
        }
    })
}

module.exports = {
    post,
}
