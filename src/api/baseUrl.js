const baseUrl = 'http://11.0.0.150:6086/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri='
export function getApi(obj){
  if(obj.constructor === Object){
    for(var k in obj){
      obj[k] = baseUrl + obj[k]
    }
  }
  return obj
}