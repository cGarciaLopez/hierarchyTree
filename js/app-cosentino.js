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

    // SOLO PARA CUENTAS CON MUCHOS GRUPOS
    // Selecciona el/los grupos de una lista desplegable.
    $scope.selectGroup = function (_group) {
      $scope.selectedGroup = _group;
    }

    // Selecciona el (o los) grupo completo.
    $scope.checkAll = function(){
      console.log('checkAll');
      $scope.selected = []
      $scope.datosResource.forEach(
        function(element){
          // console.log(element)
          let _group = {};
          _group.group_name = element.group_name;
          _group.business_group_code = element.business_group_code;
          $scope.selected.push(_group)
        }
      )
      let aItems = document.getElementsByClassName("form-check-input");
      for (var i = 0; i < aItems.length; i++) {
        aItems[i].disabled=true;
        aItems[i].checked=true;
      }
    } // checkAll

    // Inicializa el objeto 'selected'
    $scope.uncheckAll = function () {
      $scope.selected = [];
      let aItems = document.getElementsByClassName("form-check-input");
      for (var i = 0; i < aItems.length; i++) {
        aItems[i].disabled=false;
        aItems[i].checked=false;
      }
    }; //uncheckAll

    // Selección por el usuario de un grupo
    $scope.addGroup = function (data, selecc) {
      console.log("addGroup, grupo seleccionado: " + data.group_name);
      // CASO 1: seleccion del grupo
      //   caso 1.1: existe la cuenta iterada, hay que eliminar los departamenteos asociados
      //   caso 1.2: NO existe la cuenta seleccionada. Se añade la cuenta, se deselecciona la cuenta y sus departamentos
      // CASO 2: deseleccion del grupo
      //   caso 2.1  si existen cuentas, se eliminan.
      // $scope.clearDepartaments(data.group_name+data.business_group_code);
      data.accounts.forEach(
        function(account){
          // console.log(account.departament_name)
          let idAccount = $scope.selected.indexOf(account);
          if(selecc){
            // caso 1.2
            if(idAccount == -1){
              if(
                ! $scope.searchText
                || ($scope.searchText && account.account_name.indexOf($scope.searchText.toUpperCase()) > -1)
              ){
                $scope.selected.push(account);
                document.getElementById(account.account_name + account.account_code).checked=true;
                document.getElementById(account.account_name + account.account_code).disabled=true;
                $scope.disableDepts(account);
              }
            }
          }else {
            $scope.delSelectedAccount(account);
          }
        }
      )
    } //addGroup

    // Desabilita el checkbox de los departamentos de una cuenta
    $scope.disableDepts = function(account){
      // Deshabilito los departamentos
      let aDepts = document.getElementsByName(account.account_name+account.account_code);
      for(var i=0; i < aDepts.length; i++){
        aDepts[i].disabled = true;
      }
    }

    // Elimina el grupo del panel de 'seleccionados'
    $scope.delSelectedGroup = function(group) {
      console.log('delSelectedGroup');
      let iddata = $scope.selected.indexOf(group);
      $scope.selected.splice(iddata, 1);

      //  TODO:::::  Una vez borrado el grupo del panel derecho, controlar el izquierdo.
      // deschequear el  grupo
      let oGroup = document.getElementById(group.group_name + group.business_group_code);
      oGroup.disabled=false;
      // habilitar y deschequear las cuentas
      // habilitar y deschequear lo departamentos
      let oAccounts = document.getElementsByName(group.group_name +group.business_group_code);
      for (var i = 0; i < oAccounts.length; i++) {
        oAccounts[i].disabled = false;
        oAccounts[i].checked = false;
        $scope.iteraAccount(oAccounts[i]);
      }
    } // delSelectedGroup
    // Inicializa los valores de selección de todos los departamentos de una cuenta.
    $scope.iteraAccount = function(_cuenta){
      let aDepts = document.getElementsByName(_cuenta.id);
      for (var i = 0; i < aDepts.length; i++) {
        aDepts[i].disabled=false;
        aDepts[i].checked=false;
      }
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
              // Se comprueba si existe un texto de filtrado.
              if(
                ! $scope.searchText
                || ($scope.searchText && dept.departament_name.indexOf($scope.searchText.toUpperCase()) > -1)
              ){
                $scope.selected.push(dept);
                document.getElementById(dept.departament_name + dept.departament_code).checked=true;
              }

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
    } // selectAccount

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
    } //delSelectedAccount


    $scope.addDepartament = function (departament) {
      console.log("addDepartament");
      let iddepartament = $scope.selected.indexOf(departament);
      let oCheckBox = document.getElementById(departament.departament_name + departament.departament_code);
      if (iddepartament > -1) {
        $scope.selected.splice(iddepartament, 1);
        oCheckBox.checked=false;
      } else {
        $scope.selected.push(departament);
        oCheckBox.checked=true;
        oCheckBox.disabled=true;
      }
    } // addDepartament


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

    // FUNCIONES AUXILIARES
    // Chequea si un grupo se encuentra en el objeto 'selected'
    $scope.existeGroup = function (data) {
      let existe = false;
      for (var i = 0; i < $scope.selected.length; i++) {
        if(
          ($scope.selected[i].group_name === data.group_name)
            && $scope.selected[i].business_group_code === data.business_group_code){
            existe = true;
            break
        }
      }
      return existe;
    } //existeGroup


    $scope.existeDepta = function (data) {
      console.log(data);
      let existe = false;
      for (var i = 0; i < $scope.selected.length; i++) {
        if(
            $scope.selected[i].departament_name !== undefined
            && ($scope.selected[i].departament_name === data.departament_name)
            && $scope.selected[i].departament_code === data.departament_code){
            existe = true;
            break
        }
      }
      return existe;
    } //existeGroup

    $scope.exist = function (data) {
      return $scope.selected.indexOf(data) > -1;
    }

    // Chequea si un depatamento se encuentra en el objeto 'selected'
    $scope.existeDepta = function (data) {
      return $scope.selected.indexOf(data) > -1;
    }

    // Función auxiliar para el buscador
    $scope.viewSelItem = function(searchText, selectedData){
        let rt = false;
        if( selectedData.business_group_code
          && (searchText===undefined || selectedData.group_name.indexOf(searchText.toUpperCase())>-1)){
            rt = true;
          }
        if( selectedData.account_code
          && (searchText===undefined || selectedData.account_name.indexOf(searchText.toUpperCase())>-1)){
            rt = true;
          }
        if( selectedData.departament_code
          && (searchText===undefined || selectedData.departament_name.indexOf(searchText.toUpperCase())>-1)){
            rt = true;
          }
          return rt;
    }

    // Función auxiliar para el buscador
    $scope.showGroupLayer = function(searchText, selectedData){
        let rt = false;
        if( selectedData.business_group_code
          && (searchText===undefined || selectedData.group_name.indexOf(searchText.toUpperCase())>-1)){
            rt = true;
          }
          return rt;
    } // showGroupLayer

    // Función auxiliar para el buscador
    $scope.showAccountLayer = function(searchText, selectedData){
      let rt = false;
      if( selectedData.account_code
        && (searchText===undefined || selectedData.account_name.indexOf(searchText.toUpperCase())>-1)){
          rt = true;
        }
        return rt;
    } // showAccountLayer

    // Función auxiliar para el buscador
    $scope.showDepartmentLayer = function(searchText, selectedData){
      let rt = false;
      if( selectedData.departament_code
        && (searchText===undefined || selectedData.departament_name.indexOf(searchText.toUpperCase())>-1)){
          rt = true;
        }
        return rt;
    } //showDepartmentLayer

    // Elimina los departamentos de las cuentas del grupo.
    $scope.clearDepartaments =function(_idGroup){
        let aAccounts = document.getElementsByName(_idGroup);
        for (var i = 0; i < aAccounts.length; i++) {
          if(aAccounts[i].checked){
            $scope.aux(aAccounts[i])
          }
        }
    }
    $scope.aux = function(account){
      // Iteramos los departamentos
      let aDepts = document.getElementsByName(account.id);
      for (var i = 0; i < aDepts.length; i++) {
        aDepts[i].click()
      }
    } // aux

  });

});

app.factory('dataResource', function ($resource) {
  return $resource('./mocks/c51239jk.json',
    {},
    {
      get: { method: 'GET', isArray: true }
    })
});
