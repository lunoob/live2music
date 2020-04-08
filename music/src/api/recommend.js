import { API, ERR_OK } from './config';
import axios from 'axios';

/**
 * 获取轮播图数据
 * @date 2020-03-25
 * @returns {Promise}
 */
export function getRecommend() {
  // tpye = 2 表示 获取安卓移动端的数据
  const url = API.RECOMMEND.BANNER;
  return axios
    .get(url, {
      params: {
        type: 2
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.banners);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 获取推荐歌单数据
 * @date 2020-03-25
 * @returns {Promise}
 */
export function getDiscList() {
  const url = API.RECOMMEND.DISCLIST;
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
 * 获取歌单详情列表
 * @date 2020-03-25
 * @param {Number|String} id
 * @returns {Promise}
 */
export function getDetail(id) {
  const url = API.RECOMMEND.DISCLIST_SONGS;
  return axios
    .get(url, {
      params: {
        id
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
