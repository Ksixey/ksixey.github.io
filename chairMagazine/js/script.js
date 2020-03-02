let basket = {
    basketIcon: '.header__basket',
    storageName: "basket",
    emptyBanner: "#cardIsEmpty",
    itemCount: '.basket-itemCount',
    basketFooter: "#modalFooter",
    itemsContainer: "#cardItems",
    totalSum: '.totalPrice__value',
    items: [],
    itemHTML: '<div class="row border cardItems__item mb-4 rounded"><div class="col-lg-3 cardItems__item__image col-6 col-md-4"><img alt="Item 1"class="basket-itemImage img-fluid"src=./img/furniture_gallery_items/14.png></div><div class="cardItems__item__body col"><p class="m-0 basket-itemTitle cardItems__item__title py-2"><div class=cardItems__details><div class="row justify-content-between"><div class="col-12 col-lg-4"><span class=cardItems__item__price><del class="mr-1 basket-itemLastPrice lastPrice"></del> <span class="p-1 basket-itemPrice currentPrice"></span></span></div><div class="col-8 col-lg-5 d-md-block d-none m-lg-0 mt-md-3"><div class="align-items-end cardItems__item__quantity d-flex quantity"><label class="m-0 quantity__name"><span class="m-0 mr-lg-3">Quantity:</span> <input class="mr-1 basket-itemCount mr-lg-2 quantity__itemCount"disabled></label> <button class="fas fa-minus mr-1 quantity__minus"onclick=\'basket.onClickCount(this,"-")\'type=button></button> <button class="fas fa-plus quantity__plus"onclick=\'basket.onClickCount(this,"+")\'type=button></button></div></div><div class="col-4 col-lg-3 d-md-block d-none mt-lg-0 mt-md-3"><div class="cardItems__item__sum sum text-center"><p class="mb-2 sum__title">Sum<p class="basket-itemSum sum__price"></div></div></div></div></div><div class="container m-md-0 mt-4"><div class="row d-md-none"><div class=col-8><div class="align-items-end cardItems__item__quantity d-flex quantity"><label class="m-0 quantity__name"><p class="mb-1 mr-3">Quantity:</p><input class="basket-itemCount quantity__itemCount mr-2 p-1"disabled></label> <button class="fas fa-minus mr-1 quantity__minus px-2"onclick=\'basket.onClickCount(this,"-")\'type=button></button> <button class="fas fa-plus quantity__plus px-2"onclick=\'basket.onClickCount(this,"+")\'type=button></button></div></div><div class=col-4><div class="cardItems__item__sum sum text-center"><p class="mb-2 sum__title">Sum<p class="basket-itemSum sum__price"></div></div></div></div></div>',
    countElements: function () {
        return this.items.length;
    },
    getItems: function () {
        let storageItems = localStorage.getItem(this.storageName);
        if (!storageItems) {
            storageItems = '[]'
        }
        this.items = JSON.parse(storageItems);
        return this.items;
    },
    addItem: function (item) {
        this.addToStorage(item.image, item.title, item.lastPrice, item.price, item.count, item.id);
        this.displayItem(item.image, item.title, item.lastPrice, item.price, item.count, item.id);
    },
    clear: function () {
        $(this.itemsContainer).find('.cardItems__item').remove();
        localStorage.removeItem(this.storageName);
        this.items = [];
        this.displayBasket();
    },
    displayItem: function(image, title, lastPrice, price, count, id) {
        // Add to HTML
        let $HTML = $(this.itemHTML);
        $HTML.attr('data-id', id);
        $HTML.find('.basket-itemImage').attr('src', image);
        $HTML.find('.basket-itemTitle').text(title);
        if (lastPrice) {
            $HTML.find('.basket-itemLastPrice').text(lastPrice);
        } else {
            $HTML.find('.basket-itemLastPrice').remove();
        }
        $HTML.find('.basket-itemPrice').text(price);
        $HTML.find('.basket-itemCount').val(count);
        $HTML.find('.basket-itemSum').text(count * price);
        $(this.itemsContainer).prepend($HTML);
    },
    addToStorage: function (image, title, lastPrice,price, count, id) {
        this.items.push({image, title, lastPrice, price, count, id});
        localStorage.setItem(this.storageName, JSON.stringify(this.items));
    },
    updateDisplayMode: function () {
        if (this.items.length) {
            $('#cardIsEmpty').removeClass('d-block').addClass('d-none');
            $('#modalFooter').removeClass('d-none').addClass('d-block');
            $('#cardItems').removeClass('d-none').addClass('d-block');
        } else {
            $('#cardIsEmpty').removeClass('d-none').addClass('d-block');
            $('#modalFooter').removeClass('d-block').addClass('d-none');
            $('#cardItems').removeClass('d-block').addClass('d-none');
        }
    },
    updateBasketCount: function () {
        $(this.basketIcon).attr('data-count-items', this.countElements())
    },
    updateStorage: function() {
        localStorage.setItem(this.storageName, JSON.stringify(this.items));
    },
    updateSum: function ($itemContainer, count) {
        let $sum = $itemContainer.find('.basket-itemSum');
        let $price = $itemContainer.find('.basket-itemPrice');
        $sum.text($price.text() * count);
    },
    updateTotalSum: function () {
        let totalSum = $(this.itemsContainer).find('.basket-itemSum').toArray().reduce( (lastValue, value) => +value.innerText + lastValue, 0) / 2;
        $(this.totalSum).text(totalSum);
    },
    displayBasket: function () {
        let itemsToDisplay = this.getItems();
        if (itemsToDisplay.length) {
            itemsToDisplay.forEach( item => this.displayItem(item.image, item.title, item.lastPrice, item.price, item.count, item.id));
        }
        this.updateDisplayMode();
        this.updateBasketCount();
        this.updateTotalSum();
    },
    isNotItemInBasket: function (ID) {
        return !this.items.some( item => item.id === ID);
    },
    onClickToAdd: function (button, container, wrapperFunction) {
        let item = wrapperFunction(button, container);
        if (item && this.isNotItemInBasket(item.id)) {
            this.addItem(item);
            this.updateBasketCount();
            this.updateDisplayMode();
            this.updateTotalSum();
        }
    },
    onClickCount: function (button, operation) {
        let $itemContainer = $(button).closest('.cardItems__item');
        let $itemCount = $itemContainer.find(this.itemCount);
        let value = $itemCount.val();
        if (operation === '+') {
            ++value;
        } else if (operation === '-') {
            --value;
        } else {
            console.log('INVALID OPERATION NAME!')
        }
        if (value >= 0) {
            $itemCount.val(value);
            let ID = $itemContainer.attr('data-id');
            this.items.forEach( item => {
                if (item.id === ID) {
                    item.count = value;
                }
            });
            this.updateStorage();
            this.updateSum($itemContainer, value);
            this.updateTotalSum();
        }
    }
};
basket.displayBasket();

