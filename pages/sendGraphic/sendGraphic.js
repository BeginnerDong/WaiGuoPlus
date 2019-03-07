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
  			self.data.submitData.mainImg = res.info.data[0].mainImg;
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
			;
  		api.showToast('请补全信息', 'none')
  		
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
			api.buttonCanClick(self, true)
  		if (data.solely_code == 100000) {
  			api.showToast('编辑成功', 'none', 1000, function() {
  				setTimeout(function() {
  					wx.navigateBack({
  						delta: 1
  					})
  				}, 1000);
  			})
  		} else {
  			api.showToast(data.msg, 'none', 1000)
  		}
  		
  	};
  	api.messageUpdate(postData, callback);
  },
  
  delete(e) {
  	const self = this;
  	var index = api.getDataSet(e, 'index');
  	console.log('deleteImg', index)
  	self.data.submitData.mainImg.splice(index, 1);
  	self.setData({
  		web_submitData: self.data.submitData
  	})
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
      console.log('getLocation',res)
      if(res){
        self.data.submitData.country = res.address_component.nation;
        if(res.address_component.ad_level_1){
          self.data.submitData.city = res.address_component.ad_level_1;
        }else if(res.address_component.city){
          self.data.submitData.city = res.address_component.city;
        }else{
          self.data.submitData.city = '未定位到城市';
        };
        
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
			 api.buttonCanClick(self,true);
      api.showToast('请补全信息','none')
     
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
      title: '',
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
      count:3,
      success: function(res) {
        console.log(res);
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


  upLoadVideo(){
    const self = this;
    wx.showLoading({
      mask: true,
      title: '',
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

  