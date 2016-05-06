# APISS
##### Convierte una hoja de calculo de Google en un API basica.

###### Pasos
En Drive crear una nueva Google Apps Script

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/new_gas.png) 

Borrar el contenido y pegar el siguiente código
```javascript
function APISS(e){this.idSpreadSheet=e,this.sps=SpreadsheetApp.openById(this.idSpreadSheet),this.sheets=this.sps.getSheets()}function doPost(e){var t={};try{var a=JSON.parse(e.postData.contents),r=new APISS(a.spreadSheet);switch(a.option){case"list":t=r.getJSON();break;case"find":t=r.getElement(a.data.id);break;case"insert":t=r.insert(a.data);break;case"update":t=r.edit(a.data);break;case"delete":t=r.deleteElement(a.data.id)}}catch(s){t={error:s.message}}return ContentService.createTextOutput(JSON.stringify(t)).setMimeType(ContentService.MimeType.JSON)}APISS.prototype.getJSON=function(){var e=this.sheets[0].getDataRange().getValues(),t=e.shift(),a=[];for(var r in e){var s={};for(var n in t)s[t[n]]=e[r][n];a.push(s)}return a},APISS.prototype.getElement=function(e){var t=this.sheets[0].getDataRange().getValues(),a=t.shift(),r={};for(var s in t)if(t[s][0]===e){for(var n in a)r[a[n]]=t[s][n];break}return r},APISS.prototype.insert=function(e){for(var t=this.sheets[0],a=t.getLastRow()+1,r=t.getLastColumn(),s={},n=1;r>=n;n++){var i=t.getRange(1,n).getValue();s[i]=n}var o=!1;for(var g in e){var u=s[g];void 0!==u&&(t.getRange(a,u).setValue(e[g]),o=!0)}if(o){var p=t.getRange(a-1,1).getValue(),v=isNaN(p)?1:p+1;return t.getRange(a,1).setValue(v),v}return 0},APISS.prototype.edit=function(e){var t=0;for(var a in e){t=e[a];break}var r=this.sheets[0],s=r.getDataRange().getValues(),n=s.shift(),i={};for(var o in s)if(s[o][0]===t){for(var g={},u=r.getLastColumn(),p=1;u>=p;p++){var v=r.getRange(1,p).getValue();g[v]=p}for(var p in e){var f=g[p];void 0!==f&&r.getRange(parseInt(o)+2,f).setValue(e[p])}for(var h in n)i[n[h]]=r.getRange(parseInt(o)+2,g[n[h]]).getValue();break}return i},APISS.prototype.deleteElement=function(e){var t=this.sheets[0],a=t.getDataRange().getValues(),r=(a.shift(),{});for(var s in a)if(a[s][0]===e){t.deleteRow(parseInt(s)+2),r=e;break}return r};
```

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/code_gas.png) 

Guardar versión de nuestro código

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/save_version.png) 

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/save_version_.png) 

Publicar nuestra versión

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/publish_gas.png) 

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/impl_gas.png) 

Autorizar la aplicación

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/aut_gas.png) 

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/url_gas.png) 

Con esto ya podemos convertir cualquier hoja de cálculo de Google en una API

#### Ejemplo
Creamos una hoja de cálculo (Asignamos nuestros encabezados y si deseamos nuestra información inicial).
El API es dinámica y se adapta a nuestros encabezados.

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/data_ss.png) 

Tomamos el ID de la hoja de calculo

![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/id_ss.png) 


![](https://raw.githubusercontent.com/maocq/APISS/master/doc/img/request.png) 


Obtener listado de información

```json
{
  "spreadSheet" : "15MfAulM0x6U8SCLgudbLEC4EZNSGn193DYW3HIl34Tg",
  "option": "list",
}
```

Buscar un elemento

```json
{
  "spreadSheet" : "15MfAulM0x6U8SCLgudbLEC4EZNSGn193DYW3HIl34Tg",
  "option": "find",
  "data": {
    "id": 2
  }
}
```
Eliminar

```json
{
  "spreadSheet" : "15MfAulM0x6U8SCLgudbLEC4EZNSGn193DYW3HIl34Tg",
  "option": "delete",
  "data": {
    "id": 1
  }
}
```
Nuevo

```json
{
  "spreadSheet" : "15MfAulM0x6U8SCLgudbLEC4EZNSGn193DYW3HIl34Tg",
  "option": "insert",
  "data": {
    "title": "Este es un titulo",
    "description": "Descripcion",
    "user": "@maocq"
  }
}
```
Actualizar

```json
{
  "spreadSheet" : "15MfAulM0x6U8SCLgudbLEC4EZNSGn193DYW3HIl34Tg",
  "option": "update",
  "data": {
    "id": 3,
    "title": "Este er5a un titulo",
    "description": "Descripcion",
    "user": "@maocq"
  }
}
```

[Demo](https://jsfiddle.net/maocq/ytgubjse/)

