import * as Types from './mutation-types';
import { findIndex } from 'assets/js/common';
import { NewSong } from 'assets/js/song';

const mutations = {
  /* ---歌手模块--------------------------------------------------- */
  [Types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [Types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [Types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [Types.SET_PLAY_LIST](state, list) {
    state.playList = list;
  },
  [Types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [Types.SET_PLAY_MODE](state, mode) {
    state.playMode = mode;
  },
  [Types.SET_PLAY_INDEX](state, index) {
    state.playIndex = index;
  },
  [Types.SET_SONG_INFO](state, { newSong, info }) {
    let fpindex = findIndex(state.playList, newSong);
    let fsindex = findIndex(state.sequenceList, newSong);
    let Song = NewSong({
      ...state.playList[fpindex],
      ...info
    });
    // 这里先增加后删除的原因是为了要触发getter中currentSong的更新机制
    state.playList.splice(fpindex, 0, Song);
    state.playList.splice(fpindex + 1, 1);
    state.sequenceList.splice(fsindex, 0, Song);
    state.sequenceList.splice(fsindex + 1, 1);
  },

  /* ---推荐模块--------------------------------------------------- */
  [Types.SET_DESC](state, desc) {
    state.desc = desc;
  },

  /* ---排行榜模块--------------------------------------------------- */
  [Types.SET_TOP_LIST](state, toplist) {
    state.toplist = toplist;
  },

  /* ---搜索模块--------------------------------------------------- */
  [Types.SET_SEARCH_HISTORY](state, History) {
    state.searchHistory = History;
  },
  [Types.SET_PLAY_HISTORY](state, History) {
    state.playHistory = History;
  },
  // 喜欢的音乐列表
  [Types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  },
  // 搜索框
  [Types.SET_INPUT_ACTIVE](state, flag) {
    state.inputActive = flag;
  }
};

export default mutations;
