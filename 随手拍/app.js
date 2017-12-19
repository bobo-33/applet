//app.js
var config = require('./config');
var Util = require('./utils/util');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            // console.log(res)
            var res_code = res.code;
            //获取用户信息
            wx.getUserInfo({
              success: function (res) {
                console.log(config.service.loginUrl);
                //发起网络请求
                wx.request({
                  url: config.service.loginUrl,
                  data:Util.json2Form({code:res_code, nickName:res.userInfo.nickName, gender:res.userInfo.gender, avatarUrl:res.userInfo.avatarUrl}),
                  header: {
                        'content-type': 'application/x-www-form-urlencoded'
                  },
                  method:'POST',
                  success: function(result) {
                    if (result.errMsg == 'request:ok')
                    {
                        // console.log(result)
                        that.globalData.userInfo = result.data.object
                        typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  }
                })
                
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})