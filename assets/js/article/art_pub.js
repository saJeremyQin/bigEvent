$(function() {
    // 初始化富文本编辑器
    initEditor()

    var layer = layui.layer
    var form = layui.form

    // 1. 初始化图片裁剪器 
    var $image = $('#image')

    // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    initArtCate()
        // 初始化文章分类的方法
    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('获取文章分类失败')

                // 获取文章成功，调用模板引擎
                var htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 记得下拉选择框的内容是动态生成的，一定要调用render方法
                form.render()
            }
        })

    }

    // 为选择文件按钮绑定点击事件
    $('#btnChooseFile').on('click', function(e) {
        // 模拟隐藏按钮的点击事件
        $('#fileU').click()
    })

    // 监听fileU的change事件
    $('#fileU').on('change', function(e) {
        var filelist = e.target.files
        console.log(filelist);


        if (filelist.length === 0)
            return layer.msg('请选择头像')

        // 获取选择的文件
        var file = e.target.files[0]


        //createObjectURL返回一个DOMString，包含了一个对象URL，该URL可用于指定源 object的内容
        var newImageURL = URL.createObjectURL(file)

        $image.cropper('destroy').attr('src', newImageURL).cropper(options)

    })

    // 定义默认状态
    var art_state = '已发布'

    // 为‘btnSaveDraft’绑定click事件，理解：可以为form表单的提交类按钮绑定两个事件，互不影响,次序是先click，再submit
    $('#btnSaveDraft').on('click', function(e) {
        art_state = '草稿'

    })

    // 为表单提交定义事件处理函数
    $('#form_pub').on('submit', function(e) {

        // 阻止表单的默认提交行为
        e.preventDefault()

        // 创建一个formdata对象，传入的参数需要是一个dom对象
        // 1. getElementbyId，获取dom对象 2. 直接用$(this)
        // formdata是按照key/value对的形式对html表单进行组织
        var mform = document.getElementById('form_pub')
        var fd = new FormData(mform)


        //var fd = new Formdata($(this)[0])
        fd.append('state', art_state)
            // fd.forEach(function(value, key) {
            //     console.log(key, value);
            // })
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布 
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象 
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            console.log(blob);
        })

        // fd.forEach(function(value, key) {
        //     console.log(key, value);
        // })

        var dd = fd.get('cover_img')
        console.log(dd);

        if (dd.name === '')
            return layer.msg('请选择文章封面')
        publishArticle(fd)
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg('发布文章数据失败')

                // 1. 提示消息 2. 定位
                layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'

            }
        })

    }
})