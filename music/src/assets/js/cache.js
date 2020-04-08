import storage from 'good-storage';

// 存储的key
const SEARCH_KEY = '__SEARCH__';
// 存储历史的长度，maxlen ==> 15
const SEARCH_MAX_LEN = 15;

// 播放历史key
const PLAY_KEY = '__PLAY__';
const PLAY_MAX_LEN = 200;

// 喜欢的音乐key
const FAVORITE_KEY = '__FAVORITE__';
const FAVORITE_MAX_LEN = 200;

/**
 * 往数组中插入数据, 有重复项自动剔除
 * @date 2020-03-28
 * @param {Array} arr 目标数组
 * @param {any} query  插入的值
 * @param {Function} compare
 * @param {Number} max_len
 * @returns {void}
 */
const insertArray = (arr, query, compare, max_len) => {
  let fIndex = arr.findIndex(compare);
  // 首位
  if (fIndex === 0) {
    return;
  } else if (fIndex > 0) {
    // 先删除，再增加
    arr.splice(fIndex, 1);
  }
  arr.unshift(query);
  // 存在最大限制，并超出
  if (max_len && arr.length > max_len) {
    arr.pop();
  }
};

/**
 * 检索数组中是否含有item, 有则删除
 * @date 2020-03-29
 * @param {Array} arr
 * @param {Function} compare
 * @returns {void}
 */
const deleteArray = (arr, compare) => {
  let fIndex = arr.findIndex(compare);
  // 如果含有值
  if (fIndex > -1) {
    arr.splice(fIndex, 1);
  }
};

// ------------------------------------------------------------------------------------

/**
 * 保存搜索历史
 * @date 2020-03-28
 * @param {String} query
 * @returns {Array}
 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(
    searches,
    query,
    item => {
      return item === query;
    },
    SEARCH_MAX_LEN
  );
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 获取搜索历史
 * @date 2020-03-28
 * @returns {Array}
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

/**
 * 删除搜索历史项
 * @date 2020-03-29
 * @param {String} query
 * @returns {Array}
 */
export function deleteSearch(query) {
  // 获取历史列表
  let searches = storage.get(SEARCH_KEY, []);
  // 删除历史列表中的query
  deleteArray(searches, item => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 清空搜索历史列表
 * @date 2020-03-29
 * @returns {Array}
 */
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

// ------------------------------------------------------------------------------------

/**
 * 新增播放历史（单项）
 * @date 2020-03-30
 * @param {Song} song
 * @returns {Array}
 */
export function savePlay(song) {
  let playHistory = storage.get(PLAY_KEY, []);
  insertArray(
    playHistory,
    song,
    item => {
      return item.id === song.id;
    },
    PLAY_MAX_LEN
  );
  storage.set(PLAY_KEY, playHistory);
  return playHistory;
}

/**
 * 删除播放历史（单项）
 * @date 2020-03-30
 * @param {Song} song
 * @returns {Array}
 */
export function deletePlay(song) {
  let playHistory = storage.get(PLAY_KEY, []);
  deleteArray(playHistory, item => {
    return item.id === song.id;
  });
  storage.set(PLAY_KEY, playHistory);
  return playHistory;
}

/**
 * 获取播放历史
 * @date 2020-03-30
 * @returns {Array}
 */
export function loadPlay() {
  let playHistory = storage.get(PLAY_KEY, []);
  return playHistory;
}

// ------------------------------------------------------------------------------------

/**
 * 新增喜欢的音乐
 * @date 2020-03-31
 * @param {Song} song
 * @returns {Array}
 */
export function saveFavoriate(song) {
  let Favorites = storage.get(FAVORITE_KEY, []);
  insertArray(
    Favorites,
    song,
    item => {
      return item.id === song.id;
    },
    FAVORITE_MAX_LEN
  );
  storage.set(FAVORITE_KEY, Favorites);
  return Favorites;
}

/**
 * 删除喜欢的音乐
 * @date 2020-03-31
 * @param {Song} song
 * @returns {Array}
 */
export function deleteFavorite(song) {
  let Favorites = storage.get(FAVORITE_KEY, []);
  deleteArray(Favorites, item => {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY, Favorites);
  return Favorites;
}

/**
 * 加载喜欢的音乐列表
 * @date 2020-03-31
 * @returns {Array}
 */
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
