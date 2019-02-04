var app = angular.module('app', ['ngResource']);

app.controller('appController', function ($scope, $http, dataResource) {
  $http.get('./mocks/c51239jk.json').then(function () {

    $scope.datosResource = dataResource.get();
    // Objeto que almacena los identificadores de los elementos seleccionados
    $scope.selected = [];
    $scope.selectedGroup = null;
    $scope.clickedGroup = false;
    $scope.clickedAccount = false;
    $scope.clickedDepartament = false;

    $scope.selectGroup = function (_group) {
      $scope.selectedGroup = _group;
    }

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
      console.log("addSelection");
      var iddata = $scope.selected.indexOf(data);
      if (iddata > -1) {
        $scope.selected.splice(iddata, 1);
        $scope.removeAccount();
      } else {
        $scope.selected.push(data);
      }
    }

    $scope.addAccount = function (data, account) {
      console.log("addAccount");
      // DOING: comprobar si alguno de los departamentos (account.departaments) está seleccionado ($scope.selected)
      $scope.deleteDepartments(account.departaments)

      var idaccount = $scope.selected.indexOf(account);
      if (idaccount > -1) {
        $scope.selected.splice(idaccount, 1);
      } else {
        $scope.selected.push(account);
      }
    }

    $scope.addDepartament = function (departament) {
      console.log("addDepartament");
      iddepartament = $scope.selected.indexOf(departament);
      if (iddepartament > -1) {
        $scope.selected.splice(iddepartament, 1);
      } else {
        $scope.selected.push(departament);
      }
    }

    // Elimina los departamentos de una cuenta que estén en "$scope.selected"
    $scope.deleteDepartments = function(_departments){
        _departments.map(
          function(_dept){
              if( $scope.selected.indexOf(_dept) > -1){
                $scope.selected.splice( $scope.selected.indexOf(_dept),1 )
              }
          });
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
