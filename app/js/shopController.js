(function(){

angular
    .module('app')
    .controller('StoreController',['$scope','$cookies','$http',storeController])
	.directive('customHeader', function(){
		return {
			restrict : 'E',
			templateUrl: '/app/html/header.html',
			replace: true
    	};
	})
	.directive('cartResume', function(){
		return {
			restrict : 'E',
			templateUrl: '/app/html/cartresume.html'
    	};
	});

function storeController($scope,$cookies,$http){
		$scope.products = [];
		getProducts();
		$scope.cart = [];
		$scope.count = 0;
	    $scope.total = 0;
		$scope.alert = '';
		
		if(!angular.isUndefined($cookies.get('total'))){
		  $scope.total = parseFloat($cookies.get('total'));
		}

		if (!angular.isUndefined($cookies.get('cart'))) {
		 		$scope.cart =  $cookies.getObject('cart');
		}

		if (!angular.isUndefined($cookies.get('count'))) {
		 		$scope.count =  $cookies.getObject('count');
		}
		
		$scope.addItemToCart = function(product){
		  
		 	if ($scope.cart.length === 0){
		 		product.count = 1;
		 		$scope.cart.push(product);
		 	} else {
				 
		 		var repeat = false;
		 		for(var i = 0; i< $scope.cart.length; i++){
		 			if($scope.cart[i].id === product.id){
		 				repeat = true;
		 				$scope.cart[i].count +=1;
		 			}
		 		}
		 		if (!repeat) {
		 			product.count = 1;
		 		 	$scope.cart.push(product);	
		 		}
		 	}
		 	var expireDate = new Date();
      		expireDate.setDate(expireDate.getDate() + 1);
		 	$cookies.putObject('cart', $scope.cart,  {'expires': expireDate});
		 	$scope.cart = $cookies.getObject('cart');
		 
		  	$scope.total += parseFloat(product.price);
      		$cookies.put('total', $scope.total,  {'expires': expireDate});
			$scope.count += 1;
			$cookies.put('count', $scope.count,  {'expires': expireDate});
			
			addAlert('Product added sucesfully');
		 };

		 $scope.removeItemCart = function(product){
		   
		   if(product.count > 1){
		     product.count -= 1;
		     var expireDate = new Date();
         	 expireDate.setDate(expireDate.getDate() + 1);
		     $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
 			 $scope.cart = $cookies.getObject('cart');
		   }
		   else if(product.count === 1){
		     var index = $scope.cart.indexOf(product);
 			 $scope.cart.splice(index, 1);
 			 expireDate = new Date();
       		 expireDate.setDate(expireDate.getDate() + 1);
 			 $cookies.putObject('cart', $scope.cart, {'expires': expireDate});
 			 $scope.cart = $cookies.getObject('cart');
		   }
		   
		    $scope.total -= parseFloat(product.price);
       		$cookies.put('total', $scope.total,  {'expires': expireDate});
			$scope.count -= 1;
			$cookies.put('count', $scope.count,  {'expires': expireDate});
			addAlert('Product removed sucesfully');
		   
		 };

		 $scope.emptyAlert = function(){
				$scope.alert = '';
		 };

		 function addAlert(message){
			 $scope.alert = '';
			 $scope.alert =message;
		 }

         function getProducts(){
             $http.get("http://localhost:8020/ces3/shop/products")
            .then(function(response) {
            $scope.products = response.data;
            });
         }

	}

    })();