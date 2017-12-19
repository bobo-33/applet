// pages/photo/index.js
var app = getApp();
var config = require('../../config');
var Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    systemInfo: {},
    talk_id:'',
    to_uid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
      
        that.setData({
          systemInfo: res,
          talk_id: options.id
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindFormSubmit: function (data) {
    var content = data.detail.value.content
    //判断文字

    if (content == '') {
      this.publicMessage('评论内容不能为空！')
      return false;
    }

    this.submitPublish(data);
  },
  /**
   * 公告提示
   */
  publicMessage: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 2000
    })
  },
  /**
  * 数据验证成功 发布
  */
  submitPublish: function (data) {
    // console.log(data)
    let _this = this;
    wx.request({
      url: config.service.sendCommonUrl, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        content: data.detail.value.content,
        users_id: _this.data.userInfo.users_id,
        talk_id: _this.data.talk_id,
        to_uid: _this.data.to_uid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.statue_code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 3000
          });
        }
        else {
          _this.publicMessage(res.data.message);
        }
        wx.redirectTo({
          url: '../details/index?id=' + _this.data.talk_id
        })
      }
    })
  }
})