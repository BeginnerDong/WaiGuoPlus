import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
      mainData:[],
      isFirstLoadAllStandard:['getMainData'],
			anonymousData:[]
  },
	
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    if(options.item){
      self.data.item = options.item
    };
    self.getMainData();
		
  },
	
/* 	getAnonymousData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.anonymousData.push.apply(self.data.anonymousData, res.info.data)
			};
			self.setData({
				web_anonymousData: self.data.anonymousData
			}))
		};
		api.anonymousGet(postData, callback);
	}, */

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
      user_type:0,
      type:['in',[1,2,3,4]],
      content:['LIKE',['%'+self.data.item+'%']]
    };
    postData.getAfter = {
      user:{
        tableName:'User',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      },
      answer:{
        tableName:'Message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1,
          type:5
        },
        condition:'='
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
        key:'relation_id',
        searchItem:{
          status:1,
          type:6
        },
        condition:'='
      },
			anonymous: {
				tableName: 'Anonymous',
				middleKey: 'keywords',
				key: 'id',
				condition: '=',
				searchItem: {
					status: 1
				},
			
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

  