function addToBasketFromGallery(button, container) {
    let $itemContainer = $(button).closest(container);
    return {
        id: $itemContainer.find('.b-title').text() + $itemContainer.find('.b-image').attr('src'),
        image: $itemContainer.find('.b-image').attr('src'),
        title: $itemContainer.find('.b-title').text(),
        lastPrice: $itemContainer.find('.b-lastPrice').text(),
        price: $itemContainer.find('.b-price').text(),
        count: 1,
    };
}

function addToBasketFromProducts(button, container) {
    let $itemContainer = $(button).closest(container);
    return {
        id: $itemContainer.find('.button-view').attr('data-title') + $itemContainer.find('.button-view').attr('data-src'),
        image: $itemContainer.find('.button-view').attr('data-src'),
        title: $itemContainer.find('.button-view').attr('data-title'),
        lastPrice: $itemContainer.find('.button-view').attr('data-sale').replace('$', ''),
        price: $itemContainer.find('.button-view').attr('data-product-cost').replace('$', ''),
        count: 1,
    }
}

function addToBasketProductModal(button, container) {
    let $itemContainer = $(button).closest(container);
    return {
        id: $itemContainer.find('.b-title').text() + $itemContainer.find('.b-image').attr('src'),
        image: $itemContainer.find('.b-image').attr('src'),
        title: $itemContainer.find('.b-title').text(),
        lastPrice: $itemContainer.find('.b-lastPrice').text().replace('$', ''),
        price: $itemContainer.find('.b-price').text().replace('$', ''),
        count: 1,
    };
}




$(document).ready(function () {
    $('#show-modal').on('show.bs.modal', function (e) {
        let button = $(e.relatedTarget); // Button that triggered the modal
        let titleModal = button.attr('data-title');
        let productCostNow = button.attr('data-product-cost');
        let imgProducts = button.attr('data-src');
        let productSale = button.attr('data-sale');// Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        let modalShow = $(this);
        modalShow.find('.old-price').text(productSale);
        modalShow.find('.modal-show__title').text(titleModal);
        modalShow.find('.product-cost-now').text(productCostNow);
        modalShow.find('.modal-img').attr('src',imgProducts)
    });
});

function generateCards() {
    const $productCard = $('.product-card');
    const $loadButton = $('#load-button-card');
    let $window = $(window);
    let countProducts ;

    function changeWidth(){
        if ($window.width() <= 767) {
            countProducts = 3;
        } else if ($window.width() < 980) {
            countProducts = 4;
        } else {
            countProducts = 9 ;
        }
        showProducts($productCard, countProducts);
    }

    changeWidth()
    $(window).resize(function () {
        changeWidth()
    });

    $loadButton.on('click', function () {
        showProducts($('.product-card:hidden'), countProducts);
        if($('.product-card:hidden').length === 0){
            $loadButton.hide()
        }

    });

    function showProducts(items, count) {
        for (let i = 0; i < count; i++) {
            $(items[i]).css({display:'block'});
            if (!items[i]) {
                return
            }
        }
    }
}

generateCards();





