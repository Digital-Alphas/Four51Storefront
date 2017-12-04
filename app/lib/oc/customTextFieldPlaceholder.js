angular.module('PremierPrint-CustomTextFieldPlaceholder', []);
angular.module('PremierPrint-CustomTextFieldPlaceholder')
    .directive('customtextfield', customtextfield)
    .filter('placeholderFilter', placeholderFilter)
;

//customize existing customtextfield directive
function customtextfield($timeout,$filter) {
  return {
    restrict: 'E',
    require: [
      '?customtextfield'
    ],
    link: function (scope, element) {
        $timeout(function(){
            if(scope.LineItem && scope.LineItem.Product && scope.LineItem.Product.StaticSpecGroups){
                var textfields = element.find("input, textarea");
                angular.forEach(textfields, function(textfield) {
                    var placeholder = $filter('placeholderFilter')(scope.LineItem.Product.StaticSpecGroups, 'CustomTextFieldPlaceholder', textfield.name);
                    if(placeholder) textfield.placeholder = placeholder;
                });
            }
        });
    }
  };
}

function placeholderFilter() {
    return function (specGroups, groupName, specName) {
        var result = "";
        angular.forEach(specGroups, function(group) {
            if(group.Name && group.Name.toUpperCase().indexOf(groupName.toUpperCase()) > -1){
                angular.forEach(group.Specs, function(spec) {
                    if(spec.Name && spec.Name.toUpperCase().indexOf(specName.toUpperCase()) > -1){
                        result = spec.Value;
                        return result;
                    }
                });
            }
        });
        return result;
    }
}