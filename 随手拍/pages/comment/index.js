// pages/comment/index.js
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp();
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    talk_id:'',
    hasRefesh: false,
    list:[],
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
    page = 1
    var that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        talk_id: options.id
      })
    })

    this.loadMore()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadMore:function () {
    console.log(page)
    var that = this;
    Util.showLoading();
    var option = {
      url: config.service.talkCommentUrl + '?talk_id=' + that.data.talk_id + '&page=' + page,
    };
    //发送数据请求
    Util.request(option,
      function (res) {
        console.log(res)
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
  onPullDownRefresh: function () { 
    
  },
  onReachBottom: function () {
    //   该方法绑定了页面滑动到底部的事件
    this.loadMore()
  },
})