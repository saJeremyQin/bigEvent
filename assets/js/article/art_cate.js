$(function() {
    var layer = layui.layer
    var form = layui.form

    var indexAddLayer = null
    var indexReviseLayer = null

    initArtCateList()

    function initArtCateList() {

        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                //调用模板引擎，填充数据
                //console.log(res);
                if (res.status !== 0)
                    return layer.msg("获取文章分类列表失败！")

                var htmlStr = template('tpl-table', res)
                    //console.log(htmlStr);

                $("tbody").html(htmlStr)

            }
        })

    }

    // 为添加分类按钮绑定事件处理函数
    $("#btnAddCate").on("click", function(e) {


        // 使用layui绘制弹出层
        indexAddLayer = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    })

    // 当点击"确认添加"按钮时的添加分类表单处理
    // 注意要使用代理，因为这整个form都是动态添加上去的(指定css行，事件处理不行)
    // 为form-add添加事件处理，发起ajax请求，添加文章分类
    $("body").on('submit', '#form-add', function(e) {
        // 为什么要阻止啊？
        e.preventDefault()
        console.log('ok');

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), //这样可以获取body里的动态表单的值吗？
            success: function(res) {
                if (res.status !== 0)
                    return layer.msg("添加文章分类失败")

                // 如果添加成1. 提消息 2. 刷新table 3.关掉弹出层
                layer.msg("添加文章分类成功！")

                initArtCateList()

                layer.close(indexAddLayer)

            }
        })
    })

    // 使用代理，为修改按钮绑定事件处理函数
    $("tbody").on('click', ".btnReviseCate", function(e) {

        // 创建编辑分类信息的弹出层
        indexReviseLayer = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-Revise').html()
        })

        // 获取文章分类id
        var id = $(this).attr("data-id")
        console.log(id);



        // 发起ajax请求，根据id获取文章分类信息
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);

                if (res.status !== 0)
                    return '获取文章分类失败'

                // 方法1. DOM操作，为当前的弹出层设置表单字段的值
                // $('input[name=name]').val(res.data.name)
                // $('input[name=alias]').val(res.data.alias)

                // 方法2 使用layui的form.val快速设置表单数据
                // console.log('根据id获取文章分类' + id);
                // console.log(res.data);


                form.val('form-Revise', res.data)
            }
        })
    })

    // 使用代理，为删除按钮绑定事件处理函数
    $("tbody").on('click', ".btnDeleteCate", function(e) {
        console.log('this is delete button');
        var id = $(this).attr("data-id")
        console.log(id);

        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something 调用ajax，发起删除请求

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index)
                    initArtCateList()
                }
            })

        });
    })

    // 当点击"确认修改"按钮时的修改分类表单处理
    // 注意要使用代理，因为这整个form都是动态添加上去的
    // 为form-revise添加事件处理，发起ajax请求，修改文章分类
    $("body").on('submit', "#form-Revise", function(e) {
        console.log('ok---');
        // console.log($(this).serialize());
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('修改文章分类失败')
                }
                // TO DO LIST 1. 提示成功 2. 关掉弹出层
                layer.msg('修改文章分类成功')
                layer.close(indexReviseLayer)
                initArtCateList()
            }
        })


    })

})