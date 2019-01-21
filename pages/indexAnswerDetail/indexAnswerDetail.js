import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {

    submitData:{

      content:'',
      mainImg:[],
      type:5
    }, 
    isFirstLoadAllStandard:['getMainData'],
    originData:{}
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getOriginData()
  },

  getOriginData(){
    const  self =this;
    const postData={};
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id,
    };
    postData.getAfter = {
      user:{
        tableName:'User',
        middleKey:'user_no',
        key:'user_no',
        condition:'=',
        searchItem:{
          status:1
        },
        info:['headImgUrl','nickname']
      }
    };

    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.originData=res.info.data[0];
        self.getMainData();
      }else{
        api.showToast('数据错误','none',1000);
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_originData:self.data.originData,
      });
    };
    api.messageGet(postData,callback);

  },

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      relation_id:self.data.id,
      type:5
    };
    postData.getAfter = {
      user:{
        tableName:'User',
        middleKey:'user_no',
        key:'user_no',
        condition:'=',
        searchItem:{
          status:1
        },
        info:['headImgUrl','nickname']
      },
      remarkData:{
        tableName:'Message',
        middleKey:'id',
        key:'relation_id',
        condition:'=',
        searchItem:{
          status:1,
          type:6
        },
      },
      goodData:{
        tableName:'Log',
        middleKey:'id',
        key:'order_no',
        condition:'=',
        searchItem:{
          status:1,
          type:4
        },
      },
    };

    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.total = res.info.total;

      }else{
        api.showToast('数据错误','none',1000);
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
        web_total:self.data.total,
      });
    };
    api.messageGet(postData,callback);
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

  

  