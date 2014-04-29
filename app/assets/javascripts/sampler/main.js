function HelloController($scope) {
  $scope.data = {
    hello: 'Aamua',
    world: 'Mualima'
  };

  $scope.changeHello = function() {
    $scope.data.hello = 'Iltapäevää';
  };

  $scope.rollbackHello = function() {
    $scope.data.hello = 'Uamua';
  };
}
