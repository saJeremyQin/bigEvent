$(function() {
    // 点击"去注册账号"，绑定click事件
    $("#link-login").on("click", function() {
        // 隐藏自己这个盒子，显示登录盒子
        $(".reg-box").hide()
        $(".login-box").show()

    })

    // 点击“去登录”链接，绑定click事件
    $("#link-reg").on("click", function() {
        // 隐藏自己这个盒子，显示注册盒子
        $(".reg-box").show()
        $(".login-box").hide()

    })

    // 自定义密码框的校验规则,先获取layui的form对象
    var form = layui.form
    var layer = layui.layer

    // console.log(form);

    form.verify({
        // 自定义一个叫pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义一个repwd的校验规则
        repwd: function(value) {
            // 判断两次输入是否相符,选择器的规则是reg-box父盒子中寻找name属性相符的元素
            var pwd = $(".reg-box [name = password]").val()
            if (value !== pwd) {
                return "两次密码输入不一致！"
            }
        }
    })

    // 使用注册表单，发起注册请求
    $("#reg_form").on("submit", function(e) {
        // 阻止瞎跳转
        e.preventDefault()

        // 发起ajax请求
        var data = {
            "username": $("#reg-form [name=username]").val(),
            "password": $("#reg-form [name=password]").val()
        }
        $.post("/api/reguser", data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 如果注册成功，使用layui，提示消息
                layer.msg('注册成功，请登录!');
                // 模拟人为点击链接，跳转到登录盒子
                $("#link-login").click();

            })
    })

    // 使用登录表单，发起登录请求
    $("#login_form").on("submit", (function(e) {
        // 阻止默认跳转行为
        e.preventDefault()


        // 快速获取表单数据
        var formdata = $(this).serialize()
        console.log(formdata);

        // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: formdata,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功!');
                // 如果登录成功，保存token，跳转index
                localStorage.setItem('token', res.token)
                console.log(res.token);

                location.href = '/index.html'



            }
        })

    }))


})