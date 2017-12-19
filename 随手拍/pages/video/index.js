//index.js
//获取应用实例
var page = 1;
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp()
Page({
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    list: [],
    userInfo: {},
    actionSheetHidden: true,
    hidden: true,
    hasRefesh: false,
  },
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  onLoad: function () {
    page = 1
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.fetchData();
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (res) {
        that.setData({
          src: res.tempFilePaths,
        })
        wx.navigateTo({
          url: '../camera/camera?src=' + that.data.src
        })
      }
    })
  },
  onReachBottom: function () {
    //   该方法绑定了页面滑动到底部的事件
    this.fetchData()
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
      hasRefesh: true
    });

  },

  onPullDownRefresh: function () { //下拉刷新
    console.log('下拉刷新')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      hasRefesh: true,
    });
    page = 1;

    var that = this;
    Util.showLoading();
    var option = {
      url: config.service.talkTypeListUrl + '/3' + '?page=' + page,
    };
    console.log(option)
    //发送数据请求
    Util.request(option,
      function (res) {

        if (res.data.status_code != '200') {
          Util.showLoading(res.data.message);
          return;
        }
        else {
          that.setData({
            list: res.data.object,
            hasRefesh: false,
          });
          page++;
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh();
        }

        Util.hideLoading();
      })
  },
  fetchData: function () {
    var that = this;
    Util.showLoading();
    var option = {
      url: config.service.talkTypeListUrl + '/3' + '?page=' + page,
    };
    //发送数据请求
    Util.request(option,
      function (res) {

        if (res.data.status_code != '200') {
          Util.showLoading(res.data.message);
          return;
        }
        else {
          that.setData({
            list: that.data.list.concat(res.data.object),
            hasRefesh: false,
          });

          page++;
        }

        Util.hideLoading();
      })
  },

  createTalk: function (event) {
    var type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/photo/index?type=' + type
    })
  },
  refresh: function (event) {
    page = 1;
    this.setData({
      list: [],
      scrollTop: 0
    });
    this.fetchData();
  }

})


