// 在每次ajax请求前会调用次数
$.ajaxPrefilter(function(options) {
    options.url = 'http://127.0.0.1:3007' + options.url
    console.log(options.url);

})