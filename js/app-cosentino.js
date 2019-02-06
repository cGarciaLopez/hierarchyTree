var app = angular.module('app', ['ngResource']);

app.controller('appController', function ($scope, $http, dataResource) {
  $http.get('./mocks/c51239jk.json').then(function () {


     // TODO:
     //    BUSCAR
        // ¡ Revisarrrr!
     //    SELECCIONAR TODO
            // Selecciona todas las cuentas, pasando solo la raiz de la cuenta, no los departamentos.
     //    DESELECCIONAR TODO
            // Facil, borra todo!
     //    SELECCIONAR EL GRUPO ENTERO


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
    // marca los checkboxes del arbol
    // deshabilita los checkboxes
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
    $scope.existe = function (data, account, department) {
      if(department !== undefined){
        if($scope.selected.indexOf(data , account, department) > -1){
          console.log(department);
        }
        return $scope.selected.indexOf(data , account, department) > -1;
      }
    }
    // Selección por el usuario de un grupo
    $scope.addGroup = function (data) {
      console.log("addGroup");
      let iddata = $scope.selected.indexOf(data);
      if (iddata > -1) {
        $scope.selected.splice(iddata, 1);
        // $scope.removeAccount();
      } else {
        let _group = {};
        _group.group_name=data.group_name;
        _group.business_group_code=data.business_group_code;
        $scope.selected.push(_group);
      }
    }

    // El usuario ha seleccionado una cuenta.
    // Se pasan todos los departamentos al panel de seleccion.
    // Se deshabilitan los checkboxes de los departamentos (NO de la cuenta)
    // Se añaden SOLO los departamentos a la variable de entorno (selected)
    $scope.selectAccount = function (data, account, selecc) {
      console.log("selectAccount, cuenta seleccionada: " + selecc);
      // CASO 1: seleccion de la cuenta
      //   caso 1.1: existe el departamento iterado. Se salta a la siguiente iteración
      //   caso 1.2: NO existe el departamento seleccionado. Se añade el departamento
      // CASO 2: deseleccion de la cuenta
      //   caso 2.1  si existen departamentos, se eliminan.
      account.departaments.forEach(
        function(dept){
          console.log(dept.departament_name)
          let idDept = $scope.selected.indexOf(dept);
          if(selecc){
            // caso 1.2
            if(idDept == -1){
              $scope.selected.push(dept);
              // $scope.clickedDepartament = true;
              document.getElementById(dept.departament_name + dept.departament_code).checked=true;
            }
          }else {
            // caso 2.1
            if(idDept > -1){
              $scope.selected.splice(idDept, 1);
              // $scope.clickedDepartament = false;
              document.getElementById(dept.departament_name + dept.departament_code).checked=false;
            }
          }
        }
      )
    }

    $scope.addDepartament = function (departament) {
      console.log("addDepartament");
      iddepartament = $scope.selected.indexOf(departament);
      if (iddepartament > -1) {
        $scope.selected.splice(iddepartament, 1);
        // $scope.clickedDepartament = false;
        document.getElementById(departament.departament_name + departament.departament_code).checked=false;
      } else {
        $scope.selected.push(departament);
        document.getElementById(departament.departament_name + departament.departament_code).checked=true;
        // $scope.clickedDepartament = true;
      }
    }

    // Se invoca desde el listado de elementos seleccionados
    $scope.delSelectedDept = function(department) {
      let oDept = document.getElementById(department.departament_name + department.departament_code);
      oDept.disabled=false;
      oDept.click()

      // Compruebo que hay departamentos de la cuenta seleccionados, de lo contrario hay que deschequear la cuenta.
      let _deptChecked = false;
      let aDepts = document.getElementsByName(oDept.name);
      for(var i=0; i < aDepts.length; i++){
        if(aDepts[i].checked){
          _deptChecked = true;
          break;
        }
      }
      if(!_deptChecked){
        document.getElementById(oDept.name).checked=false;
      }
    } //delSelectedDept



  });

});

app.factory('dataResource', function ($resource) {
  return $resource('./mocks/cosentino.json',
    {},
    {
      get: { method: 'GET', isArray: true }
    })
});
