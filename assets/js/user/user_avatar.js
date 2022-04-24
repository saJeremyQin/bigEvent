$(function() {

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素 
    var $image = $('#image')
        // 1.2 配置选项 
    const options = {
            // 纵横比 
            aspectRatio: 1,
            // 指定预览区域 
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域 
    $image.cropper(options)

    //为上传按钮绑定fileU的事件
    $("#btnChooseImage").on('click', function() {
        $("#fileU").click()
    })

    // 监听fileU的change事件
    $("#fileU").on('change', function(e) {

        //获取用户选择的文件
        var filelist = e.target.files

        // 如果用户未选择照片，这里逻辑上可能有问题，理论上未选择文件，进不到change
        if (filelist.length === 0)
            return layer.msg('请选择照片')

        // 获取用户选择的文件
        var file = e.target.files[0]

        // 根据选择的文件，创建一个url地址
        // URL.createObjectURL是一个javascript的原生Web API，同类的还有XMLHttpRequest
        var newImageURL = URL.createObjectURL(file)

        // newImageURL is like this http://127.0.0.1:5500/3fb35493-e40d-42d6-b6d5-90274ebc6bc5

        // 链式编程，1.销毁原有cropper 2.设定新的图片路径 3.创建新的剪裁区域
        $image.cropper('destroy').attr('src', newImageURL).cropper(options)

    })

    // 监听文件上传按钮的click事件，上传文件
    $("#btnFileUpload").on('click', function() {
        //图片转换为base64编码
        var dataURL = $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg("更换头像失败")
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        })
    })
})