icisNg.directive('ngForm', function () {
    return {
        restrict: 'A',
        require: 'form',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$processFormRows = function () {
                var rowKeys = Object.keys(ctrl).filter(function (i) { return i.substring(0, 1) != "$" && i != "form"; });
                if (rowKeys.length > 1) {
                    var lastRowKey = rowKeys[0].substring(rowKeys[0].length - 3, rowKeys[0].length);
                    var cleanArray = [];
                    var cleanObject = {};
                    for (var i = 0; i < rowKeys.length; i++) {
                        if (lastRowKey != rowKeys[i].substring(rowKeys[i].length - 3, rowKeys[i].length)) {
                            lastRowKey = rowKeys[i].substring(rowKeys[i].length - 3, rowKeys[i].length);
                            cleanArray.push(cleanObject);
                            cleanObject = {};
                        }

                        cleanObject[rowKeys[i].substring(0, rowKeys[i].length - 4)] = ctrl[rowKeys[i]];
                        cleanObject["rowKey"] = lastRowKey;
                    }
                    cleanArray.push(cleanObject);
                    cleanObject = {};

                    return cleanArray;
                }

                return null;
            }

            ctrl.$cleanupRows = function (rowId) {
                var rows = ctrl.$processFormRows();
                if (rows) {
                    if (rowId == undefined) {
                        for (var i = 0; i < rows.length; i++) {
                            var rowKeyToRemove = rows[i].rowKey;
                            var keys = Object.keys(rows[i]).filter(function (i) { return i != "rowKey"; }).map(function (i) { return i + "_" + rowKeyToRemove; });
                            for (var j = 0; j < keys.length; j++) {
                                delete ctrl[keys[j]];
                            }
                        }
                    } else {
                        var rowToRemove = rows.filter(function (i) { return i.rowKey == rowId; })[0];                        
                        var keys = Object.keys(rowToRemove).filter(function (i) { return i != "rowKey"; }).map(function (i) { return i + "_" + rowId; });                        
                        for (var i = 0; i < keys.length; i++) {
                            delete ctrl[keys[i]];
                        }
                    }
                }
            }
        }
    }
});
