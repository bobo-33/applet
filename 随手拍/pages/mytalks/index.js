var page = 1;
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    list: [],
    userInfo: {}
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
  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    page = 1
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
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

  bindDownLoad: function () {
    //   该方法绑定了页面滑动到底部的事件
    this.fetchData();
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });

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
      url: config.service.myTalkListUrl + '/' + this.data.userInfo.users_id + '?page=' + page,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  fetchData: function () {
    var that = this;

    Util.showLoading();
    var option = {
      url: config.service.myTalkListUrl + '/' + this.data.userInfo.users_id + '?page=' + page,
    };

    //发送数据请求
    Util.request(option,
      function (res) {
        if (res.data.status_code != '200') {
          Util.showLoading(res.data.message);
        }
        else {
          that.setData({
            list: that.data.list.concat(res.data.object)
          });
          page++;
          Util.hideLoading();
        }
      })
  },
  del: function (event) {
    var id = event.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //发送数据请求
          var option = {
            url: config.service.myTalkDelete + '/' + that.data.userInfo.users_id + '?id=' + id,
          };
          Util.request(option,
            function (res) {

              if (res.data.status_code == '200') {
                wx.showToast({
                  title: res.data.message,
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  that.onPullDownRefresh()
                }, 1000);
              }
              else {
                wx.showToast({
                  title: res.data.error.message,
                  icon: 'success',
                  duration: 2000
                })
              }

            })

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  createTalk: function (event) {
    var type = event.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/photo/index?type=' + type
    })
  },
})