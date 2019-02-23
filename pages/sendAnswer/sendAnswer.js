import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {

    submitData:{
      content:'',
      type:1
    }, 
    isFirstLoadAllStandard:['getLocation']

  },



  onLoad(options) {
  	const self = this;
  	api.commonInit(self);
  	if(options.id){
  			self.data.id = options.id;
  			self.getMainData();
  	};
  	self.setData({
  		web_submitData: self.data.submitData
  	});
  	
  	self.getLocation()
  },
  
  
  getMainData() {
  	const self = this;
  	const postData = {};
		postData.searchItem = {
			id:self.data.id
		};
  	postData.tokenFuncName = 'getProjectToken';
  	const callback = (res) => {
  		if (res.info.data.length > 0) {
  			self.data.submitData.title = res.info.data[0].title;
  			self.data.submitData.content = res.info.data[0].content;
  			self.data.submitData.video = res.info.data[0].video;
  			/* 		self.data.submitData.country = res.info.data[0].country; 
  					self.data.submitData.city = res.info.data[0].city; */
  		};
  		self.data.mainData = res.info.data[0];
  		self.setData({
  			web_mainData: self.data.mainData,
  			web_submitData: self.data.submitData,
  		});
  	};
  	api.messageGet(postData, callback);
  },
  
  submit() {
  	const self = this;
  	api.buttonCanClick(self);
  	const pass = api.checkComplete(self.data.submitData);
  	console.log('pass', pass);
  	if (pass) {
  		const callback = (user, res) => {
  			if (self.data.id) {
  				self.messageUpdate()
  			} else {
  				self.messageAdd();
  			}
  		}
  		api.getAuthSetting(callback);
  	} else {
  		api.showToast('请补全信息', 'none')
  		api.buttonCanClick(self, true)
  	};
  },
  
  messageUpdate() {
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName = 'getProjectToken';
  	postData.searchItem = {
  		id: self.data.id
  	};
  	postData.data = {};
  	postData.data = api.cloneForm(self.data.submitData);
  	const callback = (data) => {
  		if (data.solely_code == 100000) {
  			api.showToast('編輯成功', 'none', 1000, function() {
  				setTimeout(function() {
  					wx.navigateBack({
  						delta: 1
  					})
  				}, 1000);
  			})
  		} else {
  			api.showToast(data.msg, 'none', 1000)
  		}
  		api.buttonCanClick(self, true)
  	};
  	api.messageUpdate(postData, callback);
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


  getLocation(){
    const self=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        
        console.log(res)
      }
    });
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



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  