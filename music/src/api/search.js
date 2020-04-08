import { API } from './config';
import { ERR_OK } from './config';
import axios from 'axios';

/**
 * 获取热门搜索简略版
 * @date 2020-03-27
 * @returns {Promise}
 */
export function hotSearch() {
  let url = API.SEARCH.HOST_SEARCH;
  return axios
    .get(url)
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.result);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 关键词搜索
 * @date 2020-03-27
 * @param {String} keyword
 * @returns {any}
 */
export function keySearch(keyword, page = 1, num = 30) {
  let url = API.SEARCH.KEY_SEARCH;
  return axios
    .get(url, {
      params: {
        limit: num,
        keywords: keyword,
        offset: (page - 1) * 30
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.result);
      }
    })
    .catch(err => {
      console.log(err);
    });
}
