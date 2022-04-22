// 在每次ajax请求前会调用次数
$.ajaxPrefilter(function(options) {
    options.url = 'http://127.0.0.1:3007' + options.url
        //console.log(options.url);

    // 为以 /my 开头的请求路径，在请求头中添加 Authorization 身份认证字段
    // indexOf() 方法返回字符串中指定文本首次出现的索引（位置）
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ''
        }
    }

    // 全局统一挂载complete函数
    options.complete = function(res) {

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
            //1. 删除token
            localStorage.removeItem('token')

            //2. 重置到login页面
            location.href = '/login.html'

        }


    }

})