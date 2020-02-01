
    $('.slider-photos .photo-person-slider').click(function() {
        selectPerson($(this));
        $(this).css({marginBottom:'10px'}).addClass('active-person').siblings().animate({marginBottom:'0px'},500).removeClass('active-person');
    })
    function selectPerson($el) {
        $('.paragraph-people-say')
            .empty()
            .data('say',$el.data('say'))
            .append($el.data('say'))
        $('.fullname').empty()
            .data('name',$el.data('name'))
            .append($el.data('name'))
        $('.job')
            .empty()
            .data('job',$el.data('job'))
            .append($el.data('job'))
        $('.photo-person')
            .empty()
            .attr('src',$el.data('src'))
            .append($el.attr('src'))
    }

    let dataValue;

    $('.left-slider').on('click',function(){
        $('.active-person').animate({marginBottom:'0px'},500).removeClass('active-person' )
            .prev().addClass('active-person').css({marginBottom:'10px'})
        dataValue = $('.active-person').data('number')
        if(typeof dataValue === 'undefined') {
            $('.slider-photos').children().last().addClass('active-person').css({marginBottom:'10px'})
        }
        selectPerson( $('.active-person'))
    })


    $('.right-slider').on('click',function(){
        $('.active-person').animate({marginBottom: 0},500).removeClass('active-person')
            .next().addClass('active-person').css({marginBottom:'10px'})
        dataValue = $('.active-person').data('number')
        if(typeof dataValue === 'undefined') {
            $('.slider-photos').children().first().addClass('active-person').css({marginBottom:'10px'})
        }
        selectPerson( $('.active-person'))
    })


