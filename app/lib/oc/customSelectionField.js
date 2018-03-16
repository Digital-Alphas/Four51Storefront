angular.module('PremierPrint-CustomSelectionField', []);
angular.module('PremierPrint-CustomSelectionField')
    .filter('customSelectionFieldGroupFilter', customSelectionFieldGroupFilter)
    .filter('customSelectionFieldSpecFilter', customSelectionFieldSpecFilter)
    .directive('customselectionfield', ['$timeout','$filter', function ($timeout,$filter) {
        return {
            restrict: 'E',
            require: [
              '?customselectionfield'
            ],
            link: function (scope, element) {
                $timeout(function(){
                    //Get all static specs
                    var staticSpecGroups =  //Static product page
                                            (scope.LineItem && scope.LineItem.Product && scope.LineItem.Product.StaticSpecGroups) ? scope.LineItem.Product.StaticSpecGroups :
                                            //Variable Product
                                            (scope.Product && scope.Product.StaticSpecGroups) ? scope.Product.StaticSpecGroups : 
                                            //Variable Product - Matrix
                                            (scope.matrixitem && scope.matrixitem.Product && scope.matrixitem.Product.StaticSpecGroups) ? scope.matrixitem.Product.StaticSpecGroups : null;

                    if(staticSpecGroups){

                        //Get customselectionfield specs
                        var customOtherSpecs =  $filter('customSelectionFieldGroupFilter')(staticSpecGroups, 'CustomSelectionFieldOtherDisplay');

                        //set custom placeholder
                        if(customOtherSpecs){
                            
                            //Get the radio labels
                            var radioLabels = element.find("label.radio-label");
                            angular.forEach(radioLabels, function(lbl) {
                                //set custom label
                                var display = $filter('customSelectionFieldSpecFilter')(customOtherSpecs, lbl.id);
                                if(display) {
                                    var spn = $(lbl).find("span.Other");
                                    spn.html(display);
                                }
                            });
                            
                            //Get the other dropdown options
                            var dropdowns = element.find("select");
                            angular.forEach(dropdowns, function(ddl) {
                                //set the custom text value
                                var display = $filter('customSelectionFieldSpecFilter')(customOtherSpecs, ddl.name);
                                if(display) {
                                    var opt = $(ddl).find("option[value='Other']");
                                    if(opt != null) opt.text(display);
                                }
                            });
                        }
                        
                    }
                });
            }
          };
    }]);
;

function customSelectionFieldGroupFilter(){
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

function customSelectionFieldSpecFilter() {
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