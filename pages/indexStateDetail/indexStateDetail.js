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
    isFirstLoadAllStandard:['getMainData']
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMainData()
  },

  getMainData(){
    const  self =this;
    const postData={};
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id,
      user_type:0
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData=res.info.data[0]
      }else{
        api.showToast('数据错误','none',1000);
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
  },


  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.relation_id = self.data.id;
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('评论成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) 
      }else{
        api.showToast(data.msg,'none',1000)
      }
      api.buttonCanClick(self,true)
    };
    api.messageAdd(postData,callback);
  },

  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.submitData[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'submitData');
    };
    self.setData({
      web_submitData:self.data.submitData,
    }); 
    console.log(self.data.submitData)
  },



  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    console.log('pass',pass);
    if(pass){  
        const callback = (user,res) =>{
          self.messageAdd();
        } 
       api.getAuthSetting(callback);   
    }else{
      api.showToast('不能发空评论','none')
      api.buttonCanClick(self,true) 
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

  

  