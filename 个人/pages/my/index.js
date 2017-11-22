// pages/my/index.js
Page({
  data: {
    actionSheetHidden: true
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
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
        that.update()
      }
    })
   
  }

})

