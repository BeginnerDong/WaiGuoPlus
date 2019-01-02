import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    
  },
  onLoad(options) {
    const self = this;

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

  