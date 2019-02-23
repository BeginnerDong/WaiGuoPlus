import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
   
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;

  },

  userInfoUpdate(e){
    const self = this;
		var behavior = api.getDataSet(e,'id');
    const postData = {};
    postData.tokenFuncName = 'getProjectToken';
    postData.data = {
			behavior:behavior
		};
    const callback = (data)=>{
  		api.buttonCanClick(self,true);
      if(data.solely_code==100000){
        setTimeout(function(){
          api.pathTo('/pages/index/index','rela')
        },1000);
      }else{
        api.showToast('网络故障','none')
      };
      
    };
    api.userInfoUpdate(postData,callback);
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

  