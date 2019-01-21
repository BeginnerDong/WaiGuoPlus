import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    currentType:1,
    menu_show:false,
    is_choose:false,
    is_more:false,
    isFirstLoadAllStandard:['getMainData'],
    mainData:[],
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
  },

  onShow(){
    const self = this;
    self.init();

  },

  init(){
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.setData({
      web_currentType:self.data.currentType
    })
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
      type:self.data.currentType,
      user_type:0
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
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
  },

  getAnswerData(index){
    const self = this;
    const postData = {
      tokenFuncName:'getProjectToken',
      searchItem:{
        relation_id:self.data.mainData[index].id,
        type:5,
        user_type:0
      },
      getAfter:{
        answerUser:{
          tableName:'User',
          middleKey:'user_no',
          key:'user_no',
          searchItem:{
            status:1,
          },
          condition:'='
        },
      }
    };
    const callback = (res) =>{
      if(res.info.data.length>0){
        self.data.mainData[index].answerData = res.info.data;
        self.data.mainData[index].isShowAnswer = true;
      }else{
        api.showToast('没有更多了','none')
      };
      self.setData({
        web_mainData:self.data.mainData
      })
    };
    api.messageGet(postData,callback);
  },


  changeType(e){
    const self = this;
    api.buttonCanClick(self);
    var type = api.getDataSet(e,'type');
    if(type!=self.data.currentType){
      self.data.currentType = type;
      self.getMainData(true);
      self.setData({
        web_currentType:self.data.currentType
      })
    }; 
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

  menu(){
    const self =this;
    self.menu_show = !self.menu_show;
    this.setData({
      menu_show:self.menu_show
    })
  }, 

  close(){
     const self =this;
    self.menu_show = false;
    this.setData({
      menu_show:self.menu_show
    })
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
  /*******展示更多评论*********/
  show_more(e){
    const self =this;
    const index = api.getDataSet(e,'index');
    
    if(self.data.mainData[index].answerData){
      self.data.mainData[index].isShowAnswer = self.data.mainData[index].isShowAnswer?!self.data.mainData[index].isShowAnswer:true;
      console.log(self.data.mainData[index].isShowAnswer);
      self.setData({
        web_mainData:self.data.mainData
      })
    }else{
      self.getAnswerData(index);
    };
    console.log('self.data.mainData',self.data.mainData);  
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

  