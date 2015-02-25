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
                    //Built in angular form properties begin with $ including our $processFormRows and $cleanupRows so we only care if actual form elements are added                    
                    if (val > Object.keys(ctrl).filter(function (i) { return i.substring(0, 1) == "$"; }).length) {
                        //Use the index to find item in ng-repeat's array and set it equal to scope.$id using regex to pase attrs.ng-repeat
                        var expression = attrs.ngRepeat;
                        var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                        var sourceList = match[2];
                        var splitSourceList = sourceList.split(".");
                        var pointer = scope.$parent.$parent;
                        //Work with nested properties such as Object.Property
                        for (var i = 0; i < splitSourceList.length; i++) {
                            if (pointer[splitSourceList[i]]) {
                                pointer = pointer[splitSourceList[i]];
                            }                                          
                        }
                        //Assign the uniqueId of the form control to the source array item so it can be tracked
                        if (pointer[scope.$parent.$index]) {
                            pointer[scope.$parent.$index]["uniqueId"] = scope.$id;                            
                        }

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
