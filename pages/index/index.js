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

	
		currentType: 0,
		type: 0,
		currentType: 1,
		menu_show: false,
		is_choose: false,
		isFirstLoadAllStandard: ['getMainData', 'userInfoGet'],
		mainData: {
			0: [],
			1: [],
			2: [],
			3: []
		},
		newPublishData:[],
		submitData: {
			item: ''
		},
		urlSet: [],

		//轮播相关
		totalHeight: '600px',
		touchClock: false,
		swiperItem: [{
				left: '',
				wdith: '',
				'z-index': 0
			},
			{
				left: '',
				wdith: '',
				'z-index': 0
			},
			{
				left: '',
				wdith: '',
				'z-index': 0
			},
			{
				left: '',
				wdith: '',
				'z-index': 0
			},
		],
		swiper: {
			totalHeight: '420px',
			lengthPercent: '',
			css: '',
			lengthPercent: '',
			totalWidth: ''
		},
		originSwiperItem: {
			left: '',
			touchMove: ''
		},
		touchLeftRight: [],
		touchOriginPage: {
			X: 0,
			Y: 0
		},

	},

	onPageScroll: function(e) {
		console.log('onPageScroll', e)
	},
	//事件处理函数

	onLoad(options) {
		const self = this;
		self.data.clientWidth = wx.getSystemInfoSync().windowWidth;

		self.data.swiper.totalWidth = 3 * self.data.clientWidth;
		self.data.swiper.totalHeight = wx.getSystemInfoSync().windowHeight - 110;
		self.data.swiper.lengthPercent = -self.data.clientWidth + 'px';
		self.setData({
			web_swiper: self.data.swiper
		});

		for (var i in self.data.swiperItem) {
			self.data.swiperItem[i].width = self.data.clientWidth + 'px';
			if (i == 0) {
				console.log('i>0', i);
				self.data.swiperItem[i].left = self.data.clientWidth;

			} else if (i == 3) {
				self.data.swiperItem[i].left = 0;
			} else {
				self.data.swiperItem[i].left = 2 * self.data.clientWidth;
			};
		};
		self.setData({
			web_swiperItem: self.data.swiperItem
		});

		console.log('self.data.swiperItem', self.data.swiperItem);
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
		self.init()

	},
	
	onShow() {
		const self = this;
		if(wx.getStorageSync('newPublish')){
			self.getNewPublish()
		};
		self.data.menu_show = false;
		self.data.is_choose = false;
		self.setData({
			menu_show: self.data.menu_show,
			is_choose: self.data.is_choose,
			web_currentType: self.data.type
		})
	},
	
	getNewPublish() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id:wx.getStorageSync('newPublish')
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

			if (res.info.data.length > 0) {
				res.info.data[0].isMe = true;
				var time = api.timeToTimestamp(res.info.data[0].create_time);
				res.info.data[0].create_time = api.getDateDiff(time);
				self.data.newPublishData = res.info.data[0];
				self.data.mainData[res.info.data[0].type-1].unshift(self.data.newPublishData);
				wx.removeStorageSync('newPublish');
				self.setData({
					web_mainData: self.data.mainData,
				});
			} 
		};
		api.messageGet(postData, callback);
	},




	// 触摸开始事件 

	touchStart: function(e) {
		const self = this;
		self.data.touchOriginPage.X = e.touches[0].pageX; // 获取触摸时的原点 
		self.data.touchOriginPage.Y = e.touches[0].pageY; // 获取触摸时的原点 
		console.log('touchStart', self.data.touchOriginPage);
		if (!self.data.touchClock) {
			var index = parseInt(e.currentTarget.dataset.index);
			self.data.type = index;
			if (index == self.data.swiperItem.length - 1) {
				var leftRight = self.getLeftRight(0);
			} else {
				var leftRight = self.getLeftRight(index + 1);
			};

			var left = leftRight[0];
			var right = leftRight[1];
			var type = leftRight[2];
			self.data.touchLeftRight = [left, right, type];

			self.data.startTimes = 1;
			console.log('touchStart', e);

		};




	},




	// 触摸移动事件 

	touchMove: function(e) {
		const self = this;

		if (!self.data.touchClock && !self.data.touchMoveClick) {
			var touchMove = e.touches[0].pageX - self.data.touchOriginPage.X;
			var touchMoveY = e.touches[0].pageY - self.data.touchOriginPage.Y;
			if (touchMoveY <= 20 && touchMoveY >= -20) {
				self.data.touchMoveClick = true;
				if (touchMove < -20) {
					self.data.touchLeftRight[2] = 'right';
					self.data.swiperItem[self.data.type]['left'] = self.data.clientWidth + touchMove;
					self.data.swiperItem[self.data.touchLeftRight[1]]['left'] = 2 * self.data.clientWidth + touchMove;
					self.data.swiperItem[self.data.touchLeftRight[0]]['left'] = 0;
				} else if (touchMove > 20) {
					self.data.touchLeftRight[2] = 'left';
					self.data.swiperItem[self.data.type]['left'] = self.data.clientWidth + touchMove;
					self.data.swiperItem[self.data.touchLeftRight[0]]['left'] = touchMove;
					self.data.swiperItem[self.data.touchLeftRight[1]]['left'] = 2 * self.data.clientWidth;
				};
				self.setData({
					web_swiperItem: self.data.swiperItem
				});
				setTimeout(function() {
					self.data.touchMoveClick = false;
				}, 100);
			};
		};



	},

	// 触摸结束事件 

	touchEnd: function(e) {
		const self = this;
		if (!self.data.touchClock) {
			self.data.touchClock = true;
			var touchMove = e.changedTouches[0].pageX - self.data.touchOriginPage.X;
			var touchMoveY = e.changedTouches[0].pageY - self.data.touchOriginPage.Y;
			if ((touchMoveY <= 40 && touchMoveY >= -40) && (touchMove <= -60 || touchMove >= 60)) {
				self.changeSwiperByArrow(self.data.touchLeftRight[0], self.data.touchLeftRight[1], self.data.touchLeftRight[2]);
				if (self.data.touchLeftRight[2] == 'left') {
					self.changeContent(self.data.touchLeftRight[0]);
				} else {
					self.changeContent(self.data.touchLeftRight[1]);
				};

			} else {
				self.changeSwiperByArrow(self.data.touchLeftRight[0], self.data.touchLeftRight[1], 'reset');
			};
		} else {
			var index = parseInt(e.currentTarget.dataset.index);
			self.data.type = index;
			if (index == self.data.swiperItem.length - 1) {
				var leftRight = self.getLeftRight(0);
			} else {
				var leftRight = self.getLeftRight(index + 1);
			};
		};

		wx.pageScrollTo({
			scrollTop: 0,
		});

	},




	getLeftRight(to) {
		const self = this;
		if (to > self.data.type) {
			if (self.data.type == 0) {
				if (to == self.data.swiperItem.length - 1) {
					var left = self.data.swiperItem.length - 1;
					var right = 1;
					var type = 'left';
				} else {
					var left = self.data.swiperItem.length - 1;
					var right = to;
					var type = 'right';
				};
			} else {
				var left = self.data.type - 1;
				var right = to;
				var type = 'right';
			};
		} else {
			if (self.data.type == self.data.swiperItem.length - 1) {
				if (to == 0) {
					var left = self.data.type - 1;
					var right = 0;
					var type = 'right';
				} else {
					var left = to;
					var right = 0;
					var type = 'right';
				};
			} else {
				var left = to;
				var right = self.data.type + 1;
				var type = 'left';
			};
		};
		self.changeSwiperByArrow(left, right, 'reset');
		return [left, right, type];
	},


	//点击切换
	changeType(e) {
		const self = this;
		var type = parseInt(api.getDataSet(e, 'type'));
		var leftRight = self.getLeftRight(type);
		console.log('leftRight', leftRight);
		var left = leftRight[0];
		var right = leftRight[1];
		self.changeSwiperByArrow(left, right, leftRight[2]);
		self.changeContent(type);
	},
	
	changeSwiperByArrow(left, right, type) {

		const self = this;
		if (type == 'left') {
			self.data.swiperItem[self.data.type]['left'] = 2 * self.data.clientWidth;
			self.data.swiperItem[right]['left'] = 2 * self.data.clientWidth;
			self.data.swiperItem[left]['left'] = self.data.clientWidth;
		} else if (type == 'right') {
			self.data.swiperItem[self.data.type]['left'] = 0;
			self.data.swiperItem[right]['left'] = self.data.clientWidth;
			self.data.swiperItem[left]['left'] = 0;
		} else {
			self.data.swiperItem[self.data.type]['left'] = self.data.clientWidth;
			self.data.swiperItem[right]['left'] = 2 * self.data.clientWidth;
			self.data.swiperItem[left]['left'] = 0;
		};
		self.setData({
			web_swiperItem: self.data.swiperItem
		});
		setTimeout(function() {
			self.data.touchClock = false;
		}, 500)


	},




	changeContent(index) {
		const self = this;
		self.data.currentType = index;
		self.data.type = index;
		self.setData({
			web_currentType: self.data.currentType
		});
		if (self.data.mainData[index].length == 0) {
			api.buttonCanClick(self);
			self.getMainData(true);
		};
	},




	init() {
		const self = this;
		api.commonInit(self);
		self.data.paginate = [{
				count: 0,
				currentPage: 1,
				pagesize: 3,
				is_page: true,
				isLoadAll: false,
			},
			{
				count: 0,
				currentPage: 1,
				pagesize: 3,
				is_page: true,
				isLoadAll: false,
			},
			{
				count: 0,
				currentPage: 1,
				pagesize: 3,
				is_page: true,
				isLoadAll: false,
			},
			{
				count: 0,
				currentPage: 1,
				pagesize: 3,
				is_page: true,
				isLoadAll: false,
			},
			{
				count: 0,
				currentPage: 1,
				pagesize: 5,
				is_page: true,
				isLoadAll: false,
			},
		],
		self.data.mainData={
			0: [],
			1: [],
			2: [],
			3: []
		},
		console.log('self.data.paginate', self.data.paginate)
		self.userInfoGet();
		self.getMainData();
		self.setData({
			web_currentType: self.data.currentType
		})
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

	getMainData(isNew) {
		const self = this;
		self.data.touchClock = true;
		api.buttonCanClick(self, false);
		console.log('self.data.buttonCanClick', self.data.buttonCanClick);
		self.setData({
			web_loading: true
		});
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate[self.data.type]);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			type: self.data.type + 1,
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

			if (res.info.data.length > 0) {

				for (var i = 0; i < res.info.data.length; i++) {
					if (res.info.data[i].user_no == wx.getStorageSync('info').user_no) {
						res.info.data[i].isMe = true;
					};
					var time = api.timeToTimestamp(res.info.data[i].create_time)
					res.info.data[i].create_time = api.getDateDiff(time)
				};
				console.log(self.data.mainData);
				self.data.mainData[self.data.type].push.apply(self.data.mainData[self.data.type], res.info.data);
				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			console.log(self.data.mainData);

			setTimeout(function() {
				self.setData({
					web_loading: false
				});
				wx.hideNavigationBarLoading();
				wx.stopPullDownRefresh();
				wx.hideLoading();
				self.data.touchClock = false;
			}, 1500);

			setTimeout(function() {
				api.buttonCanClick(self, true);
			}, 3000);


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
				api.showToast('没有评论', 'none')
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


	/* 	vedioPlay(e) {
			const self = this;
			console.log(e);
			console.log(e.target.id);
			var currentId = e.target.id;
			if (self.data.playId && self.data.playId != currentId) {
				console.log('currentId', currentId)
				var videoContextPrev = wx.createVideoContext(self.data.playId)
				videoContextPrev.pause();
			};
			self.data.playId = currentId

		}, */

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

		if (!self.data.paginate[self.data.type].isLoadAll && self.data.buttonCanClick) {
			wx.showLoading();
			self.data.paginate[self.data.type].currentPage++;
			self.getMainData();
		};

	},

	choose_close() {
		const self = this;
		self.is_choose = false;
		self.setData({
			is_choose: self.is_choose
		});
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
		self.data.urlSet = [];
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
