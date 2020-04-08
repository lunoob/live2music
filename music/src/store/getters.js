/* ---歌手模块--------------------------------------------------- */
export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const playMode = state => state.playMode;

export const playIndex = state => state.playIndex;

// 当前播放歌曲
export const currentSong = state => {
  // 如果 state.playList[state.playIndex] 存在就不会找 || 后面的空对象{}
  // 可以替换三木表达式写法
  // let variable = a ? a : ''; ==> let variable = a || '';
  return state.playList[state.playIndex] || {};
};

/* ---推荐模块--------------------------------------------------- */
export const desc = state => state.desc;

/* ---排行榜模块--------------------------------------------------- */
export const toplist = state => state.toplist;

/* ---搜索模块--------------------------------------------------- */
export const searchHistory = state => state.searchHistory;

/* ---播放模块--------------------------------------------------- */
export const playHistory = state => state.playHistory;

// 喜欢的音乐列表
export const favoriteList = state => state.favoriteList;

// 搜索框
export const inputActive = state => state.inputActive;
