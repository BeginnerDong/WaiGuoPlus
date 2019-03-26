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
		isOpen:false,
		className:'avoidOverflow2',
    isFirstLoadAllStandard:['getMainData']
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
		self.setData({
			web_className:self.data.className,
			web_submitData:self.data.submitData
		})
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
		if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
		  postData.refreshToken = true;
		};
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.relation_id = self.data.id;
    const callback = (data)=>{
			api.buttonCanClick(self,true);
      if(data.solely_code==100000){
        api.showToast('回答成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) 
      }else{
        api.showToast(data.msg,'none',1000)
      }
      
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
	
	open(){
		const self = this;
		self.data.isOpen = !self.data.isOpen;
		if(!self.data.isOpen){
			self.data.className = 'avoidOverflow2'
		}else{
			self.data.className = ''
		};
		self.setData({
			web_isOpen:self.data.isOpen,
			web_className:self.data.className
		})
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
      count:3-self.data.submitData.mainImg.length,
      success: function(res) {
        console.log(res);
				console.log(self.data.submitData);
        var tempFilePaths = res.tempFilePaths;
        console.log(callback)
        for (var i = 0; i < tempFilePaths.length; i++) {
        	api.uploadFile(tempFilePaths[i],'file',{tokenFuncName:'getProjectToken'},callback)
        }
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
		var newObject = api.cloneForm(self.data.submitData);
		
		delete newObject.mainImg;
    const pass = api.checkComplete(self.data.newObject);
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})

  