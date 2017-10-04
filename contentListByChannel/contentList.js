(function () {

    var app = angular.module("demoApp");
    app.config(configure);
    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider
            .state({
                name: 'defaultSubject',
                component: 'subject',
                url: '/subject'
            })
            .state({
                name: 'subject',
                component: 'subject',
                url: '/subject/{subjectId}'
            });
    }

    app.component("subject", {
        templateUrl: "contentListByChannel/contentList.html",
        controller: "listViewController as vm",
        bindings: {
            contentId: '<',
            getContentInfo: '&',
            likesCount: '&'
        }
    });
})();


(function () {

    var app = angular.module("demoApp");

    app.controller('listViewController', listViewController);

    listViewController.$inject = ['listViewService', '$state', '$stateParams'];


    function listViewController(listViewService, $state, $stateParams) {
        var vm = this;
        vm.$onInit = _init;
        vm.channels = [];
        vm.contentList = [];
        vm.busy = false;
        vm.changeValue = _changeValue;
        vm.selectChannelId = +$stateParams.subjectId;
        vm.subjectId = false;
        vm.loadMore = _getContentList;

        vm.subjectInfo = {
            'subjectId': +$stateParams.subjectId,
            'itemNum': 4,
            'pageNum': 0
        };

        vm.pageInfo = {
            'itemNum': 4,
            'pageNum': 0
        }


        function _init() {
            listViewService.getCategoryList().then(_getListSuccess, null);
        }


        function _getContentError() {
            alert("getting all content list error");
        }


        function _getListSuccess(response) {

            for (var i = 0; i < response.data.items.length; i++) {
                var subject = response.data.items[i];
                vm.channels.push({ 'id': subject.id, 'category': subject.category });
            }
        }


        function _changeValue() {
            //request contents from selected subject info
            _getContentList();
            $state.go('subject', { subjectId: vm.selectChannelId });
        }


        function _getContentList() {
            if (vm.busy) return;
            vm.busy = true;

            if (!vm.selectChannelId) {
                listViewService.getAllContents(vm.pageInfo).then(_getContentSuccess, _getContentError);
            } else {
                listViewService.getContentList(vm.subjectInfo).then(_getSuccess, _getError);
            }
        }


        function _getContentSuccess(response) {
            if (response.data.items != null) {
                vm.subjectId = true;
                for (i = 0; i < response.data.items.length; i++) {
                    vm.contentList.push(response.data.items[i]);
                }
                vm.pageInfo.pageNum = vm.pageInfo.pageNum + 1;
                vm.busy = false;
            } else {
                //stop infinite scroll if response is null
                vm.busy = true;
            }
        }


        function _getContentError() {;
            vm.busy = true;
        }


        function _getSuccess(response) {

            if (response.data.items != null) {
                vm.subjectId = true;
                for (i = 0; i < response.data.items.length; i++) {
                    vm.contentList.push(response.data.items[i]);
                }
                vm.subjectInfo.pageNum = vm.subjectInfo.pageNum + 1;
                vm.busy = false;
            } else {
                //stop infinite scroll if response is null
                vm.busy = true;
            }
        }


        function _getError() {
            vm.busy = true;
        }
    }
})();