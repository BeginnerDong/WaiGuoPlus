import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    currentId:1,
    menu_show:false,
    is_choose:false,
    is_more:false,
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;

  },
  tab(e){
   this.setData({
      currentId:e.currentTarget.dataset.id
    })
  },
  menu(){
    const self =this;
    self.menu_show = !self.menu_show;
    this.setData({
      menu_show:self.menu_show
    })
  }, 
  close(){
     const self =this;
    self.menu_show = false;
    this.setData({
      menu_show:self.menu_show
    })
  },
  choose(){
     const self =this;
    self.is_choose = true;
    self.menu_show = false;
    this.setData({
      is_choose:self.is_choose,
      menu_show:self.menu_show
    })
  },
  choose_close(){
     const self =this;
    self.is_choose = false;
    this.setData({
      is_choose:self.is_choose
    })
  },
  /*******展示更多评论*********/
  show_more(){
    const self =this;
    self.is_more = !self.is_more;
    this.setData({
      is_more:self.is_more
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  