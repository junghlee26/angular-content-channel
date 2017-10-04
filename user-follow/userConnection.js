
(function () {
    "use strict";
    var app = angular.module('BWProject');

    app.config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider
            .state({
                name: 'followingList',
                component: 'followingList',
                url: '/following'
            })
            .state({
                name: 'followerList',
                component: 'followerList',
                url: '/follower'
            });
    }

    app.component("followingAvatar", {
        templateUrl: 'user-follow/followingAvatar.html',
        controller: 'followingAvatarController as vm',
        bindings: {
            userId: '<',
            getData: '=',
            getConnectionInfo: '&',
            onRemove: '&'
        }
    });

    app.component("followerAvatar", {
        templateUrl: 'user-follow/followerAvatar.html',
        controller: 'followerAvatarController as vm',
        bindings: {
            userId: '<',
            getData: '=',
            getConnectionInfo: '&',
        }
    });

    app.component("followingList", {
        templateUrl: 'user-follow/followingList.html',
        controller: 'followingController as vm',
        bindings: {
            userId: '<',
            includeFollowButton: '<',

        }
    });
    app.component("followerList", {
        templateUrl: 'user-follow/followerList.html',
        controller: 'followerController as vm',
        bindings: {
            userId: '<',
            includeFollowButton: '<',
            getConnectionInfo: '&',
        }
    });
})();


(function () {

    "use strict";
    var app = angular.module('BWProject');

    app.service('followService', followService);

    followService.$inject = ['$http'];


    function followService($http) {

        function _getUserInfo(id) {
            var settings = {
                url: "/api/users/useravatar/" + id,
                method: 'GET',
                cache: false,
                responseType: 'json',
            };

            return $http(settings);
        };

        function _getFollowingInfo(data) {

            var settings = {
                url: "/api/Users1/following",
                method: 'POST',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data)
            };

            return $http(settings);
        };

        function _getFollowerInfo(data) {
            var settings = {
                url: "/api/Users1/follower",
                method: 'POST',
                cache: false,
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(data)
            };

            return $http(settings);
        };

        function _followUser(userId) {
            var data = {
                TargetId: userId,
                RelationType: 'follow',
                Private: true
            };
            var settings = {
                url: '/api/Users1/follow',
                method: 'POST',
                cache: false,
                data: data,
                responseType: 'json',
            };

            return $http(settings);
        }

        function _unFollowUser(id) {
            var settings = {
                url: '/api/Users1/delete/' + id,
                method: 'DELETE',
                cache: false,
                contentData: 'json/application; charset=UTF-8'
            }

            return $http(settings);
        }

        return {
            getUserInfo: _getUserInfo,
            getFollowingInfo: _getFollowingInfo,
            getFollowerInfo: _getFollowerInfo,
            unFollowUser: _unFollowUser,
            followUser: _followUser
        }
    }

})();

//FOLLOWING USER AVATART COMPONENT
(function () {

    "use strict";

    var app = angular.module('BWProject');

    app.controller('followingAvatarController', followingAvatarController);

    followingAvatarController.$inject = ['followService', '$uibModal'];

    function followingAvatarController(followService, $uibModal) {

        var vm = this;
        vm.userId;
        vm.id;
        vm.data = {};
        vm.$onChanges = _init;
        vm.unFollowUser = _unFollowUser;
        vm.followUser = _followUser;


        function _init() {
            vm.userId = vm.userId;
            vm.data = vm.getData;
            followService.getUserInfo(vm.userId).then(_getByIdSuccess, _getByIdError);
        };

        function _getByIdSuccess(response) {
            vm.src = response.data.imgUrl;
            vm.name = response.data.userName;
            vm.getConnectionInfo({ info: response.data });
            vm.data = vm.getData;
        }

        function _getByIdError(jqxhr) {
            console.log(jqxhr.responseType);
        }

        function _unFollowUser() {
            $uibModal.open({
                templateUrl: 'modal.html',
                controller: modalPopupController
            });

            modalPopupController.$inject = ['$scope', '$uibModalInstance']

            function modalPopupController($scope, $uibModalInstance) {

                $scope.btnRemove = function () {
                    followService.unFollowUser(vm.data.id).then(_unFollowSuccess, _unFollowError);
                    $uibModalInstance.close();
                };
                $scope.btnCancel = function () {
                    $uibModalInstance.close();
                };
            }

        }

        function _unFollowSuccess(response) {
            vm.onRemove();
        }

        function _unFollowError() {
            console.log("unFollow user error");
        }

        function _followUser() {
            followService.followUser(vm.userId).then(_followUserSuccess, _followUserError);
        }

        function _followUserSuccess(response) {
            console.log('followTheUserSuccess');
        }

        function _followUserError(jqxhr) {
            console.log(jqxhr.responseType);
            console.log('followTheUserError');
        }

    }
})();


