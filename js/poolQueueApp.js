

// A Controller for your app
var MainController = function($scope, $timeout, $interval, $cookies, Parse) {
    $scope.myId = $cookies.myId || "";

    $scope.addUser = function () {
        if ($scope.userName) {
            var queueEntry = new Parse.Queue();
            queueEntry.set('name', $scope.userName);
            queueEntry.save().then(function(result){
                $scope.fetchQueue();
                $scope.myId = result.id;
                $cookies.myId = result.id;

                /**
                 * Should move this to
                 */
                $timeout(function() {
                    $('html, body').animate({
                        scrollTop: $("#" + result.id).offset().top
                    }, 400);
                }, 300);
            });
            $scope.userName = "";
        }

    };



    $scope.fetchQueue = function () {
        $scope.error = undefined;
        var queueQuery = new Parse.Query(Parse.Queue);
        queueQuery.find({
            success: function(results) {
                $scope.$apply(function() {
                    $scope.queue = results;
                    $scope.queueLength = Math.max(results.length - 1, 0);
                    for (var i =0 ; i < 2 && i < results.length; i++) {
                        results[i].set('playing', true);
                    }
                });
            },
            error: function(error) {
                $scope.$apply(function() {
                    $scope.error = error;
                });
            }
        });
    };

    $scope.removeFromQueue = function(item) {
        item.destroy({
            success: function() {
                $scope.fetchQueue();
            },
            error: function(error){
                $scope.$apply(function() {
                    $scope.error = error;
                });
            }
        });

    };

    $scope.removeAll = function(){
        Parse.Queue.destroyAll($scope.queue, {
            success: function() {
                $scope.fetchQueue();
            },
            error: function(error){
                $scope.$apply(function() {
                    $scope.error = error;
                });            }
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
            button.bind('mouseenter', function(){
                button.removeClass("btn-default");
                button.addClass("btn-danger");
            });

            button.bind('mouseleave', function(){
                button.addClass("btn-default");
                button.removeClass("btn-danger");
            });

            button.bind('click', function() {
                scope.action({item: scope.item});
            });
        }
    };
};

angular.module('poolQueue', ['ngCookies'])
    .config (function($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .factory('Parse', function(){
        Parse.initialize("IEnKKbGzw2nj0NsUjwPeBboTuG6HePdAJqFA0Lyj", "uhrhFKOg8xNhluefffKFsXF47X7JHR2ZzvzeAxfy");
        return {
            Queue: Parse.Object.extend('queue'),
            Query: Parse.Query
        };
    })
    .controller("MainController", ['$scope', '$timeout', '$interval', '$cookies', 'Parse', MainController])
    .directive("confirmButton", [ConfirmButton])
;


