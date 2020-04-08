import { API } from './config';
import { ERR_OK } from './config';
import axios from 'axios';

/**
 * 获取排行榜
 * @date 2020-03-25
 * @returns {Promise}
 */
export function getToplist() {
  const url = API.RANK.DISCLIST;
  return axios
    .get(url)
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.list);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 获取榜单详情列表
 * @date 2020-03-26
 * @param {any} idx
 * @returns {Promise}
 */
export function getDetail(idx) {
  const url = API.RANK.DISCLIST_SONGS;
  return axios
    .get(url, {
      params: {
        idx
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.playlist);
      }
    })
    .catch(err => {
      console.log(err);
    });
}
