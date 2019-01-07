(function ($) {
    "use strict";
    $(".m2").hide();
    $(".m1:nth-child("+select_M1_index+") .m2").show();
    /*==================================================================
    [ Validate ]*/
    $(".m1").click(function(){
        var index=$(this).index()+1;
        $(".m1:nth-child("+index+") .m2").slideToggle();
    });
    /*==================================================================
    [ adminpage ]*/
    $(".vacation").hover(
        function() {
            $( this ).addClass("select");
          },
        function() {
            $( this ).removeClass("select");
        }
    );
    $(".vacation .consent").hover(
        function(event) {
            //var x=event.originalEvent.clientX;
            //var y=event.originalEvent.clientY;
            $(this).append("<div class='msg'>승인</div>");
          },
        function() {
            $(".msg").remove();
            
        }
    );
    $(".vacation .cancle").hover(
        function(event) {
            var x=event.originalEvent.clientX;
            var y=event.originalEvent.clientY;
            $(this).append("<div class='msg'>반려</div>");
          },
        function() {
            $(".msg").remove();
        }
    );
    $(".vacation").click(function(){
        var index=$(this).index()+1;
        $(".vacation:nth-child("+index+") .info").slideToggle();
        $(".vacation:nth-child("+index+") span").fadeToggle();
    });
    
    $(".vacation-null").hover(
        function() {
            $( this ).animate({
                opacity: '0.5'
            });
          },
        function() {
            $( this ).animate({
                opacity: '1.0'
            });
        }
    );
    /*==================================================================
    [ vacation]*/
    $(".board th").hover(
        function() {
            $( this ).toggleClass("select");
          },
        function() {
            $( this ).toggleClass("select");
        }
    );
    $(".board tr").hover(
        function() {
            $( this ).toggleClass("select");
          },
        function() {
            $( this ).toggleClass("select");
        }
    );
    /*==================================================================
    [ select 할때]*/
    //setting();
    $(".board th").click(function(){
        
    });
    $(".title").click(function(){
        //$(".search").val("").css( 'cursor', 'wait' );
        //$(".vacation-null").hide();
        //$(".board tr").show();
    });
    $(".search").change(function(){
        var str=$(this).val();
        search(str);
    });
})(jQuery);


/*==================================================================
JavaScript 함수들 .. */
var table=[];
function setting(){
    var str=$(".board tbody").html();
    str=str.slice(str.indexOf("</tr>"));
    str=str.replace(/<td>/gi, ""); 
    str=str.replace(/<tr>/gi, ""); 
    str=str.replace(/<\/tr>/gi, ""); 
    str=str.replace(/\s/gi, ""); 
    str=str.split("</td>");
    console.log(str);
}
function search(str){
    var len=$(".board tr").length;
    var hideCount=0;
    for(i=2;i<=len;i++){
        var doc=$(".board tr:nth-child("+i+")");
        var s=doc.html();
        var index=s.indexOf(str);
        if(index<0){
            doc.hide();
            hideCount++;
        }else{
            doc.show();
            $(".vacation-null").hide();
        }
    }
    if(hideCount==len-1)//검색결과가 없을때,
        $(".vacation-null").hide().fadeIn(300);
}