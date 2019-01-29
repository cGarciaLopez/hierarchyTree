var app = angular.module('app', ['ngResource']);

app.controller('appController', function ($scope, $http, dataResource) {
  $http.get('./mocks/c51239jk.json').then(function () {

    $scope.datosResource = dataResource.get();
    // Objeto que almacena los identificadores de los elementos seleccionados
    $scope.selected = [];
    $scope.clickedAccount =false;
    
    // Selecciona el (o los grupos completos)
    // marca el checkbox
    // deshabilita el checkbox
    // añade el identificador a la caja de elementos seleccionados
    $scope.checkAll = function(){
      console.log($scope.datosResource)
      $scope.datosResource.forEach(
        function(element){
          let _group = {};
          _group.group_name = element.group_name;
          _group.business_group_code = element.business_group_code;
          $scope.selected.push(_group)
        }
      )
      console.log($scope.selected)
    }

    $scope.uncheckAll = function () {
      $scope.selected = [];
    };

    $scope.exist = function (data, account, departament) {
      return $scope.selected.indexOf(data , account, departament) > -1;
    }

    $scope.addSelection = function (data) {
      var iddata = $scope.selected.indexOf(data);
      if (iddata > -1) {
        $scope.selected.splice(iddata, 1);
        $scope.removeAccount();
      } else {
        $scope.selected.push(data);
      }
    }

    $scope.addAccount = function (account) {
      iddata = $scope.selected.indexOf(data);
      var idaccount = $scope.selected.indexOf(account);
      if (idaccount > -1) {
        $scope.selected.splice(idaccount, 1);
      } else {
        $scope.selected.push(account);
      }
    }

    $scope.addDepartament = function (departament) {
      iddepartament = $scope.selected.indexOf(departament);
      if (iddepartament > -1) {
        $scope.selected.splice(iddepartament, 1);
      } else {
        $scope.selected.push(departament);
      }
    }

  });

});

app.factory('dataResource', function ($resource) {
  return $resource('./mocks/c51239jk.json',
    {},
    {
      get: { method: 'GET', isArray: true }
    })
});
