
// pages/details/index.js
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:{},
      userInfo:{},
      isShow:true,
      talkPraise:false,
      buttonDisabled: false,
      showModal: false
  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = options.id // 说说id
      var that = this;
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo
        })
      })

      this.onPullDownRefresh(id)
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
  onPullDownRefresh: function (id) {
    var that = this;
    Util.showLoading();
    var option = {
      url: config.service.talkDetailUrl + '/' + id + '?users_id=' + that.data.userInfo.users_id,
    };
    //发送数据请求
    Util.request(option,
      function (res) {
        if (res.data.status_code != '200') {
          Util.showLoading(res.data.message);
        }
        else {
        
          that.setData({
            info: res.data.object,
            isShow:false,
            talkPraise: res.data.object.im_praise
          });
        
          Util.hideLoading();
        }
      })
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

  talkPraise:function () {
  
    var that = this;
    that.setData({
      buttonDisabled:true
    })
    //发送数据请求
    wx.request({
      url: config.service.talkPraiseUrl, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        talk_id: that.data.info.id,
        users_id: that.data.userInfo.users_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.statue_code == 200)
        {
          that.setData({
            buttonDisabled:false,
            isShow: false,
            talkPraise:true
          });
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
        else
        {
          Util.showLoading(res.data.message);
        }
      }
    });
  },

  clearTalkPraise:function () {
    var that = this;
    that.setData({
      buttonDisabled:true
    })
    //发送数据请求
    wx.request({
      url: config.service.clearTalkPraiseUrl, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        talk_id: that.data.info.id,
        users_id: that.data.userInfo.users_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.statue_code == 200) {
          that.setData({
            isShow: false,
            talkPraise: false,
            buttonDisabled:false
          });
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
        else {
          Util.showLoading(res.data.message);
        }
      }
    });
  }

})