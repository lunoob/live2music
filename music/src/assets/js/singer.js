export default class Singer {
  /*
  function constructor 构造函数
    @param id String | Number 歌手id
    @param name String 歌手名字
    @param avatar String 歌手头像
  */
  constructor({ id, name, avatar }) {
    this.id = id;
    this.name = name;
    this.avatar = avatar + '?param=300y300';
  }
}
