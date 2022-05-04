$(function() {

    // 初始化用户信息
    initUserInfo();

    var form = layui.form
    var layer = layui.layer



    // 设定nickname的验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6)
                return '昵称在1-6个字符之间'
        }
    })


    // 初始化用户信息
    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {

                if (res.status !== 0)
                    return layer.msg('获取用户信息失败')

                //给表单快速赋值
                console.log('我要开始赋值了');

                // form.val('form-userinfo', res.data)

                // 获取用户信息，初始化表单
                $("#userinfo_form [name=username]").val(res.data.username)
                $("#userinfo_form [name=nickname]").val(res.data.nickname)
                $("#userinfo_form [name=email]").val(res.data.email)
            }
        })
    }

    // 重置表单的数据
    $("#btnReset").on('click', function(e) {
        // 阻止表单的默认重置事件
        e.preventDefault()

        // 又请求了一次数据
        initUserInfo()
    })

    // 提交表单请求处理
    $(".layui-form").on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()

        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {

                console.log(res);

                if (res.status !== 0)
                    return layer.msg('更新用户信息失败')
                        // 如果更新用户信息成功 1.提示用户即可
                layer.msg("修改用户信息成功！")
                window.parent.getUserInfo()
            }
        })

    })

})