//FOLLOWER USER AVATART COMPONENT
(function () {

    "use strict";

    var app = angular.module('BWProject');

    app.controller('followerAvatarController', followerAvatarController);

    followerAvatarController.$inject = ['followService', '$uibModal'];

    function followerAvatarController(followService, $uibModal) {

        var vm = this;
        vm.userId;
        vm.id;
        vm.data = {};
        vm.$onChanges = _init;
        vm.unFollowUser = _unFollowUser;
        vm.followUser = _followUser;


        function _init() {
            vm.userId = vm.userId;
            vm.data = vm.getData;
            followService.getUserInfo(vm.userId).then(_getByIdSuccess, _getByIdError);
        };

        function _getByIdSuccess(response) {
            vm.src = response.data.imgUrl;
            vm.name = response.data.userName;
            vm.getConnectionInfo({ info: response.data });
            vm.data = vm.getData;
        }

        function _getByIdError(jqxhr) {
            console.log(jqxhr.responseType);
        }

        function _unFollowUser() {
            $uibModal.open({
                templateUrl: 'modal.html',
                controller: modalPopupController
            });

            modalPopupController.$inject = ['$scope', '$uibModalInstance']

            function modalPopupController($scope, $uibModalInstance) {

                $scope.btnRemove = function () {
                    followService.unFollowUser(vm.data.id).then(_unFollowSuccess, _unFollowError);
                    $uibModalInstance.close();
                };
                $scope.btnCancel = function () {
                    $uibModalInstance.close();
                };
            }

        }

        function _unFollowSuccess(response) {
            vm.getData.following_Them = 0;
        }

        function _unFollowError() {
            console.log("unFollow user error");
        }

        function _followUser() {
            followService.followUser(vm.userId).then(_followUserSuccess, _followUserError);
        }

        function _followUserSuccess(response) {
            vm.getData.following_Them = 1;
            vm.getData.id = response.data.item;
        }

        function _followUserError(jqxhr) {
            console.log(jqxhr.responseType);
            console.log('followTheUserError');
        }

    }
})();

//GET ALL FOLLOWING LIST
(function () {

    "use strict";

    var app = angular.module('BWProject');

    app.controller('followingController', followingController);

    followingController.$inject = ['followService'];


    function followingController(followService) {

        var vm = this;
        vm.$onChanges = _init;
        vm.userList = [];

        var info = {
            itemNum: 20,
            pageNum: 0
        }


        function _init() {
            followService.getFollowingInfo(info).then(_getSuccess, _getError)
        }

        function _getSuccess(response) {
            console.log(response);
            if (response.data.items) {
                for (var i = 0; i < response.data.items.length; i++) {
                    vm.userList.push(response.data.items[i]);
                }
            }
        }

        function _getError(response) {
            console.log(response);
        }

        vm.onRemove = function (index) {
            vm.userList.splice(index, 1);
        }

    }
})();

//GET ALL FOLLOWER LIST
(function () {

    "use strict";

    var app = angular.module('BWProject');

    app.controller('followerController', followerController);

    followerController.$inject = ['followService'];


    function followerController(followService) {

        var vm = this;
        vm.$onChanges = _init;
        vm.userList = [];

        var info = {
            itemNum: 20,
            pageNum: 0
        }

        function _init() {
            followService.getFollowerInfo(info).then(_getSuccess, _getError)
        }

        function _getSuccess(response) {
            if (response.data.items) {
                for (var i = 0; i < response.data.items.length; i++) {
                    vm.userList.push(response.data.items[i]);
                }
            }
        }

        function _getError(response) {
            console.log("getting follower list error");
        }

    }

})();


