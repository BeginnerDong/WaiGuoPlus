import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		mainData: [],
		isFirstLoadAllStandard: ['userInfoGet', 'checkFollow', 'getMainData'],
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		if (options.id) {
			self.data.id = options.id
		} else {
			api.showToast('数据传递有误', 'error', 2000, function() {
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 2000)
			})
		}
		self.setData({
			web_id:self.data.id
		});
		self.userInfoGet();

	},

	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.id
		}
		postData.getAfter = {
			people: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			},
			goodDataNum: {
				tableName: 'Log',
				middleKey: 'user_no',
				key: 'pay_no',
				searchItem: {
					status: 1,
					type: 4,
				},
				condition: '=',
				compute: {
					num: ['count', 'count', {
						status: 1,
						type: 4,
					}]
				}
			},
			followDataNum: {
				tableName: 'Log',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1,
					type: 5,
				},
				condition: '=',
				compute: {
					num: ['count', 'count', {
						status: 1,
						type: 5,
					}]
				}
			},
			AnswerDataNum: {
				tableName: 'Message',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1,
					type: 5,
				},
				condition: '=',
				compute: {
					num: ['count', 'count', {
						status: 1,
						type:5
					}]
				}
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.userData = res.info.data[0];
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'userInfoGet', self);
			self.setData({
				web_userData: self.data.userData,
			});
			self.checkFollow();
			self.getMainData();
		};
		api.messageGet(postData, callback);
	},

	follow() {
		const self = this;
		api.buttonCanClick(self);
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.data = {
			type: 5,
			pay_no: self.data.userData.people[0].user_no
		};
		/* postData.saveAfter = [
      {
        tableName:'Message',
        FuncName:'add',
        data:{
					thirdapp_id:2,
					user_no:wx.getStorageSync('info').user_no,
          type:7,
          title:'关注',
          relation_user:self.data.userData.people[0].user_no
        }
      }
    ]; */
		const callback = (data) => {
			api.buttonCanClick(self, true)
			if (data.solely_code == 100000) {
				api.showToast('关注成功', 'none');
				self.checkFollow();
			} else {
				api.showToast(data.msg, 'none', 1000)
			};


		};
		api.logAdd(postData, callback);
	},

	unFollow() {
		const self = this;
		api.buttonCanClick(self);
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.checkFollowData[0].id
		};
		postData.data = {
			status: -1
		};
		/* postData.saveAfter = [
      {
        tableName:'Message',
        FuncName:'add',
        data:{
					thirdapp_id:2,
          type:7,
					user_no:wx.getStorageSync('info').user_no,
          title:'取消关注',
          relation_user:self.data.userData.people[0].user_no
        }
      }
    ]; */
		const callback = (data) => {
			api.buttonCanClick(self, true)
			if (data.solely_code == 100000) {
				api.showToast('已取消', 'none');
				self.checkFollow();
			} else {
				api.showToast(data.msg, 'none', 1000)
			};


		};
		api.logUpdate(postData, callback);
	},

	checkFollow() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('info').user_no,
			type: 5,
			pay_no: self.data.userData.people[0].user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.checkFollowData = res.info.data
			} else {
				self.data.checkFollowData = []
			}
			console.log('self.data.checkFollowData', self.data.checkFollowData)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'checkFollow', self);

			self.setData({
				web_checkFollowData: self.data.checkFollowData
			})
		};
		api.logGet(postData, callback);
	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			type: ['in', [1, 2, 4]],
			user_no: self.data.userData.people[0].user_no,
			user_type: 0
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			api.buttonCanClick(self, true);
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.messageGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},
	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
