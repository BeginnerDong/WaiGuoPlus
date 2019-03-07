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
		touchDot: 0,
		time: 0,
		interval: "",
		currentType: 1,
		type: 1,
		currentType: 1,
		menu_show: false,
		is_choose: false,
		isFirstLoadAllStandard: ['getMainData', 'userInfoGet'],
		mainData: {
			1: [],
			2: [],
			3: [],
			4: []
		},
		submitData: {
			item: ''
		},
		urlSet: [],
		oneCss: 'middle',
		twoCss: 'right-clear',
		threeCss: 'right-clear',
		fourCss: 'left-clear',
		touchClock: true,
		buttonCanClick: true,
		playId:''
	},
	//事件处理函数
	onLoad(options) {
		const self = this;
		console.log('options', options);
		if (options.type && options.type == 'answer') {
			api.pathTo('/pages/indexAnswer/indexAnswer?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'graphic') {
			api.pathTo('/pages/indexDetail/indexDetail?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'video') {
			api.pathTo('/pages/indexVideoDetail/indexVideoDetail?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'teasing') {
			api.pathTo('/pages/indexTeasingDetail/indexTeasingDetail?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'answerDetail') {
			api.pathTo('/pages/indexAnswerComment/indexAnswerComment?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'graphicDetail') {
			api.pathTo('/pages/indexStateDetail/indexStateDetail?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'videoDetail') {
			api.pathTo('/pages/indexVideoComment/indexVideoComment?id=' + options.id, 'nav')
		} else if (options.type && options.type == 'teasingDetail') {
			api.pathTo('/pages/indexTeasingComment/indexTeasingComment?id=' + options.id, 'nav')
		};
		self.data.paginate = [{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 4,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 5,
					is_page: true,
				},
			],

			self.data.mainData = {
				1: [],
				2: [],
				3: [],
				4: []
			};
		self.setData({
			web_playId:self.data.playId,
			web_buttonCanClick: self.data.buttonCanClick
		})
		console.log('self.data.mainData ', self.data.mainData)
		self.getMainData();
		self.userInfoGet();
	},

	onShow() {
		const self = this;
		self.data.menu_show = false;
		self.data.is_choose = false;
		clearInterval(self.data.interval); // 清除setInterval 
		self.data.time = 0;
		self.init();
		self.setData({
			menu_show: self.data.menu_show,
			is_choose: self.data.is_choose,
			web_currentType: self.data.type
		})
	},


	init() {
		const self = this;
		self.setData({
			web_currentType: self.data.currentType
		})
	},

	onPullDownRefresh: function() {
		const self = this;
		wx.showNavigationBarLoading();
		self.data.mainData[self.data.type] = [];
		self.data.paginate = [{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 3,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 4,
					is_page: true,
				},
				{
					count: 0,
					currentPage: 1,
					pagesize: 5,
					is_page: true,
				},
			],
			self.getMainData(true);

	},

	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.userData = res.info.data[0];
				if (self.data.userData.info.behavior == null || self.data.userData.info.behavior == '' || self.data.userData.info
					.behavior == undefined) {
					wx.reLaunch({
						url: '/pages/entrance/entrance',
					});
				}
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'userInfoGet', self);
			console.log('userInfoGet', self.data.userData)

		};
		api.userGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		api.buttonCanClick(self, false);
		self.setData({
			web_loading: true
		});
		console.log(self.data.paginate)
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate[self.data.type - 1]);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			type: self.data.type,
			user_type: 0
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			},
			answer: {
				tableName: 'Message',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: 1,
					type: 5
				},
				condition: '='
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
			comment: {
				tableName: 'Message',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: 1,
					type: 6
				},
				condition: '='
			},
			anonymous: {
				tableName: 'Anonymous',
				middleKey: 'keywords',
				key: 'id',
				searchItem: {
					status: 1,
				},
				condition: '=',

			},

		};
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.info.data.length > 0) {

				for (var i = 0; i < res.info.data.length; i++) {
					if (res.info.data[i].user_no == wx.getStorageSync('info').user_no) {
						res.info.data[i].isMe = true;
					};
					var time = api.timeToTimestamp(res.info.data[i].create_time)

					res.info.data[i].create_time = api.getDateDiff(time)

				}
				console.log(self.data.mainData);
				self.data.mainData[self.data.type].push.apply(self.data.mainData[self.data.type], res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			self.setData({
				web_loading: false,
				web_mainData: self.data.mainData,
			});
			setTimeout(function() {
				wx.hideNavigationBarLoading();
				wx.stopPullDownRefresh();

				self.data.touchClock = false;
			}, 300);

		};
		api.messageGet(postData, callback);
	},



	getAnswerData(index) {
		const self = this;
		const postData = {
			paginate: api.cloneForm(self.data.paginate[4]),
			tokenFuncName: 'getProjectToken',
			searchItem: {
				relation_id: self.data.mainData[self.data.type][index].id,
				type: 5,
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
				for (var i = 0; i < res.info.data.length; i++) {
					var time = api.timeToTimestamp(res.info.data[i].create_time)
					res.info.data[i].create_time = api.getDateDiff(time)
				};
				self.data.mainData[self.data.type][index].answerData = res.info.data;
				self.data.mainData[self.data.type][index].isShowAnswer = true;
			} else {
				api.showToast('没有更多了', 'none')
			};
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.messageGet(postData, callback);
	},



	/* 	//滑动切换
		bindChange(e) {
			const self = this;
			console.log(e, 'e')
			self.data.type = e.detail.current + 1;
			self.setData({
				web_currentType: self.data.type
			});
			if (self.data.mainData[self.data.type].length == 0) {
				api.buttonCanClick(self);
				self.getMainData(true);
			};
		}, */

	clickGood(e) {
		const self = this;
		api.buttonCanClick(self);
		var index = api.getDataSet(e, 'index');
		var item = self.data.mainData[self.data.type][index];

		if (item.goodMe.length == 0) {
			self.addLog(index)
		} else {
			self.updateLog(index)
		};
	},

	addLog(index) {
		const self = this;
		var item = self.data.mainData[self.data.type][index];
		const postData = {};
		postData.data = {
			type: 4,
			title: '点赞成功',
			order_no: self.data.mainData[self.data.type][index].id,
			pay_no: self.data.mainData[self.data.type][index].user_no,
		};
		postData.saveAfter = [{
			tableName: 'Message',
			FuncName: 'add',
			data: {
				relation_id: self.data.mainData[self.data.type][index].id,
				type: 7,
				thirdapp_id: 2,
				title: '点赞',
				relation_user: self.data.mainData[self.data.type][index].user_no,
				user_no: wx.getStorageSync('info').user_no
			}
		}];
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData[self.data.type][index].goodMe.push({
					status: 1,
					id: res.info.id
				});
				self.data.mainData[self.data.type][index].goodDataNum.num += 1;
			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			api.buttonCanClick(self, true);
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.logAdd(postData, callback);
	},


	vedioPlay(e) {
		const self = this;
		console.log(e);
		console.log(e.target.id);
		var currentId = e.target.id;
		if (self.data.playId && self.data.playId != currentId) {
			console.log('currentId', currentId)
			var videoContextPrev = wx.createVideoContext(self.data.playId)
			videoContextPrev.pause();

			var videoContextNext = wx.createVideoContext(currentId)
			videoContextNext.play();
		} else {
			self.data.playId = currentId;
			console.log('self.data.playId', self.data.playId)
			wx.createVideoContext(self.data.playId).play()
		}
		self.data.playId = currentId
		self.setData({
			web_playId: self.data.playId
		})
	},




	updateLog(index) {
		const self = this;
		var item = api.cloneForm(self.data.mainData[self.data.type][index]);
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
			if (res.solely_code == 100000) {
				console.log('item.goodMe[0].status', item.goodMe[0].status);
				self.data.mainData[self.data.type][index].goodMe[0].status = -item.goodMe[0].status;
				self.data.mainData[self.data.type][index].goodDataNum.num -= item.goodMe[0].status;
			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			api.buttonCanClick(self, true);
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
			api.showToast('搜什么呢？', 'none')
			return;
		};
		wx.navigateTo({
			url: '/pages/search/search?item=' + self.data.submitData.item
		})
		console.log(self.data.submitData)
	},

	// 触摸开始事件 

	touchStart: function(e) {
		const self = this;
		self.data.touchDot = e.touches[0].pageX; // 获取触摸时的原点 
		self.data.touchDotY = e.touches[0].pageY;
	},

	// 触摸移动事件 

	touchMove: function(e) {
		const self = this;
		self.data.touchMove = e.touches[0].pageX;
		self.data.touchMoveY = e.touches[0].pageY;
		// 向左滑动  



	},

	// 触摸结束事件 

	touchEnd: function(e) {
		const self = this;
		if (!self.data.touchClock) {
			console.log('self.data.touchMoveY-self.data.touchDotY', self.data.touchMoveY - self.data.touchDotY)
			console.log('self.data.touchMove - self.data.touchDot', self.data.touchMove - self.data.touchDot)
			if (self.data.touchMove - self.data.touchDot <= -50 && -20 < self.data.touchMoveY - self.data.touchDotY && 20 >
				self.data.touchMoveY - self.data.touchDotY && !self.data.touchClock) {
				if (self.data.currentType == 4) {
					self.data.type = 1;
				} else {
					self.data.type++;
				};
				self.changeContent();
			} else {
				self.data.touchClock = false
			};
			if (self.data.touchMove - self.data.touchDot >= 50 && -20 < self.data.touchMoveY - self.data.touchDotY && 20 >
				self.data.touchMoveY - self.data.touchDotY && !self.data.touchClock) {
				if (self.data.currentType == 1) {
					self.data.type = 4;
				} else {
					self.data.type--;
				};
				self.changeContent();
			} else {
				console.log(222)
			}


		};
	},


	//点击切换
	changeType(e) {
		const self = this;

		var type = api.getDataSet(e, 'type');
		self.data.type = type;
		self.changeContent();


	},

	toMiddle() {
		const self = this;
		if (self.data.type == 1) {
			self.setData({
				oneCss: 'middle'
			});
		};
		if (self.data.type == 2) {
			self.setData({
				twoCss: 'middle'
			});
		};
		if (self.data.type == 3) {
			self.setData({
				threeCss: 'middle'
			});
		};
		if (self.data.type == 4) {
			self.setData({
				fourCss: 'middle'
			});
		};
	},



	changeContent() {
		const self = this;
		self.data.touchClock = true;

		if (self.data.currentType == 1) {
			self.setData({
				fourCss: 'left-clear',
				threeCss: 'right-clear',
				twoCss: 'right-clear',
			});
			if (self.data.type == 4) {
				self.setData({
					oneCss: 'right'
				});
			} else {
				self.setData({
					oneCss: 'left'
				});
			};
			self.toMiddle();
		};

		if (self.data.currentType == 2) {
			self.setData({
				fourCss: 'right-clear',
				threeCss: 'right-clear',
				oneCss: 'left-clear',
			});
			if (self.data.type == 1) {
				self.setData({
					twoCss: 'right'
				});
			} else {
				self.setData({
					twoCss: 'left'
				});
			};
			self.toMiddle();
		};

		if (self.data.currentType == 3) {
			self.setData({
				fourCss: 'right-clear',
				twoCss: 'left-clear',
				oneCss: 'left-clear',
			});
			if (self.data.type == 4) {
				self.setData({
					threeCss: 'left'
				});
			} else {
				self.setData({
					threeCss: 'right'
				});
			};
			self.toMiddle();
		};

		if (self.data.currentType == 4) {
			self.setData({
				fourCss: 'left-clear',
				twoCss: 'left-clear',
				oneCss: 'right-clear',
			});
			if (self.data.type == 1) {
				self.setData({
					fourCss: 'left'
				});
			} else {
				self.setData({
					fourCss: 'right'
				});
			};
			self.toMiddle();
		};

		self.data.currentType = self.data.type;
		self.setData({
			web_currentType: self.data.currentType
		});

		if (self.data.mainData[self.data.type].length == 0) {
			api.buttonCanClick(self);
			self.getMainData(true);
		} else {
			setTimeout(function() {
				self.data.touchClock = false;
			}, 300);
		};

	},

	menu() {
		const self = this;
		self.menu_show = !self.menu_show;
		this.setData({
			menu_show: self.menu_show
		})
	},

	close() {
		const self = this;
		self.menu_show = false;
		this.setData({
			menu_show: self.menu_show
		})
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
		wx.showLoading();
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate[self.data.type - 1].currentPage++;
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
	/*******展示更多评论*********/
	show_more(e) {
		const self = this;
		const index = api.getDataSet(e, 'index');

		if (self.data.mainData[self.data.type][index].answerData) {
			self.data.mainData[self.data.type][index].isShowAnswer = self.data.mainData[self.data.type][index].isShowAnswer ?
				!self.data.mainData[self.data.type][index].isShowAnswer :
				true;
			console.log(self.data.mainData[self.data.type][index].isShowAnswer);
			self.setData({
				web_mainData: self.data.mainData
			})
		} else {
			self.getAnswerData(index);
		};
		console.log('self.data.mainData', self.data.mainData);
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

	previewImage(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		var imgIndex = api.getDataSet(e, 'id');
		console.log('index', index)
		console.log('imgIndex', imgIndex)
		console.log(self.data.mainData[self.data.type][index].mainImg[0])
		for (var i = 0; i < self.data.mainData[self.data.type][index].mainImg.length; i++) {
			self.data.urlSet.push(self.data.mainData[self.data.type][index].mainImg[i].url);
		};
		wx.previewImage({
			current: self.data.mainData[self.data.type][index].mainImg[imgIndex].url, // 当前显示图片的http链接
			urls: self.data.urlSet // 需要预览的图片http链接列表
		})
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
