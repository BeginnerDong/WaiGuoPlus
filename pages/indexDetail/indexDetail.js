import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
	data: {
		is_show: false,
		is_choose: false,
		isFirstLoadAllStandard: ['getOriginData', 'getMainData'],
		submitData: {
			content: '',
			type: 6
		},
		
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		if (self.data.id) {
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


	getOriginData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.id,
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				condition: '=',
				searchItem: {
					status: 1
				},
				info: ['headImgUrl', 'nickname']
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
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.originData = res.info.data[0];
				if (self.data.originData.user_no == wx.getStorageSync('info').user_no) {
					self.data.originData.isMe = true
				};
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
			relation_id: self.data.id,
			type: 6,
			reply_id: null
		};
		postData.getAfter = {
			reply: {
				tableName: 'Message',
				middleKey: 'id',
				key: 'reply_id',
				condition: '=',
				searchItem: {
					type: 6,
					status: 1
				},
			},
			replyUser: {
				tableName: 'User',
				middleKey: ['reply', '0', 'user_no'],
				key: 'user_no',
				condition: '=',
				searchItem: {
					status: 1
				},
			},
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				condition: '=',
				searchItem: {
					status: 1
				},
				info: ['headImgUrl', 'nickname']
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
				for (var i = 0; i < res.info.data.length; i++) {
					if(res.info.data[i].user_no==wx.getStorageSync('info').user_no){
						res.info.data[i].isMe = true;
					};		
				};
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
			};
			self.data.total = res.info.total;
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
				web_total: self.data.total,
			});
		};
		api.messageGet(postData, callback);
	},

	getAnswerData(index) {
			const self = this;
			const postData = {
				tokenFuncName: 'getProjectToken',
				searchItem: {
					reply_id: self.data.mainData[index].id,
					type: 6,
					user_type: 0
				},
				getAfter: {
					answerUser: {
						tableName: 'User',
						middleKey: 'user_no',
						key: 'user_no',
						searchItem: {
							status: 1,
						},
						condition: '='
					},
				}
			};
			const callback = (res) => {
				if (res.info.data.length > 0) {
				
					self.data.mainData[index].answerData = res.info.data;
					self.data.mainData[index].isShowAnswer = true;
		
				} else {
					api.showToast('没有更多了', 'none')
				};
				self.setData({
					web_mainData: self.data.mainData
				})
			};
			api.messageGet(postData, callback);
		},
	
	/*  showMore(e){
	    const self =this;
	    const index = api.getDataSet(e,'index');
	    if(self.data.mainData[index].isShowReply){
	      wx.navigateTo({
	        url:"/pages/indexVideoComment/indexVideoComment?id="+self.data.mainData[index].id,
	      })
	    }else{
	      self.data.mainData[index].isShowReply = true
	    }
	    self.setData({
	      web_mainData:self.data.mainData
	    })
	    console.log('self.data.mainData',self.data.mainData);  
	  }, */
		
		showMore(e) {
			const self = this;
			const index = api.getDataSet(e, 'index');
		
			if (self.data.mainData[index].answerData) {
				
				/* self.data.mainData[index].isShowAnswer = self.data.mainData[index].isShowAnswer ? !self.data.mainData[index].isShowAnswer :
					true;
				console.log(self.data.mainData[index].isShowAnswer);
				self.setData({
					web_mainData: self.data.mainData
				}); */
				wx.navigateTo({
				  url:"/pages/indexStateDetail/indexStateDetail?id="+self.data.mainData[index].id,
				})
			} else {
				self.getAnswerData(index);
			};
			console.log('self.data.mainData', self.data.mainData);
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
		postData.data.relation_id = self.data.id;
		postData.saveAfter = [
		  {
		    tableName:'Message',
		    FuncName:'add',
		    data:{
		      relation_id:self.data.id,
		      type:7,
					thirdapp_id:2,
					user_no:wx.getStorageSync('info').user_no,
		      title:'评论',
		      relation_user:self.data.originData.user_no
		    }
		  }
		];
		const callback = (data) => {
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
			api.buttonCanClick(self, true)
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
			api.buttonCanClick(self, true);
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

	messageUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.id
		};
		postData.data = {
			status: -1
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

	choose() {
		const self = this;
		self.is_choose = true;
		self.menu_show = false;
		this.setData({
			is_choose: self.is_choose,
			menu_show: self.menu_show
		})
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	choose_close() {
		const self = this;
		self.is_choose = false;
		self.setData({
			is_choose: self.is_choose
		})
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

	intoPathRedi(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'rela');
	},
})
