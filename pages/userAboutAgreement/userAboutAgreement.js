import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({

  data: {
    isFirstLoadAllStandard:['getMainData']
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData();
  },

  getMainData(){
    const self= this;
    const postData = {};
    postData.searchItem ={
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore ={
     caseData:{
        tableName:'Label',
        searchItem:{
          title:['=',['用户使用协议']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.mainData = {};
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.mainData);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
  },


})

  