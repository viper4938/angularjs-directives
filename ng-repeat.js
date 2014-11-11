icisNg.directive('ngRepeat', function () {
    return {        
        restrict: 'A',
        require: "?form",
        link: function (scope, element, attrs, ctrl) {                        
            if (ctrl) {                                                
                var formKeysArray = Object.keys(scope).filter(function (keyItem) {
                    return keyItem.substring(0, 4) == 'form';
                });
                
                var destroyMe = scope.$watch(function () { return Object.keys(scope[formKeysArray]).length; }, function (val) {                    
                    //There are 11 basic built in form properties and methods so we only care if actual form elements are added (a count above 11)
                    if (val > 11) {
                        for (var i = 0; i < formKeysArray.length; i++) {
                            var propertyKeysArray = Object.keys(scope[formKeysArray[i]]).filter(function (keyItem) {
                                return keyItem.substring(0, 1) != '$' && keyItem != 'this';
                            });
                            
                            for (var j = 0; j < propertyKeysArray.length; j++) {
                                if (scope.$parent.$parent.form) {
                                    scope.$parent.$parent.form[propertyKeysArray[j] + "_" + scope.$id] = scope[formKeysArray[i]][propertyKeysArray[j]];
                                    var newName = propertyKeysArray[j] + "_" + scope.$id;
                                    $(element).find("[name='" + propertyKeysArray[j] + "']").attr('name', newName);
                                    scope.$parent.$parent.form[propertyKeysArray[j] + "_" + scope.$id].$name = newName;
                                }
                            }

                            destroyMe();                                                        
                        }
                    }
                });

                element.on('$destroy', function () {
                    destroyMe();
                });
            }
        }
    };
});