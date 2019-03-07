import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
	data: {
		is_show: false,
		isFirstLoadAllStandard: ['getOriginData', 'getMainData'],
		submitData: {
			content: '',
			type: 6,
			keywords: ''
		},
		anonymousData: []
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		if (self.data.id) {
			self.getAnonymousData();
			self.getOriginData();
		} else {
			api.showToast('数据传递有误', 'error', 2000, function() {
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 2000)
			})
		};
	},

	getAnonymousData() {
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
			})
			var num = Math.floor(Math.random() * self.data.anonymousData.length); //0-10
			self.data.submitData.keywords = num;
			console.log(num)
		};
		api.anonymousGet(postData, callback);
	},

	getOriginData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.id,
		};
		postData.getAfter = {
			anonymous: {
				tableName: 'Anonymous',
				middleKey: 'keywords',
				key: 'id',
				condition: '=',
				searchItem: {
					status: 1
				},

			},
			goodDataNum: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'order_no',
				searchItem: {
					status: 1,
					type: 4
				},
				condition: '=',
				compute: {
					num: ['count', 'count', {
						status: 1
					}]
				}
			},
			goodMe: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'order_no',
				searchItem: {
					status: ['in', [-1, 1]],
					type: 4,
					user_no: wx.getStorageSync('info').user_no
				},
				condition: '='
			},
		};

		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.originData = res.info.data[0];
				self.getMainData();
			} else {
				api.showToast('数据错误', 'none', 1000);
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getOriginData', self);
			self.setData({
				web_originData: self.data.originData,
			});
		};
		api.messageGet(postData, callback);

	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			reply_id: self.data.id,
			type: 6
		};
		postData.getAfter = {
			anonymous: {
				tableName: 'Anonymous',
				middleKey: 'keywords',
				key: 'id',
				condition: '=',
				searchItem: {
					status: 1
				},

			},

			goodDataNum: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'order_no',
				searchItem: {
					status: 1,
					type: 4
				},
				condition: '=',
				compute: {
					num: ['count', 'count', {
						status: 1
					}]
				}
			},
			goodMe: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'order_no',
				searchItem: {
					status: ['in', [-1, 1]],
					type: 4,
					user_no: wx.getStorageSync('info').user_no
				},
				condition: '='
			},

		};

		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				self.data.total = res.info.total;
				self.setData({
					web_total: self.data.total,
				});
			} else {
				self.data.isLoadAll = true;
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.messageGet(postData, callback);
	},

	clickGood(e) {
		const self = this;
		api.buttonCanClick(self);
		var index = api.getDataSet(e, 'index');
		var item = self.data.mainData[index];

		if (item.goodMe.length == 0) {
			self.addLog(index)
		} else {
			self.updateLog(index)
		};
	},

	addLog(index) {
		const self = this;
		var item = self.data.mainData[index];
		const postData = {};
		postData.data = {
			type: 4,
			title: '点赞成功',

			order_no: self.data.mainData[index].id,
			pay_no: self.data.mainData[index].user_no,
		};
		postData.saveAfter = [{
			tableName: 'Message',
			FuncName: 'add',
			data: {
				relation_id: self.data.mainData[index].id,
				type: 7,
				thirdapp_id: 2,
				user_no: wx.getStorageSync('info').user_no,
				title: '点赞',
				relation_user: self.data.mainData[index].user_no
			}
		}];
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData[index].goodMe.push({
					status: 1,
					id: res.info.id
				});
				self.data.mainData[index].goodDataNum.num += 1;
			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.logAdd(postData, callback);
	},




	updateLog(index) {
		const self = this;
		var item = api.cloneForm(self.data.mainData[index]);
		const postData = {
			searchItem: {
				id: item.goodMe[0].id
			},
			data: {
				status: -item.goodMe[0].status
			}
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				console.log('item.goodMe[0].status', item.goodMe[0].status);
				self.data.mainData[index].goodMe[0].status = -item.goodMe[0].status;
				self.data.mainData[index].goodDataNum.num -= item.goodMe[0].status;
			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			
			self.setData({
				web_mainData: self.data.mainData
			})

		};
		api.logUpdate(postData, callback);
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		if (self.data.submitData.content == '') {
			api.showToast('不能发空评论', 'none')
			return;
		};
		self.messageAdd()
		console.log(self.data.submitData)
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		/*if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
		  postData.refreshToken = true;
		};*/
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.data.relation_id = self.data.originData.relation_id;
		postData.data.reply_id = self.data.id;
		const callback = (data) => {
			api.buttonCanClick(self, true)
			if (data.solely_code == 100000) {
				self.data.submitData.content = '';
				self.setData({
					web_submitData: self.data.submitData
				});
				self.getMainData(true)
				/*  api.showToast('发布成功','none',1000,function(){
				    setTimeout(function(){
				      wx.navigateBack({
				        delta:1
				      }) 
				    },1000);  
				  }) */
			} else {
				api.showToast(data.msg, 'none', 1000)
			}
			
		};
		api.messageAdd(postData, callback);
	},

	onShareAppMessage(res) {
		const self = this;

		if (self.data.buttonClicked) {
			api.showToast('数据有误请稍等', 'none');
			setTimeout(function() {
				wx.showLoading();
			}, 800)
			return;
		};
		console.log(res)
		var id = res.target.dataset.id;
		var type = res.target.dataset.type;
		if (res.from == 'button') {
			self.data.shareBtn = true;
		} else {
			self.data.shareBtn = false;
		}
		return {
			title: '歪果plus',
			path: 'pages/index/index?id=' + id + '&&type=' + type,
			success: function(res) {
				console.log(res);
				console.log(parentNo)
				if (res.errMsg == 'shareAppMessage:ok') {
					console.log('分享成功')
					if (self.data.shareBtn) {
						if (res.hasOwnProperty('shareTickets')) {
							console.log(res.shareTickets[0]);
							self.data.isshare = 1;
						} else {
							self.data.isshare = 0;
						}
					}
				} else {
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
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},





	show_all() {
		const self = this;
		self.is_show = !self.is_show;
		this.setData({
			is_show: self.is_show
		})
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
