(function () {

    angular.module("BWProject")
        .component("recentContent", {
            templateUrl: 'RecentContentTag/recent-content.html',
            controller: 'recentContentController as vm',
            bindings: {
                contentId: '<',
                getContentInfo: '&',
                likesCount: '&'
            }
        });
})();

(function () {

    angular.module("BWProject")
        .controller('recentContentController', recentContentController)

    recentContentController.$inject = ['listViewService', '$state'];

    function recentContentController(listViewService, $state) {

        var vm = this;
        vm.$onChanges = _init;
        vm.contentIds = [];

        function _init() {
            listViewService.getRecentContents().then(_getContentSuccess, _getContentError);
        }

        function _getContentSuccess(response) {
            for (i = 0; i < 8; i++) {
                vm.contentIds.push(response.data.items[i]);
            }
        }

        function _getContentError() {
            console.log("Error on getting recent content list");
        }

    }
})();
