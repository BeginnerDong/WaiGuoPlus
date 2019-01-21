import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    isFirstLoadAllStandard:['getMainData'],
    mainData:[],

  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    
  },
  

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.tokenFuncName = 'getProjectToken';
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:5,
      user_no:wx.getStorageSync('info').user_no
    };
    postData.getAfter = {
      goodData:{
        tableName:'Log',
        middleKey:'id',
        key:'order_no',
        searchItem:{
          status:1,
          type:4
        },
        condition:'=',
      },
      quesition:{
        tableName:'Message',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
          type:1
        },
        condition:'=',
      },
      comment:{
        tableName:'Message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1,
          type:6
        },
        condition:'='
      },
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  