class Song {
  /*
  function constructor 构造函数
    @param id String | Number 歌曲id
    @param mid String | Number 不清楚
    @param singer String 歌手名字[可能是多个, 用/划分 ==> 周杰伦/蔡依林]
    @param name String  歌曲名字
    @param album String 专辑名字
    @param duration String | Number 播放时长
    @param image String 歌曲图片地址
    @param url String 歌曲播放地址
  */
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

/**
 * 过滤歌手名字
 * @date 2020-03-27
 * @param {Array} name 歌手名字列表
 * @returns {any}
 */
function filterSingerName(name) {
  // 如果是数组
  if (typeof name === 'string') {
    return name;
  }
  if (typeof name === 'object' || name.length > 0) {
    if (name.length > 3) {
      return '群星';
    }
    let nameArr = name.map(item => {
      return item.name;
    });
    return nameArr.join('/');
  }
}

/**
 * Song类的对象工厂函数
 * @date 2020-03-27
 * @returns {Song}
 */
export function NewSong(arg) {
  return new Song({
    ...arg,
    singer: filterSingerName(arg.singer)
  });
}
