import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    isFirstLoadAllStandard:['userInfoGet'],
  },
  onLoad(options) {
    const self = this;
    api.commonInit(self);  
    self.userInfoGet();

  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
      
    };
    api.userGet(postData,callback);
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

  