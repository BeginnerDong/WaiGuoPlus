import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
	data: {
		isFirstLoadAllStandard: ['getMainData'],
		mainData: [],

	},
	//事件处理函数

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		wx.setNavigationBarTitle({
		  title: 'ta收到的赞' 
		})
		self.data.user_no = options.user_no;
		self.getMainData();

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
			type: ['in', [2, 4,5,6]],
			user_no: self.data.user_no,
			user_type: 0
		};
		postData.getAfter = {
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
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
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
			
		}
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			
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

	intoPathRela(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'rela');
	},

})
