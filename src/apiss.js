/**
 * Convertir una Spreadsheet en un API
 * @author Mauricio Carmona @maocq
*/

function APISS(id) {
  // Id de la Spread sheet
  this.idSpreadSheet = id;
  
  // Objeto Spread sheet
  this.sps = SpreadsheetApp.openById(this.idSpreadSheet);
  
  // Hojas 
  this.sheets = this.sps.getSheets();
}


APISS.prototype.getJSON = function() {
  
  // Obtener hoja numero [x]
  // Obtener rando de datos
  // Obtener sus valores
  var outputSheet = this.sheets[0]
  .getDataRange()
  .getValues();
  
  //Obtener encabezados
  var headers = outputSheet.shift();
  
  // Array donde se almacenaran los objetos de la respuesta
  var response = [];  
  // Recorrer las filas con información
  for(var key in outputSheet) {
    //Objeto para la respuesta
    var objectResponse = {};
    
    //Crear atributo por cada uno de los encabezados
    for(var header in headers) {
      objectResponse[ headers[header] ] = outputSheet[key][header];  
    }    
    //Añadir el objeto a la respuesta
    response.push(objectResponse);
  }
  
  return response;
};


APISS.prototype.getElement = function(id) {
  
  // Obtener hoja numero [x]
  // Obtener rando de datos
  // Obtener sus valores
  var outputSheet = this.sheets[0]
  .getDataRange()
  .getValues();
  
  //Obtener encabezados
  var headers = outputSheet.shift();
  
  //Objeto para la respuesta
  var objectResponse = {};
  // Recorrer las filas con información
  for(var key in outputSheet) {
    if(outputSheet[key][0] === id){     
      for(var header in headers) {
        objectResponse[ headers[header] ] = outputSheet[key][header];  
      }    
      break;
    }      
  }
  
  return objectResponse;
};


APISS.prototype.insert = function(element ) {

  var sheet = this.sheets[0];
  var lastRow = sheet.getLastRow() + 1;
  var lastColumn = sheet.getLastColumn();
      
  // Obtener posicion de los encabezados
  var positionHeader = {};
  for(var i = 1; i <= lastColumn; i++) {    
    var head = sheet.getRange(1,i).getValue();  
    positionHeader[head] = i;
  }
  
  var insert = false;
  for(var key in element){
    var position = positionHeader[key];
    if(position !== undefined) {
      sheet.getRange(lastRow,position).setValue(element[key]);
      insert = true;
    }
  }
  // Asignar id
  if(insert) {
    var lastId =  sheet.getRange((lastRow - 1),1).getValue();
    var newId = (isNaN(lastId)) ? 1 : lastId + 1 ;
    sheet.getRange(lastRow,1).setValue(newId);
    return newId;
  } else {
    return 0;
  }
  
};


APISS.prototype.edit = function(element) {
  
  var id = 0;
  // Obtener el primer atributo el cual corresponde al ID
  for(var e in element) {
    id = element[e];
    break;
  }
  
  var sheet = this.sheets[0];
  // Obtener hoja numero [x]
  // Obtener rando de datos
  // Obtener sus valores
  var outputSheet = sheet
  .getDataRange()
  .getValues();
  
  //Obtener encabezados
  var headers = outputSheet.shift();
  
  //Objeto para la respuesta
  var objectResponse = {};
  
  // Recorrer las filas con información
  for(var key in outputSheet) {
    if(outputSheet[key][0] === id){     
                
      // Obtener posicion de los encabezados
      var positionHeader = {};
      var lastColumn = sheet.getLastColumn();
      for(var i = 1; i <= lastColumn; i++) {    
        var head = sheet.getRange(1,i).getValue();  
        positionHeader[head] = i;
      }
      
      for(var i in element){
        var position = positionHeader[i];
        if(position !== undefined) {
          sheet.getRange(parseInt(key)+2, position).setValue(element[i]);          
        }
      }
     
      //Recuperar los elementos actualizados      
      for(var header in headers) {
        objectResponse[ headers[header] ] = sheet.getRange(parseInt(key)+2,positionHeader[ headers[header] ]).getValue();  
      }    
      break;
    }      
  }
  
  return objectResponse;
  
};


APISS.prototype.deleteElement = function(id) {
  
  var sheet = this.sheets[0];
  // Obtener hoja numero [x]
  // Obtener rando de datos
  // Obtener sus valores
  var outputSheet = sheet
  .getDataRange()
  .getValues();
  
  //Obtener encabezados
  var headers = outputSheet.shift();
  
  //Objeto para la respuesta
  var objectResponse = {};
  // Recorrer las filas con información
  for(var key in outputSheet) {
    if(outputSheet[key][0] === id){     
      sheet.deleteRow(parseInt(key)+2);
      objectResponse = id;
      break;
    }      
  }
  
  return objectResponse;
};







/**
 * Método POST
 * @param json request
 * @return json response
*/

function doPost(request) {
   
  var json = {};
  try {
    var postData = JSON.parse(request.postData.contents);
    
    var api = new APISS(postData.spreadSheet);    
    
    switch(postData.option) {
      case 'list':
        json = api.getJSON();
        break;
      case 'find':
        json = api.getElement(postData.data.id);
        break;
      case 'insert':
        json = api.insert(postData.data);
        break;
      case 'update':
        json = api.edit(postData.data);
        break;
      case 'delete':
        json = api.deleteElement(postData.data.id);
        break;
      default:
    }  
  } catch (excepcion) {
    json = excepcion.message;    
  }
  
  return ContentService
  .createTextOutput( JSON.stringify(json) )
  .setMimeType(ContentService.MimeType.JSON);  
 
}