import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    isFirstLoadAllStandard:['getMainData'],
    mainData:[],

  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    
  },
  

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.tokenFuncName = 'getProjectToken';
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:6,
      user_no:wx.getStorageSync('info').user_no
    };
    postData.getAfter = {
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
      original:{
        tableName:'Message',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
          type:['in',[1,2,3,4,5,6]]
        },
        condition:'=',
      },
      comment:{
        tableName:'Message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1,
          type:6
        },
        condition:'='
      },
    };
    const callback =(res)=>{
			api.buttonCanClick(self,true);
      if(res.info.data.length>0){
        
        for (var i = 0; i < res.info.data.length; i++) {
          var time = api.timeToTimestamp(res.info.data[i].create_time)
         
          res.info.data[i].create_time = api.getDateDiff(time)
  
        }
				self.data.mainData.push.apply(self.data.mainData,res.info.data);
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
	
	delete(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		const postData = {};
		postData.tokenFuncName='getProjectToken';
		postData.searchItem = {
			id:self.data.mainData[index].id
		};
		postData.data = {
			status:-1
		};
		const callback = (res) =>{
			if(res.solely_code==100000){
				api.showToast('删除成功','none');
				self.getMainData(true)
			}else{
				api.showToast(res.msg,'none')
			}
		}
		api.messageUpdate(postData,callback)
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
					thirdapp_id:2,
          type:7,
					user_no:wx.getStorageSync('info').user_no,
          title:'点赞',
          relation_user:self.data.mainData[index].user_no
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


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    var type = api.getDataSet(e,'type');
    var id = api.getDataSet(e,'id');
    console.log
    if(type==1){
    	wx.navigateTo({
	  		url:'/pages/indexAnswerDetail/indexAnswerDetail?id='+id
	  	});
    }else if(type==2){
    	wx.navigateTo({
	  		url:'/pages/indexDetail/indexDetail?id='+id
	  	});
    }else if(type==3){
    	wx.navigateTo({
	  		url:'/pages/indexTeasingDetail/indexTeasingDetail?id='+id
	  	});
    }else if(type==4){
    	wx.navigateTo({
	  		url:'/pages/indexVideoDetail/indexVideoDetail?id='+id
	  	});
    };

  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})

  