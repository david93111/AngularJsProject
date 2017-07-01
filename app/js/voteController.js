(function(){

    angular
    .module('app')
    .controller('VoteController',['$scope','$http',voteController])

    function voteController($scope,$http){
		$scope.candidates = [];
		getCandidates();
		$scope.alert = '';

        $scope.voteForCandidate = function(candidate){
            $http.put("http://localhost:8020/ces3/vote/"+candidate.username)
            .then(function(response) {
                addAlert('Vote added sucesfully');
                $scope.candidates = response.data;
                getCandidates();
            });
        }

		 $scope.emptyAlert = function(){
				$scope.alert = '';
		 };

		 function addAlert(message){
			 $scope.alert = '';
			 $scope.alert =message;
		 }

         function getCandidates(){
             $http.get("http://localhost:8020/ces3/vote/candidates")
            .then(function(response) {
            $scope.candidates = response.data;
            });
         }

	};

})();