var host = 'https://excsky.com/';

var config = {
    service :{
        host,
        loginUrl: host +'api/get_user_openid', //获取用户openid
        talkCreateUrl: host + 'api/talk_create', //发布说说
        talklistUrl: host +'api/talk_list', //说说列表
        talkDetailUrl: host + 'api/talk_details', //说说详情
        myTalkListUrl: host + 'api/my_talk_list', //我发布的说说
        myTalkDelete: host + 'api/my_talk_del', //我发布的说说删除
        uploadUrl:host + 'api/upload', //上传
        talkPraiseUrl: host + 'api/talk_praise', //点赞
        clearTalkPraiseUrl: host + 'api/clear_talk_praise', //取消点赞
        sendCommonUrl: host + 'api/sendCommon', //评论
        talkCommentUrl: host + 'api/talk_comment', //说说评论列表
        talkTypeListUrl: host + 'api/talk_type_list', //说说分类列表
        talkSearchistUrl: host + 'api/talk_search', //说说搜索列表
        myTalkMessageUrl: host + 'api/im_message', //我的消息列表
        myTalkDzUrl: host + 'api/im_talk_dz' //我点赞的说说
    }
};

module.exports = config;