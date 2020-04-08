import * as types from './mutation-types';
import { Shuffle, findIndex } from 'assets/js/common';
import { PlayMode } from 'assets/js/config';
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavoriate,
  deleteFavorite
} from 'assets/js/cache';

/**
 * 点击音乐列表其中一项开始播放
 * @date 2020-03-24
 * @param {Function} {commit
 * @param {Object} state}
 * @param {Array} {list
 * @param {Number} index}
 * @returns {void}
 */
export function selectPlay({ commit, state }, { list, index }) {
  // 如果当前播放模式是随机播放
  if (state.playMode === PlayMode.random) {
    // 获得一个新的随机播放列表
    let randomList = Shuffle(list);
    index = findIndex(randomList, list[index]);
    // 设置播放列表
    commit(types.SET_PLAY_LIST, randomList);
  } else {
    // 设置播放列表
    commit(types.SET_PLAY_LIST, list);
  }
  // 设置序列列表
  commit(types.SET_SEQUENCE_LIST, list);
  // 设置展开播放
  commit(types.SET_FULL_SCREEN, true);
  // 设置当前播放索引
  commit(types.SET_PLAY_INDEX, index);
}

/**
 * 随机播放音乐列表
 * @date 2020-03-28
 * @param {Function} {commit}
 * @param {Array} list
 * @returns {void}
 */
export function playRandom({ commit }, list) {
  // 打乱列表
  list = Shuffle(list);
  // 设置序列列表
  commit(types.SET_SEQUENCE_LIST, list);
  // 设置播放列表
  commit(types.SET_PLAY_LIST, list);
  // 设置展开播放
  commit(types.SET_FULL_SCREEN, true);
  // 设置当前播放索引
  commit(types.SET_PLAY_INDEX, 0);
  // 设置播放模式
  commit(types.SET_PLAY_MODE, PlayMode.random);
}

/**
 * 在搜索页面，往播放列表插入歌曲
 * @date 2020-03-28
 * @param {Function} {commit
 * @param {Object} state}
 * @param {Song} song
 * @returns {void}
 */
export function insertSong({ commit, state }, song) {
  /**
   *  因为vuex不允许直接修改state中的值，所以需要对引用类型的数据进行副本拷贝
   */
  let playList = state.playList.slice(); // 引用类型
  let sequenceList = state.sequenceList.slice(); // 引用类型
  let playIndex = state.playIndex; // 值类型

  // 获取当前播放的音乐
  let currentSong = playList[playIndex];
  let fpIndex = findIndex(playList, song);
  playIndex++;
  playList.splice(playIndex, 0, song);
  if (fpIndex > -1) {
    if (playIndex > fpIndex) {
      playList.splice(fpIndex, 1);
      // 当前播放索引-1是因为，前面少了一个元素，后面就会向前移动，但是索引对应的歌曲不变
      playIndex--;
    } else {
      // 加一的原因是已经插入了song
      playList.splice(fpIndex + 1, 1);
    }
  }

  // 当前播放歌曲在SequenceList中的位置
  let currentIndex = findIndex(sequenceList, currentSong);
  // 待插入歌曲在Sequencelist中的位置
  let fsIndex = findIndex(sequenceList, song);
  currentIndex++;
  // 插入待插入歌曲
  sequenceList.splice(currentIndex, 0, song);
  if (fsIndex > -1) {
    if (currentIndex > fsIndex) {
      //要添加的歌曲在当前播放歌曲前面
      sequenceList.splice(fsIndex, 1);
    } else {
      // 在后面
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_PLAY_INDEX, playIndex);
  commit(types.SET_FULL_SCREEN, true);

  /**
   * 找到当前播放的歌曲
   * result = 判断playlist中有无song这首歌曲
   * 当前播放索引+1, 向playlist中在当前播放索引的位置插入该歌曲
   * 如果result>-1
   *  如果当前播放索引 > result : 证明插入的song前面存在相同歌曲
   *    删除前面存在的相同的歌曲  当前播放索引--
   *  否则 : 证明插入的song后面存在相同歌曲
   *    删除后面存在的相同的歌曲  当前播放索引--
   * 提交mutation，修改playList， sequenceList， playindex
   * */
}

/**
 * 从列表中删除一首歌
 * @date 2020-03-29
 * @param {Function} {commit
 * @param {Object} state}
 * @param {Song} song
 * @returns {void}
 */
export function deleteSong({ commit, state }, song) {
  /**
   *  因为vuex不允许直接修改state中的值(严格模式)，所以需要对引用类型的数据进行副本拷贝
   */
  let playList = state.playList.slice(); // 引用类型
  let sequenceList = state.sequenceList.slice(); // 引用类型
  let playIndex = state.playIndex; // 值类型

  let pIndex = findIndex(playList, song);
  playList.splice(pIndex, 1);
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  // 注意,到这里，已经完成删除的操作
  if (playIndex > pIndex || playIndex === playList.length) {
    playIndex--;
  }

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_PLAY_INDEX, playIndex);
  // 如果当前播放列表已经为空
  if (!playList.length) {
    // 暂停播放 stop play
    commit(types.SET_PLAYING_STATE, false);
  }
}

/**
 * 保存搜索历史
 * @date 2020-03-28
 * @param {String} query
 * @returns {void}
 */
export function saveSearchHistory({ commit }, query) {
  let searches = saveSearch(query);
  commit(types.SET_SEARCH_HISTORY, searches);
}

/**
 * 删除搜索历史项
 * @date 2020-03-29
 * @param {Function} {commit}
 * @param {String} query
 * @returns {void}
 */
export function deleteSearchHistory({ commit }, query) {
  let searches = deleteSearch(query);
  commit(types.SET_SEARCH_HISTORY, searches);
}

/**
 * 清空搜索历史列表
 * @date 2020-03-29
 * @param {Function} {commit}
 * @returns {void}
 */
export function clearSearchHistory({ commit }) {
  let searches = clearSearch();
  commit(types.SET_SEARCH_HISTORY, searches);
}

/**
 * 清空歌曲列表(playList, sequenceList)
 * @date 2020-03-29
 * @param {Function} {commit}
 * @returns {void}
 */
export function deleteList({ commit }) {
  commit(types.SET_PLAY_LIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_PLAY_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
}

/**
 * 保存播放历史
 * @date 2020-03-30
 * @param {Function} {commit}
 * @param {Song} song
 * @returns {void}
 */
export function savePlayHistory({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
}

/**
 * 添加喜欢的音乐
 * @date 2020-03-31
 * @param {Function} {commit}
 * @param {Song} song
 * @returns {void}
 */
export function saveFav({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavoriate(song));
}

/**
 * 删除喜欢的音乐
 * @date 2020-03-31
 * @param {Function} {commit}
 * @param {Song} song
 * @returns {void}
 */
export function deleteFav({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}
