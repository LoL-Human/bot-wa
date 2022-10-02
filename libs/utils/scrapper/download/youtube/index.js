const { post } = require('@libs/utils/http')

/**
 *
 * @param { string } url
 * @param { 'mp3' | 'mp4' } type
 * @returns { Promise<{title: string, thumbnail: string, size: string, link: string}> }
 */
const youtube = async (url, type) => {
    var videoId = getYoutubeID(url)
    var { data } = await post('https://yt1s.com/api/ajaxSearch/index', {
        q: 'https://www.youtube.com/watch?v=' + videoId,
        vt: 'home',
    })

    var kc, size
    if (type == 'mp3') {
        kc = data.links.mp3.mp3128.k
        size = data.links.mp3.mp3128.size
    } else if (type == 'mp4') {
        kc = data.links.mp4['18'].k
        size = data.links.mp4['18'].size
    }

    var { data: convert } = await post('https://yt1s.com/api/ajaxConvert/convert', {
        vid: videoId,
        k: kc,
    })

    return {
        title: data['title'],
        thumbnail: `https://i.ytimg.com/vi/${data['vid']}/mqdefault.jpg`,
        size,
        link: convert.dlink.replace('https://', 'http://'),
    }
}

/**
 *
 * @param { string } url
 * @returns { string }
 */
const getYoutubeID = (url) => {
    return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|shorts|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/.exec(url)[1]
}

module.exports = {
    youtube,
    getYoutubeID,
}
