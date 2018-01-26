angular.module('PremierPrint-CustomTextField', []);
angular.module('PremierPrint-CustomTextField')
    .filter('customTextFieldGroupFilter', customTextFieldGroupFilter)
    .filter('customTextFieldSpecFilter', customTextFieldSpecFilter)
    .directive('customtextfield', ['$timeout','$filter', function ($timeout,$filter) {
        return {
            restrict: 'E',
            require: [
              '?customtextfield'
            ],
            link: function (scope, element) {
                $timeout(function(){
                    //Get all static specs
                    var staticSpecGroups =  //Static product page
                                            (scope.LineItem && scope.LineItem.Product && scope.LineItem.Product.StaticSpecGroups) ? scope.LineItem.Product.StaticSpecGroups :
                                            //Variable Product
                                            (scope.Product && scope.Product.StaticSpecGroups) ? scope.Product.StaticSpecGroups : 
                                            //Variable Product - Matrix
                                            (scope.matrixitem.Product && scope.matrixitem.Product.StaticSpecGroups) ? scope.matrixitem.Product.StaticSpecGroups : null;

                    if(staticSpecGroups){

                        //Get customtextfield specs
                        var customPlaceholderSpecs =  $filter('customTextFieldGroupFilter')(staticSpecGroups, 'CustomTextFieldPlaceholder');
                        var customMaskSpecs =  $filter('customTextFieldGroupFilter')(staticSpecGroups, 'CustomTextFieldMask');

                        //Get the input element
                        var textfields = element.find("input, textarea");
                            
                        angular.forEach(textfields, function(textfield) {
                            
                            //set custom placeholder
                            if(customPlaceholderSpecs){
                                var placeholder = $filter('customTextFieldSpecFilter')(customPlaceholderSpecs, textfield.name);
                                if(placeholder) textfield.placeholder = placeholder;
                            }
                            
                            //set custom mask
                            if(customMaskSpecs){
                                var mask = $filter('customTextFieldSpecFilter')(customMaskSpecs, textfield.name);
                                if(mask) $(textfield).mask(mask);
                            }
                            
                        });
                    }
                });
            }
          };
    }]);
;

function customTextFieldGroupFilter(){
    return function (specGroups, groupName) {
        var result = "";
        angular.forEach(specGroups, function(group) {
            if(group.Name && group.Name.toUpperCase() == groupName.toUpperCase()){
                result = group.Specs;
            }
        });
        return result;
    }
}

function customTextFieldSpecFilter() {
    return function (specs, specName) {
        var result = "";
        angular.forEach(specs, function(spec) {
            if(spec.Name && spec.Name.toUpperCase() == specName.toUpperCase()){
                result = spec.Value;
                return result;
            }
        });
        return result;
    }
}