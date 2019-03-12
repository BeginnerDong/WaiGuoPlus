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
		urlSet:[],
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
				if(self.data.originData.user_no==wx.getStorageSync('info').user_no){
					self.data.originData.isMe = true
				};
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
      comment:{
        tableName:'Message',
        middleKey:'id',
        key:'reply_id',
        searchItem:{
          status:1,
          type:6
        },
        condition:'='
      },
    };

    const callback =(res)=>{
      if(res.info.data.length>0){
				for (var i = 0; i < res.info.data.length; i++) {
					if (res.info.data[i].user_no == wx.getStorageSync('info').user_no) {
						res.info.data[i].isMe = true;
					};
					
				};	
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.total = res.info.total;
				
      }else{
         self.data.isLoadAll = true;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
        web_total:self.data.total,
      });
    };
    api.messageGet(postData,callback);
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
	
	previewImage(e) {
		const self = this;
		self.data.urlSet = [];
		var index = api.getDataSet(e, 'index');
		var imgIndex = api.getDataSet(e, 'id');
		console.log('index', index)
		console.log('imgIndex', imgIndex)
		console.log(self.data.mainData[index].mainImg[0])
		for (var i = 0; i < self.data.mainData[index].mainImg.length; i++) {
			self.data.urlSet.push(self.data.mainData[index].mainImg[i].url);
		};
		wx.previewImage({
			current: self.data.mainData[index].mainImg[imgIndex].url, // 当前显示图片的http链接
			urls: self.data.urlSet // 需要预览的图片http链接列表
		})
	},
  
  clickGood(e){
    const self = this;
    api.buttonCanClick(self);
    var index = api.getDataSet(e,'index');
    var item = self.data.mainData[index];

    if(item.goodMe.length==0){
      self.addLog(index)
    }else{
      self.updateLog(index)
    };
  },

  addLog(index){
    const self = this;
    var item = self.data.mainData[index];
    const postData ={};
    postData.data= {
      type:4,
      title:'点赞成功',
			
      order_no:self.data.mainData[index].id,
      pay_no:self.data.mainData[index].user_no,
    };
    postData.saveAfter = [
      {
        tableName:'Message',
        FuncName:'add',
        data:{
          relation_id:self.data.mainData[index].id,
          type:7,
					thirdapp_id:2,
          title:'点赞',
          relation_user:self.data.mainData[index].user_no,
					user_no:wx.getStorageSync('info').user_no
        }
      }
    ];
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      if(res.solely_code==100000){
        self.data.mainData[index].goodMe.push({
          status:1,
          id:res.info.id
        });
        self.data.mainData[index].goodDataNum.num += 1;
      }else{
        api.showToast('点赞失败','none',1000)
      };
      api.buttonCanClick(self,true);
      self.setData({
        web_mainData:self.data.mainData
      });
    };
    api.logAdd(postData,callback);
  },


  updateLog(index){
    const self = this;
    var item = api.cloneForm(self.data.mainData[index]);
    const postData ={
      searchItem:{
        id:item.goodMe[0].id
      },
      data:{
        status:-item.goodMe[0].status
      }
    };
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      if(res.solely_code==100000){
        console.log('item.goodMe[0].status',item.goodMe[0].status);
        self.data.mainData[index].goodMe[0].status = -item.goodMe[0].status;
        self.data.mainData[index].goodDataNum.num -= item.goodMe[0].status;
      }else{
        api.showToast('点赞失败','none',1000)
      };
      api.buttonCanClick(self,true);
      self.setData({
        web_mainData:self.data.mainData
      })
      
    };
    api.logUpdate(postData,callback);
  },
	
	messageUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.id
		};
		postData.data = {
			status:-1
		};
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.showToast('刪除成功', 'none', 1000, function() {
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
	
	choose(){
	  const self =this;
	  self.is_choose = true;
	  self.menu_show = false;
	  this.setData({
	    is_choose:self.is_choose,
	    menu_show:self.menu_show
	  })
	},
	
	onReachBottom() {
	  const self = this;
	  if(!self.data.isLoadAll&&self.data.buttonCanClick){
	    self.data.paginate.currentPage++;
	    self.getMainData();
	  };
	},
	
	choose_close(){
	  const self =this;
	  self.is_choose = false;
	  self.setData({
	    is_choose:self.is_choose
	  })
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

  

  