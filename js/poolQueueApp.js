

// A Controller for your app
var MainController = function($scope, $interval, Parse) {
    $scope.addUser = function () {
        var queueEntry = new Parse.Queue();
        queueEntry.set('name', $scope.userName);
        queueEntry.save().then(function(){
            $scope.fetchQueue();
        });
        $scope.userName = "";

    };

    $scope.fetchQueue = function () {
        var queueQuery = new Parse.Query(Parse.Queue);
        queueQuery.find({
            success: function(results) {
                $scope.$apply(function() {
                    $scope.queue = results;
                    $scope.queueLength = results.length;
                });
            },
            error: function(error) {
                $scope.error = error;
            }
        });
    };

    $scope.removeFromQueue = function(item) {
        item.destroy({
            success: function() {
                $scope.fetchQueue();
            },
            error: function(error){
                $scope.error = error;
            }
        });

    };

    $scope.removeAll = function(){
        Parse.Queue.destroyAll($scope.queue, {
            success: function() {
                $scope.fetchQueue();
            },
            error: function(error){
                $scope.error = error;
            }
        });
    };

    $scope.fetchQueue();
    $interval($scope.fetchQueue, 30000);
};

var ConfirmButton = function() {
    return {
        scope: {
            action: '&',
            item: '='
        },
        replace: true,
        transclude: true,
        template: '<button ng-transclude></button>',
        link: function(scope, element, attrs) {
            var button = element;
            button.bind('click', function(){
                button.removeClass("btn-default");
                button.addClass("btn-danger");
                button.text("Are you sure?");
                button.unbind().bind('click', function() {
                    scope.action({item: scope.item});
                });
            });
        }
    };
};

angular.module('poolQueue', [])
    .factory('Cookie', function() {
        var userId = getCookie("userId");
        if (!userId) {
            userId = navigator.userAgent + "__" + Math.random();
            setCookie("userId", userId , 365);
        }
        return {
            userId : userId
        };
    })
    .factory('Parse', function(){
        Parse.initialize("IEnKKbGzw2nj0NsUjwPeBboTuG6HePdAJqFA0Lyj", "uhrhFKOg8xNhluefffKFsXF47X7JHR2ZzvzeAxfy");
        return {
            Queue: Parse.Object.extend('queue'),
            Query: Parse.Query
        };
    })
    .controller("MainController", ['$scope', '$interval', 'Parse', MainController])
    .directive("confirmButton", [ConfirmButton])
;


