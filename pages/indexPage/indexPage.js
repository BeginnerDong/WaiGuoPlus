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
    if(options.id){
      self.data.id = options.id
    }else{
      api.showToast('数据传递有误','error',2000,function(){
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },2000)
      })
    }
    
    self.userInfoGet();

  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {
      id:self.data.id
    }
    postData.getAfter = {
      people:{
        tableName:'User',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      },
      goodDataNum:{
        tableName:'Log',
        middleKey:'user_no',
        key:'pay_no',
        searchItem:{
          status:1,
          type:4,
        },
        condition:'=',
        compute:{
          num:['count','count',{status:1}]
        }
      },
      followDataNum:{
        tableName:'Log',
        middleKey:'user_no',
        key:'pay_no',
        searchItem:{
          status:1,
          type:5,
        },
        condition:'=',
        compute:{
          num:['count','count',{status:1}]
        }
      },
      AnswerDataNum:{
        tableName:'Message',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1,
          type:5,
        },
        condition:'=',
        compute:{
          num:['count','count',{status:1}]
        }
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
      self.setData({
        web_mainData:self.data.mainData,
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

  