
const baseUrl = 'http://www.lurenji.xyz:4040'

export const API = {
  RECOMMEND: {
    // 推荐轮播图
    BANNER: baseUrl + '/banner',
    // 推荐歌单
    DISCLIST: baseUrl + '/personalized',
    // 获取推荐歌单详情列表(id)
    DISCLIST_SONGS: baseUrl + '/playlist/detail'
  },
  SINGER: {
    // 获取歌手列表(只获取华语男女歌手)
    // 华语男歌手
    MAN_LIST: baseUrl + '/artist/list?cat=1001',
    // 华语女歌手
    WOMEN_LIST: baseUrl + '/artist/list?cat=1002',
    // 获取热门歌手(10个)
    HOST_LIST: baseUrl + '/top/artists?limit=10',
    // 根据id获取歌手单曲
    SONG_LIST: baseUrl + '/artists'
    // 根据id获取音乐url,可多个
  },
  PLAYER: {
    PIC_IMAGE: baseUrl + '/song/detail',
    SONG_URL: baseUrl + '/song/url',
    // 根据id获取音乐歌词
    SONG_LYRIC: baseUrl + '/lyric',
    // 音乐url是否可用
    SONG_CAN_USE: baseUrl + '/check/music'
  },
  RANK: {
    // 排行榜列表
    DISCLIST: baseUrl + '/toplist/detail',
    // 排行榜对应歌曲列表
    DISCLIST_SONGS: baseUrl + '/top/list'
  },
  SEARCH: {
    // 热搜简略
    HOST_SEARCH: baseUrl + '/search/hot',
    // 热搜详情
    HOST_SEARCH_DETAIL: baseUrl + '/search/hot/detail',
    // 关键词搜索
    KEY_SEARCH: baseUrl + '/search'
  }
};

// 错误码--------------------------------------------------------------
export const ERR_OK = 200;
