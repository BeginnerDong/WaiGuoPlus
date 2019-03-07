import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
	data: {
		mainData: [],
		isFirstLoadAllStandard: ['getMainData']
	},
	//事件处理函数

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.user_no = options.user_no;
		self.getMainData()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			type: 5,
			user_no: self.data.user_no
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'pay_no',
				key: 'user_no',
				searchItem: {
					status: 1
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
			forNav:{
				tableName:'Message',
				middleKey:['goodDataNum','0','order_no'],
				key:'id',
				searchItem:{
					status:1
				},
				condition:'='
			}	
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
			} else {
				self.data.isLoadAll = true
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData
			})
		};
		api.logGet(postData, callback);
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
