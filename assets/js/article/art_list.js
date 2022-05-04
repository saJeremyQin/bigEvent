$(function() {
    // 定义查询参数对象
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条
        cate_id: '', // 文章分类id，默认空
        state: '' // 文章的发布状态，默认空
    }

    // 定义layui使用的form和layer
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 自定义过滤器函数，可以在模板中通过 |dateFormat 使用
    template.defaults.imports.dateFormat = function(time) {
        const dtime = new Date(time);

        var y = dtime.getFullYear()
        var m = padZero(dtime.getMonth() + 1)
        var d = padZero(dtime.getDate())
        var hh = padZero(dtime.getHours())
        var mm = padZero(dtime.getMinutes())
        var ss = padZero(dtime.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    initTable()
    initArtCate()

    // 获取并展示文章列表数据
    function initTable() {
        // var a = null
        // console.log(a);
        // console.log('----')
        // console.log(undefined || null);
        // console.log('kkkkk');


        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                //console.log(res);

                if (res.status !== 0)
                    return layer.msg('获取文章列表数据失败')

                // 获取成功的话，调用模板引擎，渲染数据
                var htmlStr = template('tpl_table', res)
                $("tbody").html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 定义渲染分页的方法
    function renderPage(total) {

        //console.log(total);
        laypage.render({
            elem: 'fan-page', //分页容器的id，这里是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到

            limit: q.pagesize, //每页显示多少数据           
            curr: q.pagenum, //当前页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 触发jump的原因有两种1. 点击页码值 2.首次调用laypage.render
            // 第二个原因是触发死循环的原因，解决办法加first判断
            jump: function(obj, first) {
                console.log(obj);


                // 当前页码值赋给q参数对象
                q.pagenum = obj.curr

                // 最新每页条目数赋值给q参数对象
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });


    }

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
                form.render()
            }
        })

    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {


        // 阻止默认提交行为
        e.preventDefault()

        // 获取表单中选中分类和状态的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        console.log(cate_id);
        console.log('------');
        console.log(state);


        // 为q参数对象赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 使用代理，因为btn是动态渲染出来，获取自定义属性data-id
    $('tbody').on('click', '.btnDeleteArticle', function(e) {

        var left = $('.btnDeleteArticle').length
        console.log(left);

        // 获取Id
        var id = $(this).attr('data-id')
        console.log(id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //发起ajax，调用删除接口
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0)
                        layer.msg('删除文章数据失败')
                    layer.msg('删除文章数据成功')
                    layer.close(index);

                    // 判断要不要修改页码值, 如果剩下1，说明是最后的按钮，要给pagenum-1
                    if (left === 1)
                        q.pagenum = (q.pagenum > 1 ? q.pagenum - 1 : q.pagenum)


                    initTable()
                }
            })


        });

    })
})