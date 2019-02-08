var app = angular.module('app', ['ngResource']);

app.controller('appController', function ($scope, $http, dataResource) {
  $http.get('./mocks/cosentino.json').then(function () {


     // TODO:
     //    BUSCAR
        // ¡ Revisarrrr!
     //    SELECCIONAR TODO
            // Selecciona todas las cuentas, pasando solo la raiz de la cuenta, no los departamentos.
     //    DESELECCIONAR TODO
            // Facil, borra todo!
     //    SELECCIONAR EL GRUPO ENTERO
            // Se pasan todas las cuentas del grupo al panel de seleccion
    //      DESELECCIONAR GRUPO
    //    BORRAR CUENTA DEL PANEL DE SELECCION
            //TODO deseleccionar el check del Grupo

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
      // console.log($scope.datosResource)
      console.log('checkAll');
      $scope.datosResource.forEach(
        function(element){
          let _group = {};
          _group.group_name = element.group_name;
          _group.business_group_code = element.business_group_code;
          $scope.selected.push(_group)
        }
      )
      // console.log($scope.selected)
    }

    $scope.uncheckAll = function () {
      $scope.selected = [];
    };

    $scope.exist = function (data) {
      // if(data!==undefined){
      //   if($scope.selected.indexOf(data) > -1){
      //     console.log('Coño, existe ' + data);
      //   }
      // }
      return $scope.selected.indexOf(data) > -1;
    }

    // Selección por el usuario de un grupo
    $scope.addGroup = function (data, selecc) {
      console.log("addGroup, grupo seleccionado: " + data.group_name);
      // CASO 1: seleccion del grupo
      //   caso 1.1: existe la cuenta iterada. Se salta a la siguiente iteración
      //   caso 1.2: NO existe la cuenta seleccionada. Se añade la cuenta, se deselecciona la cuenta y sus departamentos
      // CASO 2: deseleccion del grupo
      //   caso 2.1  si existen cuentas, se eliminan.
      data.accounts.forEach(
        function(account){
          // console.log(account.departament_name)
          let idAccount = $scope.selected.indexOf(account);
          if(selecc){
            // caso 1.2
            if(idAccount == -1){
              $scope.selected.push(account);
              document.getElementById(account.account_name + account.account_code).checked=true;
              document.getElementById(account.account_name + account.account_code).disabled=true;
              // Deshabilito los departamentos
              let aDepts = document.getElementsByName(account.account_name+account.account_code);
              for(var i=0; i < aDepts.length; i++){
                aDepts[i].disabled = true;
              }
            }
          }else {
            // caso 2.1
            if(idAccount > -1){
              $scope.selected.splice(idAccount, 1);
              document.getElementById(account.account_name + account.account_code).checked=false;
            }
          }
        }
      )


      // let iddata = $scope.selected.indexOf(data);
      // if (iddata > -1) {
      //   $scope.selected.splice(iddata, 1);
      //   // $scope.removeAccount();
      // } else {
      //   let _group = {};
      //   _group.group_name=data.group_name;
      //   _group.business_group_code=data.business_group_code;
      //   $scope.selected.push(_group);
      // }
      //



    }

    // El usuario ha seleccionado una cuenta.
    // Se pasan todos los departamentos al panel de seleccion.
    // Se deshabilitan los checkboxes de los departamentos (NO de la cuenta)
    // Se añaden SOLO los departamentos a la variable de entorno (selected)
    $scope.selectAccount = function (account, selecc) {
      console.log("selectAccount, cuenta seleccionada: " + selecc);
      // CASO 1: seleccion de la cuenta
      //   caso 1.1: existe el departamento iterado. Se salta a la siguiente iteración
      //   caso 1.2: NO existe el departamento seleccionado. Se añade el departamento
      // CASO 2: deseleccion de la cuenta
      //   caso 2.1  si existen departamentos, se eliminan.
      account.departaments.forEach(
        function(dept){
          // console.log(dept.departament_name)
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
      let iddepartament = $scope.selected.indexOf(departament);
      let oCheckBox = document.getElementById(departament.departament_name + departament.departament_code);
      if (iddepartament > -1) {
        $scope.selected.splice(iddepartament, 1);
        // $scope.clickedDepartament = false;
        oCheckBox.checked=false;
      } else {
        $scope.selected.push(departament);
        oCheckBox.checked=true;
        oCheckBox.disabled=true;
        // $scope.clickedDepartament = true;
      }
    }

    // Elimina el grupo del panel de 'seleccionados'
    $scope.delSelectedGroup = function(group) {
      console.log('delSelectedGroup');
      let iddata = $scope.selected.indexOf(group);
      if (iddata > -1) {
        $scope.selected.splice(iddata, 1);

      //  TODO:::::  Una vez borrado el grupo del panel derecho, controlar el izquierdo.


      }
    }

    /************  PANEL DE ITEMS SELECCIONADOS  ***********/
    // Se invoca desde el listado de elementos seleccionados
    $scope.delSelectedAccount = function(account) {
      console.log('delSelectedAccount');
      // Se elimina del panel de seleccionados
      let idAccount = $scope.selected.indexOf(account);
      $scope.selected.splice(idAccount, 1);
      // Se deschequea la cuenta
      let oAccount = document.getElementById(account.account_name + account.account_code);
      oAccount.disabled=false;
      // Se desahabilitan y deschequean los departamentos
      account.departaments.forEach(
        function(dept){
          let oDept = document.getElementById(dept.departament_name + dept.departament_code);
          oDept.disabled=false;
          oDept.checked=false;
        }
      )
      //
      // // Compruebo que hay departamentos de la cuenta seleccionados, de lo contrario hay que deschequear la cuenta.
      // let _accChecked = false;
      // let aDepts = document.getElementsByName(oAccount.name);
      // for(var i=0; i < aDepts.length; i++){
      //   if(aDepts[i].checked){
      //     _accChecked = true;
      //     break;
      //   }
      // }
      // if(!_accChecked){
      //   document.getElementById(oDept.name).checked=false;
      // }

    } //delSelectedAccount

    // Se invoca desde el listado de elementos seleccionados
    $scope.delSelectedDept = function(department) {
      console.log('delSelectedDept');
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
