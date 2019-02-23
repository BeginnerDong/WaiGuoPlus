import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    isFirstLoadAllStandard:['getOriginData','getMainData'],
    submitData:{
    	content:'',
    	type:6
    },
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
      },
      goodDataNum:{
        tableName:'Log',
        middleKey:'id',
        key:'order_no',
        searchItem:{
          status:1,
          type:4
        },
        condition:'=',
        compute:{
          num:['count','count',{status:1}]
        }
      },
      goodMe:{
        tableName:'Log',
        middleKey:'id',
        key:'order_no',
        searchItem:{
          status:['in',[-1,1]],
          type:4,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'='
      },
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
      reply_id:self.data.id,
      type:6
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

    };

    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.total = res.info.total;
        self.setData({
          web_total:self.data.total,
        });
      }else{
      	self.data.isLoadAll = true;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
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
    if(self.data.submitData.content==''){
    	api.showToast('不能发空评论','none')
    	return;
    };
    self.messageAdd()
    console.log(self.data.submitData)
  },

  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    /*if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
      postData.refreshToken = true;
    };*/
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.relation_id = self.data.originData.relation_id;
    postData.data.reply_id = self.data.id;
    const callback = (data)=>{
      if(data.solely_code==100000){
      	self.data.submitData.content = '';
		self.setData({
			web_submitData:self.data.submitData
		});
        self.getMainData(true)
      /*  api.showToast('发布成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) */
      }else{
        api.showToast(data.msg,'none',1000)
      }
      api.buttonCanClick(self,true)
    };
    api.messageAdd(postData,callback);
  },

	onShareAppMessage(res){
	  const self = this;
		
	  if(self.data.buttonClicked){
	    api.showToast('数据有误请稍等','none');
	    setTimeout(function(){
	      wx.showLoading();
	    },800)   
	    return;
	  };
	   console.log(res)
		 var id = res.target.dataset.id;
		 var type = res.target.dataset.type;
	    if(res.from == 'button'){
	      self.data.shareBtn = true;
	    }else{   
	      self.data.shareBtn = false;
	    }
	    return {
	      title: '歪果plus',
	      path: 'pages/index/index?id='+id+'&&type='+type,
	      success: function (res){
	        console.log(res);
	        console.log(parentNo)
	        if(res.errMsg == 'shareAppMessage:ok'){
	          console.log('分享成功')
	          if (self.data.shareBtn){
	            if(res.hasOwnProperty('shareTickets')){
	            console.log(res.shareTickets[0]);
	              self.data.isshare = 1;
	            }else{
	              self.data.isshare = 0;
	            }
	          }
	        }else{
	          wx.showToast({
	            title: '分享失败',
	          })
	          self.data.isshare = 0;
	        }
	      },
	      fail: function(res) {
	        console.log(res)
	      }
	    }
	},

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  