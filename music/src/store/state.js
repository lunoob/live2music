import { PlayMode } from 'assets/js/config';
import { loadSearch, loadPlay, loadFavorite } from 'assets/js/cache';

// 因为模块不是特别多，所以暂时不适用module的写法

const state = {
  /* ---歌手模块--------------------------------------------------- */
  // 歌手信息
  singer: [],
  // 播放状态, 默认为暂停
  playing: false,
  // 展开和收起, 默认不展开
  fullScreen: false,
  // 播放列表
  playList: [],
  // 播放状态列表
  sequenceList: [],
  // 播放模式
  playMode: PlayMode.sequence,
  // 播放索引
  playIndex: -1,

  /* ---推荐模块--------------------------------------------------- */
  desc: {},

  /* ---排行榜模块--------------------------------------------------- */
  toplist: [],

  /* ---搜索模块--------------------------------------------------- */
  searchHistory: loadSearch(), // 进入应用的时候获取缓存

  /* ---播放模块--------------------------------------------------- */
  playHistory: loadPlay(),

  //喜欢的音乐列表
  favoriteList: loadFavorite(),
  // 搜索框有值 | 获得焦点
  inputActive: false
};

export default state;

/*

  第一步设置 底层数据 ==> state 
  第二步设置 简单代理 ==> getter
  第三步设置 mutation名字 ==> mutation-types
  第四步设置 mutation创建 ==> mutation

*/
