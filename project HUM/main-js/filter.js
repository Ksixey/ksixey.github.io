let $elWithHidden = $('.hidden').slice(0,12);
let $elAllHidden=$('.hidden').slice(12)
let i=0;

$('.button-amazing-work').on('click',function (event) {
    event.preventDefault();
    i+=1;
        if(i===1) {
            $elWithHidden.removeClass('hidden');
            $('.button-amazing-work').css({display:'block'})
        }else {
            $elAllHidden.removeClass('hidden');
            $('.button-amazing-work').css({display:'none'})
        }
    })


    $('.ul-amazing-work').on('click','.list-amazing-work',function () {
        //изненение стилей tab
        $(this).addClass('active-amazing-work').siblings().removeClass('active-amazing-work');
        //по нажатию на определенный tab берем его data-atr
        const cotegoryToShow =$(this).data('atr');
        //в блоке берем детей на одном уровне ,кроме тех,которые имеют класс hidden и прячем их
        const list =$('.photos-amazing-work > *').not('.hidden').hide();
        console.log(cotegoryToShow)
        if (cotegoryToShow !== 'all'){
            $('.button-amazing-work').css({display: 'none'})
            list.filter(`[data-type ="${cotegoryToShow}"]`).show()
        }else {
            if(i<2){
                $('.button-amazing-work').css({display: 'block'})
            }
            list.not('.hidden').show()
        }
    })









