$('.menu-service .menu-service-li').on('click',function(){
    $(this)
        .addClass('active')
        .siblings()
        .removeClass('active');
    $('.about-service .post-menu-service')
        .removeClass('post-menu-service-active')
        .eq($(this)
            .index())
        .addClass('post-menu-service-active');
})
