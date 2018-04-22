var App = angular.module('App', ['angular-carousel', 'ngStorage', 'rt.popup']);

App.controller('MainController', function ($scope, $http, $sessionStorage) {
    // creating $scope var for convinience
    var vm = $scope;

    vm.backgroundImage = "https://cdn-images-1.medium.com/max/2000/1*wzEf4qVNT7mUeMIeQWTJbg.jpeg";

    vm.gitHubUserReposUrl = `https://api.github.com/search/repositories?q=`;
    // Creating arrays for repo information
    vm.userAvatar = [];
    vm.repoFullName = [];
    vm.repoShortName = [];
    // Creating array and index for carousel
    vm.slides = [];
    vm.carouselIndex = 0;

    vm.getData = function (repoName) {

        // Reseting the slides if the user searched for a different repo
        vm.slides = [];
        vm.carouselIndex = 0;

        //additional validation if somehow the user managed to search for empty or undefined string
        if (repoName != undefined && repoName != "") {
            // calling the github api with url and repo searched by user
            $http.get(vm.gitHubUserReposUrl + repoName).then(function (data) {
                var items = data.data.items;
                for (var i = 0; i < items.length; i++) {
                    vm.userAvatar[i] = items[i].owner.avatar_url;
                    vm.repoFullName[i] = items[i].full_name;
                    vm.repoShortName[i] = items[i].name;
                }
                addSlides(items.length);
            });
        }
    }

    /* 
		Carousel function creating a slide array of objects containing:
		vm.slided[i] : {
						id : id for counter,
						img : User Avatar,
						fullname : User Name + '/' + Repository Name,
						shortname : Repository Name
					}
	*/
    function addSlides(qty) {
        for (var i = 0; i < qty; i++) {
            vm.slides.push({
                id: (i + 1),
                img: vm.userAvatar[i],
                fullName: vm.repoFullName[i],
                shortName: vm.repoShortName[i]
            });
        }
    }
    vm.allRepositories = [];
    $sessionStorage.repositories = [];
    // var to pass data to popup
    vm.repositories = [];
    // Bookmarking function receiving param from html ng-click
    vm.bookmarkRepo = function (repo) {
        if (vm.allRepositories.includes(repo)) {
            alert("Bookmark already saved!");
        } else {
            vm.allRepositories.push(repo);
            $sessionStorage.repositories.push(repo);
            vm.repositories = $sessionStorage.repositories;
        }
    }
});