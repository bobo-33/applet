// pages/photo/index.js
var config = require('../../config');
var Util = require('../../utils/util');
var app = getApp()
var images = Array()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    type:'',
    imageUrl: [], //上传图片的url
    content:'', //说说文字
    title:'', // 说说标题
    recodePath:'', //录音地址
    video_src:'', //视频地址
    show_wenzi:true,
    show_audio:false,
    show_video:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ss_type = options.type // 发布说说的种类 1 文字+图片说说 2 音频 3 视频
    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        type: ss_type
      })
    })
    if (ss_type == 1)
    {
      that.setData({
        show_wenzi: true,
        show_audio: false,
        show_video: false
      })
    }
    else if (ss_type == 2)
    {
      that.setData({
        show_wenzi: false,
        show_audio: true,
        show_video: false
      })
    }
    else
    {
      that.setData({
        show_wenzi: false,
        show_audio: false,
        show_video: true
      })
    }
    
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

  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  //主要是用来选择图片以及接收图片路径回调的监听
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        _this.setData({
          logo: res.tempFilePaths,
        });
        var successUp = 0; //成功个数
        var failUp = 0; //失败个数
        var length = res.tempFilePaths.length; //总共个数
        var i = 0; //第几个
        _this.uploadDIY(res.tempFilePaths, successUp, failUp, i, length, config.service.uploadUrl);
      },
    })
  },
  uploadDIY: function (filePaths, successUp, failUp, i, length, uploadUrl) {
    let _this = this;
    if (this.data.type == 1)
    {
      var folder = 'images'
    }
    else if (this.data.type == 2)
    {
      var folder = 'audio'
    }
    else
    {
      var folder = 'video'
    }

    console.log(uploadUrl)
    wx.showLoading({
      title: '上传中...',
    })
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePaths[i],
      name: 'file',
      formData: {
        'folder': folder
      },
      success: (resp) => {
        console.log(resp)
        images.push(resp.data);
        successUp++;
      },
      fail: (res) => {
        failUp++;
      },
      complete: (r) => {
        i++;
        if (i == length) {
          console.log(images);
          _this.setData({
            imageUrl: images
          })
          console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！')
          wx.hideLoading(); //图片上传成功隐藏
        }
        else 
        {  //递归调用uploadDIY函数
          this.uploadDIY(filePaths, successUp, failUp, i, length, uploadUrl);
        }
      },
    });
  },
  bindFormSubmit: function (data) {
    var content = data.detail.value.content
    var title = data.detail.value.title
    //判断文字

    if (title == '') {
      this.publicMessage('标题不能为空！')
      return false;
    }

    if (content == '') {
      this.publicMessage('内容不能为空！')
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
      url: config.service.talkCreateUrl, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: {
        content: data.detail.value.content,
        title: data.detail.value.title,
        imageUrl: _this.data.imageUrl, //上传图片的url
        videoUrl: _this.data.video_src, //上传视频的url
        audioUrl: _this.data.recodePath, //上传录音的url
        users_id: _this.data.userInfo.users_id,
        types: _this.data.type
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.statue_code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 4000
          });
          wx.reLaunch({
            url: '../my/index'
          })
        }
        else {
          _this.publicMessage(res.data.message);
        }
      }
    })
  },

  startRecode: function () {
    var that = this;
    wx.startRecord({
      success: function (res) {
        that.setData({
          recodePath: res.tempFilePath
        })
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: that.data.recodePath,
          name: 'file',
          formData: {
            'folder': 'audio'
          },
          success: (resp) => {
            console.log(resp)
            that.setData({
              recodePath: resp.data
            })
            wx.hideLoading(); //图片上传成功隐藏
          },
        });
      },
      fail: function (res) {
        //录音失败
      }
    })
    setTimeout(function () {
      //结束录音  
      wx.stopRecord()
    }, 30000)
  },

  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          video_src: res.tempFilePath
        })
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: that.data.video_src,
          name: 'file',
          formData: {
            'folder': 'video'
          },
          success: (resp) => {
            console.log(resp)
            that.setData({
              video_src: resp.data
            })
            wx.hideLoading(); //图片上传成功隐藏
          },
        });
      }
    })
  }

})