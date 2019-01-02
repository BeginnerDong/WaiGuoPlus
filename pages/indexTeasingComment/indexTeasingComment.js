import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false
  },
  onLoad(options) {
    const self = this;

  },
  show_all(){
     const self = this;
     self.is_show = !self.is_show;
     this.setData({
      is_show:self.is_show
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

  