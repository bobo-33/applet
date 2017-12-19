var page = 1;
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    list: [],
    userInfo: {},
    hasRefesh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      that.fetchData();
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      hasRefesh: true,
    });
    page = 1;

    var that = this;
    Util.showLoading();
    var option = {
      url: config.service.myTalkMessageUrl + '?user_id=' + that.data.userInfo.users_id + '&page=' + page,
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
      url: config.service.myTalkMessageUrl + '?user_id='+that.data.userInfo.users_id + '&page=' + page,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData()
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
      hasRefesh: true
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  checkTalkInfo:function (e) {
    var talk_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/index?id='+talk_id
    })
  }
})