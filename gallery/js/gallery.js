

$(document).ready(function() {
    $.getJSON("js/images.json", function(data) {
        $.each(data.images, function(key,v) {
            output=$("#gallery").append('<div class="col-md-4 ' + v.category + '"><a href="#" class="pop"><img id="myImg" class="img-responsive imgStyle" src="' + v.url + '" alt="' + v.caption + '"/></a></div>');
        });
    });
    
  $('.prev').on('click', function(){
    var prevImg = $('img.active').prev('.slider-inner img');
    if(prevImg.length == 0) {
      prevImg = $('.slider-inner img:last');
    }
    $('img.active').removeClass('active');
    prevImg.addClass('active');
  });
    
  $('.next').on('click', function() {
    var nextImg = $('img.active').next('.slider-inner img');
    if(nextImg.length == 0) {
      nextImg = $('.slider-inner img:first');
    }
    $('img.active').removeClass('active');
    nextImg.addClass('active');
  });
    
    
  
    
    $('#filter-dogs').change(function(){
        if ($('#filter-dogs').is(':checked')){
            $('.dogs').show();        }
        else{
            $('.dogs').hide();
        }
    });

    $('#filter-eats').change(function(){
        if ($('#filter-eats').is(':checked')){
            $('.eats').show();        }
        else{
            $('.eats').hide();
        }
    });
    
    $('#filter-dance').change(function(){
        if ($('#filter-dance').is(':checked')){
            $('.dance').show();        }
        else{
            $('.dance').hide();
        }
    });
    
    
    $("#dogpic").click(function(){
        $('#filter-dogs').prop( "checked", true );
        $('.dogs').show(); 
        $('#filter-eats').prop( "checked", false );
        $('.eats').hide(); 
        $('#filter-dance').prop( "checked", false );
        $('.dance').hide(); 
    });
    
    $("#eatspic").click(function(){
        $('input[value="eats"]').prop( "checked", true );
        $('.eats').show();
        $('#filter-dogs').prop( "checked", false );
        $('.dogs').hide(); 
        $('#filter-dance').prop( "checked", false );
        $('.dance').hide(); 
    });
    
    $("#dancepic").click(function(){
        $('input[value="dance"]').prop( "checked", true );
        $('.dance').show();
        $('#filter-dogs').prop( "checked", false );
        $('.dogs').hide(); 
        $('#filter-eats').prop( "checked", false );
        $('.eats').hide(); 
    });
    
    
    $('#gallery').on('click','#myImg',function(){
        $('#myModal').css("display","block");
        $("#img01").src=$(this).src
        $("#caption").html($(this).alt);

    });

    $('.close').on("click",function() { 
      $('#myModal').css("display","none");
    });

});


// License: This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
