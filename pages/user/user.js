import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({

  data: {
     menu_show:false,
    is_choose:false,
    mainData:[],
		noticeData:[],
    isFirstLoadAllStandard:['userInfoGet','getMainData'],
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);  
    self.userInfoGet();
    self.getMainData();
		self.getNoticeData()
  },

  getMainData(isNew){
    const self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.tokenFuncName = 'getProjectToken';
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:['in',[1,2,3,4]],
      user_no:wx.getStorageSync('info').user_no
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
	
	getNoticeData(){
	  const  self =this;
	  const postData={};
	  postData.tokenFuncName = 'getProjectToken';
		postData.searchItem={
			relation_user:wx.getStorageSync('info').user_no,
			type:['in',[7]]
		};
	
	  const callback =(res)=>{
	    if(res.info.data.length>0){
	      self.data.noticeData.push.apply(self.data.noticeData,res.info.data);
	    }
	    self.setData({
	      web_noticeData:self.data.noticeData,
	    });
	  };
	  api.messageGet(postData,callback);
	},

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
      self.setData({
        web_userData:self.data.userData,
      });
      
    };
    api.userGet(postData,callback);
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  