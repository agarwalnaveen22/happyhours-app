angular.module('starter.directives', [])
.directive("searchBox",function(){
  return {
    // restrict: 'A',
    link: function(scope,elem, attrs) {
      var open=false;
      angular.element(document.body).on('click',function(e) {
        var inThing =  e.target.id
        if (inThing!="muid" && open==true) {
          e.stopPropagation();
          // elem.find('a').css("display","block");
          elem.find('input').css("width","0%");
          elem.find('input').css("padding-left","0%");
          open=false;
          scope.$apply(attrs.searchBox);
        }
      })
      elem.on("click",function(){
        if(open==false){
          elem.find('input').css("width","100%");
          elem.find('input').css("padding-left","5%");
          // elem.find('a').css("display","none");
          open=true;
        }
        // console.log("clicked");
        // elem.children().first().css("width","100%");
      })

    }
  }
})