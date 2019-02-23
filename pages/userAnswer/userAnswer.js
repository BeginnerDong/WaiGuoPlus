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
      type:5,
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
      quesition:{
        tableName:'Message',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
          type:1
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
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        for (var i = 0; i < self.data.mainData.length; i++) {
          var time = api.timeToTimestamp(self.data.mainData[i].create_time)
         
          self.data.mainData[i].create_time = api.getDateDiff(time)
           console.log(self.data.mainData[i].create_time)
        }
      }else{
        self.data.isLoadAll = true;
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
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
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})

  