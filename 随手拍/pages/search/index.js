var page = 1;
var config = require('../../config');
var Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_name:null,
    searchList:[],
    closeShow:true,
    hasRefesh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
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
      url: config.service.talkSearchistUrl + '?search_name=' + that.data.search_name + '&page=' + page,
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
            searchList: res.data.object,
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
    this.fetchData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  searchFocus:function (e) {
    var that = this;
    that.setData({
      closeShow:false,
      search_name: e.detail.value
    })
    
    if (that.data.search_name == null)
    {
      return;
    }
    else
    {
      that.fetchData()
    }

  },
  fetchData: function () {
    var that = this;
    wx.showLoading({
      title: '搜索中',
    })
    var option = {
      url: config.service.talkSearchistUrl + '?search_name='+ that.data.search_name + '&page=' + page,
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
            searchList: res.data.object,
            hasRefesh: false,
          });
          wx.hideLoading()
          page++;
        }
      })
  },
  clearCloseShow:function (e) {
    this.setData({
      closeShow: true,
      search_name:null
    })
  }
})