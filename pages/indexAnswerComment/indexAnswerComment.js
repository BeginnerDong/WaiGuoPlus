import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    isFirstLoadAllStandard:['getOriginData','getMainData']
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    if(self.data.id){
      self.getOriginData();
    }else{
      api.showToast('数据传递有误','error',2000,function(){
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },2000)
      })
    };
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getOriginData',self);
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
        self.setData({
          web_total:self.data.total,
        });
      }else{
        api.showToast('没有评论','none',1000);
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
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

  