function rangeSlider() {
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
        " - $" + $( "#slider-range" ).slider( "values", 1 ) );
    $( "#modal-slider-range" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 300 ],
        slide: function( event, ui ) {
            $( "#modal-amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#modal-amount" ).val( "$" + $( "#modal-slider-range" ).slider( "values", 0 ) +
        " - $" + $( "#modal-slider-range" ).slider( "values", 1 ) );
} ;

rangeSlider();
function initTooltips() {
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });
}

// Gallery
function createProductGallery(tabs, showBox, likeButton = '#like') {
    createGalleryCarousel(tabs, showBox);
    loadLikes(likeButton, tabs);
    let $elements = $(tabs).children();
    initFirstElement($elements, showBox);
    addLikeEvent(showBox, likeButton)
}
function createGalleryCarousel(tabs, showBox) {
    createArrows(tabs);
    $(tabs).find('div').click( (event) => {
        if (event.target.localName === 'img') {
            doActive(event);
            changeBoxElement($(event.target), $(showBox));
            event.stopPropagation()
        }
    });
}
function createArrows (block) {
    $(block).slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        variableWidth: true,
        prevArrow: '<button class="fas fa-chevron-left inner-gallery__tabs__button"></button>',
        nextArrow: '<button class="fas fa-chevron-right inner-gallery__tabs__button"></button>'
    });
}
function doActive(event) {
    $(event.target).addClass('active').siblings().removeClass('active');
}
function changeBoxElement(element, showBox) {
    let boxImage = showBox.find(".itemImage");
    let boxTitle = showBox.find("h4");
    let boxRate = showBox.find('#rate');
    let boxPrice = showBox.find('#price');
    let boxLastPrice = showBox.find('#lastPrice');
    let boxLikeButton = showBox.find('#like');
    let watchButton = showBox.find('button.view');
    changeBoxID(showBox, element);
    changeImage(boxImage, element);
    changeTitle(boxTitle, element);
    changeRate(boxRate, element);
    changePrice(boxPrice, boxLastPrice, element);
    changeLikeButton(boxLikeButton, element);
    addAllToButtonData(watchButton, boxTitle.text(), boxLastPrice.text(), boxPrice.text(), boxImage.attr('src'));
}
function changeBoxID(showBox, element) {
    showBox.attr('data-id', element.attr('data-id'));
}
function changeImage(image, element) {
    image.attr('src', element.attr('src'));
}
function changeTitle(title, element) {
    title.text(element.attr('data-title'));
}
function changeRate(boxRate, element) {
    let goodRate = '<i class="fas fa-star"></i>';
    let badRate = '<i class="far fa-star"></i>';
    let currentRate = element.attr('data-rate');
    boxRate.children()
        .remove().prevObject
        .append(
            goodRate.repeat(+currentRate) +
            badRate.repeat(5 - currentRate)
        );
}
function changePrice(boxPrice, boxLastPrice, element) {
    boxPrice.text(element.attr('data-price'));
    boxLastPrice.text(element.attr('data-lastPrice'));
}
function changeLikeButton(boxLikeButton, element) {
    boxLikeButton.attr('data-id', element.attr('data-id'));
    if (isLiked(element.attr('data-id')) && boxLikeButton.hasClass('far')) {
        boxLikeButton.toggleClass('far fas active')
    } else if (!isLiked(element.attr('data-id')) && boxLikeButton.hasClass('fas')) {
        boxLikeButton.toggleClass('far fas active')
    }
}
function loadLikes() {
    let likes = localStorage.likes;
    if (likes) {
        return likes.split(' ');
    } else {
        return '';
    }
}
function isLiked(id) {
    return loadLikes().includes(id);
}
function initFirstElement(elements, showBox) {
    let $firstElement = elements.find('.slick-current');  // Work with slick
    $firstElement.toggleClass('active');
    changeBoxElement($firstElement, $(showBox));
}
function addLikeEvent(showBox, likeButton) {
    $(showBox).find(likeButton).click( (event) => {
        let $likeButton = $(event.currentTarget);
      if ($likeButton.hasClass('active')) {
          localStorage.likes = loadLikes().filter(el => el !== $likeButton.attr('data-id')).join(' ');
      } else {
          localStorage.likes += ' ' + $likeButton.attr('data-id');
      }
      $likeButton.toggleClass('active far fas').blur();
      return false;
  });
}
function addAllToButtonData(button, title, lastPrice, price, image) {
    button.attr({
        'data-title': title,
        'data-sale': lastPrice,
        'data-product-cost': price,
        'data-src': image,
    })
}
//<button type="button"  data-title="Aenean Ru Bristique" data-sale="" data-src="./../img/furniture/10.png"  data-product-cost="$15.00"  data-toggle="modal" data-target="#show-modal" class="button-view ml-2 px-2 py-1">Quick View</button>
initTooltips();
// $('#baskedModal').modal();
createProductGallery('#inner-gallery__tabs', '#inner-gallery__content');


$(document).ready(function(){
    // Add smooth scrolling to all links
    $('#navbarSupportedContent').find("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            let hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: ($(hash).offset().top - 95)
            }, 800, function(){

            });
        } // End if
    });
});