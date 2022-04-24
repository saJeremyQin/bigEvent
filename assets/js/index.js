$(function() {
    // 调用获取用户信息
    getUserInfo();

    const layer = layui.layer
    $("#tuichuBtn").on('click', function() {
        // 弹出提示框
        layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function(index) {

            // 1.删除token
            localStorage.removeItem('token')

            // 定位到login页面
            location.href = '/login.html'

            // 关闭confirm框
            layer.close(index);
        });

    })
})


function getUserInfo() {
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function(res) {
            if (res.status !== 0)
                return layui.layer.msg("获取用户信息失败")

            // 渲染用户信息
            renderAvatar(res.data)
        }

    })

}

// 渲染用户头像和名称
function renderAvatar(user) {

    // 1. 获取用户名称
    var name = user.nickname || user.username
        //console.log(name);

    // x = 5 | 1
    // 0101 0101 0101
    // 0011 0100 0111
    // console.log('5|1 is:' + x);
    // 2. 设置欢迎的文本

    $('#welcome').html('欢迎您&nbsp&nbsp' + name)

    // 3. 按需渲染用户头像
    if (user.user_pic) {
        // 3.1 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".text_avatar").hide();

    } else {
        // 3.2 渲染文本头像
        var first = name[0].toUpperCase();
        $(".layui-nav-img").hide()
        $(".text_avatar").html(first).show()
    }

}