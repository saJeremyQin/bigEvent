$(function() {

    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            var oldPwd = $("[name=oldPwd]").val()

            if (value === oldPwd)
                return '新旧密码相同，请重新输入'
        },
        rePwd: function(value) {
            var newPwd = $("[name=newPwd]").val()
            if (value !== newPwd)
                return '两次输入不一致，请重试！'

        }
    })

    // 重置修改密码表单的数据，清空
    $("#btnReset").on('click', function(e) {
        // 阻止表单的默认重置事件
        e.preventDefault()

        console.log('this is btnReset');

        // 这两种写法都可以
        // $(".layui-form")[0].reset()
        document.getElementById("userpwd_form").reset()

    })

    // // 提交密码修改
    // $("#userpwd_form").on('submit', function(e) {
    //     // 阻止默认提交行为
    //     e.preventDefault()
    //     var pwddata = {}
    //     pwddata.oldPwd = $("[name=oldPwd]").val()
    //     pwddata.newPwd = $("[name=newPwd]").val()

    //     // 提交ajax请求
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/updatepwd',
    //         data: pwddata,
    //         success: function(res) {
    //             if (res.status !== 0)
    //                 return layer.msg('更新密码失败！')
    //             return layer.msg('更新密码成功！')
    //         }
    //     })

    // })
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()

        //提交ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('更新密码失败！')
                layer.msg('更新密码成功！')
                    // 调用dom对象的reset方法，注意[0]来获取
                    //  $(".layui-form")[0].reset()
                document.getElementById("userpwd_form").reset()
            }
        })
    })





})