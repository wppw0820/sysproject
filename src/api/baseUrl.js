const baseUrl = 'http://11.0.0.150:9060'
export function getApi(obj){
  if(obj.constructor === Object){
    for(var k in obj){
      obj[k] = baseUrl + obj[k]
    }
  }
  return obj
}