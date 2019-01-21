import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();



Page({
  data: {
    is_choose:'',
    submitData:{
      title:'',
      content:'',
      mainImg:[],
      type:2,
      country:'',
      city:''
    }, 
    isFirstLoadAllStandard:['getLocation']

  },



  onLoad() {
    const self = this;
    api.commonInit(self);
    self.setData({
      web_submitData:self.data.submitData
    });
    self.getLocation()
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

  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
      postData.refreshToken = true;
    };
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
      if(data.solely_code==100000){
        
        api.showToast('发布成功','none',1000,function(){
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


  getLocation() {
    const self = this;
    const callback = (res)=>{
      if(res){
        self.data.submitData.country = res.address_component.nation;
        self.data.submitData.city = res.address_component.city
      };
      self.setData({
        web_submitData:self.data.submitData
      })
    };
    api.getLocation('reverseGeocoder',callback);
    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLocation',self)
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
      api.showToast('请补全信息','none')
      api.buttonCanClick(self,true) 
    };
  },

  upLoadImg(){
    const self = this;
    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    const callback = (res)=>{
      console.log('res',res)
      if(res.solely_code==100000){
        self.data.submitData.mainImg.push({url:res.info.url})
        self.setData({
          web_submitData:self.data.submitData
        });
        wx.hideLoading()  
      }else{
        api.showToast('网络故障','none')
      }
    };
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        console.log(callback)
        api.uploadFile(tempFilePaths[0],'file',{tokenFuncName:'getProjectToken'},callback)
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },


  upLoadVideo(){
    const self = this;
    wx.showLoading({
      mask: true,
      title: '视频上传中',
    });
    const callback = (res)=>{
      console.log('res',res)
      if(res.solely_code==100000){
        wx.hideLoading()  
      }else{
        api.showToast('网络故障','none')
      }
    };
    wx.chooseVideo({
      success: function(res) { 
        console.log(res);
        var src = res.tempFilePath;
        console.log(callback)
        api.uploadFile(src,'file',{tokenFuncName:'getProjectToken'},callback)
      },
      fail: function(err){
        wx.hideLoading();
      }
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

  