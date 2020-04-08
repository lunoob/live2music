import { API } from './config';
import { ERR_OK } from './config';
import axios from 'axios';

/**
 * 华语男歌手
 * @date 2020-03-25
 * @returns {any}
 */
const getSingerMan = () => {
  let url = API.SINGER.MAN_LIST;
  return axios.get(url);
};

/**
 * 华语女歌手数据
 * @date 2020-03-25
 * @returns {any}
 */
const getSingerWomen = () => {
  let url = API.SINGER.WOMEN_LIST;
  return axios.get(url);
};

/**
 * 对热门歌手(男华, 女华)数据进行获取和聚合
 * @date 2020-03-25
 * @returns {any}
 */
export function getSingerList() {
  return Promise.all([getSingerMan(), getSingerWomen()])
    .then(res => {
      let result = [];
      for (let i = 0; i < res.length; i++) {
        if (ERR_OK === res[i].data.code) {
          result.push(...res[i].data.artists);
        }
      }
      return Promise.resolve(result);
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 热门歌手
 * @date 2020-03-25
 * @returns {Promise}
 */
export function getHotSinger() {
  let url = API.SINGER.HOST_LIST;
  return axios
    .get(url)
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data.artists);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 根据id获取歌手单曲
 * @date 2020-03-25
 * @param {Number|String} id
 * @returns {Promise}
 */
export function getSongList(id) {
  let url = API.SINGER.SONG_LIST;
  return axios
    .get(url, {
      params: {
        id
      }
    })
    .then(res => {
      if (ERR_OK === res.data.code) {
        return Promise.resolve(res.data);
      }
    })
    .catch(err => {
      console.log(err);
    });
}
