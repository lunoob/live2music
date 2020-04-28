import { API, ERR_OK } from './config';

import axios from 'axios';

/**
 * 获取单首歌的url
 * @date 2020-03-21
 * @param {Number|String} id
 * @returns {Promise}
 */

export function getMusicUrl(id) {
  const url = API.PLAYER.SONG_URL;
  return axios
    .get(url, {
      params: {
        id
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.data[0]);
      }
    })
    .catch(err => {
      // console.log(err);
      return Promise.resolve('err');
    });
}

/**
 * 获取歌词单词
 * @date 2020-03-23
 * @param {Number|String} id
 * @returns {Promise}
 */
export function getMusicLyric(id) {
  const url = API.PLAYER.SONG_LYRIC;
  return axios
    .get(url, {
      params: {
        id
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.lrc);
      }
    })
    .catch(err => {
      // console.log(err);
      return Promise.resolve('err');
    });
}

/**
 * 获取音乐的封面图
 * @date 2020-03-28
 * @param {String|Number} ids
 * @returns {Promise}
 */
export function getMusicImage(ids) {
  const url = API.PLAYER.PIC_IMAGE;
  return axios
    .get(url, {
      params: {
        ids
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.songs);
      }
    })
    .catch(err => {
      // console.log(err);
      return Promise.resolve('err');
    });
}

/**
 * 检查该音乐是否可用
 * @date 2020-04-06
 * @param {Number|String} id
 * @returns {Promise}
 */
export function checkUse(id) {
  let url = API.PLAYER.SONG_CAN_USE;
  return axios
    .get(url, {
      params: {
        id
      }
    })
    .then(res => {
      return Promise.resolve(res.data.message);
    })
    .catch(err => {
      // console.log(err.message);
      return Promise.resolve('该音乐不可用或无版权');
    });
}
