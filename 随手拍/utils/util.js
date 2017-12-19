function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json){
  var str = [];
  for(var p in json){
    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]));
  }
  return str.join('&');
}

function imageUtil(e) { 
 var imageSize = {}; 
 var originalWidth = e.detail.width;//图片原始宽 
 var originalHeight = e.detail.height;//图片原始高 
 var originalScale = originalHeight/originalWidth;//图片高宽比 
//  console.log('originalWidth: ' + originalWidth) 
//  console.log('originalHeight: ' + originalHeight) 
 //获取屏幕宽高 
 wx.getSystemInfo({ 
  success: function (res) { 
   var windowWidth = res.windowWidth; 
   var windowHeight = res.windowHeight; 
   var windowscale = windowHeight/windowWidth;//屏幕高宽比 
  //  console.log('windowWidth: ' + windowWidth) 
  //  console.log('windowHeight: ' + windowHeight) 
   if(originalScale < windowscale){//图片高宽比小于屏幕高宽比 
    //图片缩放后的宽为屏幕宽 
     imageSize.imageWidth = windowWidth; 
     imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth; 
   }else{//图片高宽比大于屏幕高宽比 
    //图片缩放后的高为屏幕高 
     imageSize.imageHeight = windowHeight; 
     imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight; 
   } 
     
  } 
 }) 
//  console.log('缩放后的宽: ' + imageSize.imageWidth) 
//  console.log('缩放后的高: ' + imageSize.imageHeight) 
 return imageSize; 
}

//【判断传入的对象是否是函数】
function isFunction(obj) {
  return typeof obj === 'function';
}

/**
 * 方法说明:网络请求模块
 * 
 */
function request(option, successCb, errorCb, completeCb) {
  //console.log(option.url);
  wx.request({
    url: option.url,// 开发者服务器接口地址
    data: option.data ? option.data : {},//请求的参数
    method: option.method ? option.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: option.header ? option.header : { 'content-type': 'application/json' }, // 设置请求的 header
    success: function (res) {//收到开发者服务成功返回的回调函数
      isFunction(successCb) && successCb(res);
    },
    error: function () {//接口调用失败的回调函数
      isFunction(errorCb) && errorCb();
    },
    complete: function () {//接口调用结束的回调函数（调用成功、失败都会执行）
      isFunction(completeCb) && completeCb();
    }
  });
}

/**
 * 显示消息提示框
 */
function showLoading(title='加载中') {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: 10000
  });
}

/**
 * 隐藏消息提示框
 */
function hideLoading() {
  wx.hideToast();
}


module.exports = {
  formatTime: formatTime,
  json2Form:json2Form,
  imageUtil:imageUtil,
  request: request,
  showLoading: showLoading,
  hideLoading: hideLoading 
}
