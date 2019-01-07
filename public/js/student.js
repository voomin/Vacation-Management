
(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    $(".day").hide().fadeIn(1500);
    /*==================================================================
    [ studentpage ]*/
    $(".rest_start").change(function(){
        var val=$(this).val();
        var day=new Date(val);
        startDay=day.valueOf();
        betweenDay();
    });
    $(".rest_end").change(function(){
        var val=$(this).val();
        var day=new Date(val);
        endDay=day.valueOf();
        betweenDay();
    });

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
    /*==================================================================
    [ myinfo_student]*/
    
    
})(jQuery);


/*==================================================================
JavaScript 함수들 .. */
var startDay;
var endDay;
var betweenDay=()=>{
    var n=endDay-startDay;
    if(n>=0){
        var bDay=new Date(n);
        var num=bDay.getDate();
        $(".rest_num").html(num);
    }else{
        //console.log($(".rest_end").val());
        if($(".rest_end").val()!="")
        $(".rest_num").html("시작 날짜와 종료 날짜를 정확히 입력 해 주세요.");
    }
};