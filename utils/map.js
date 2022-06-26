function searchLocation(keyword,callback) {
  wx.request({
    url: 'https://restapi.amap.com/v3/geocode/geo?key=8dd77d7b326cfa1f884df59b39921b34&address='+keyword,
    method: 'get',
    success: res => {
      callback(res)
    }
  })
} 

module.exports = {
  searchLocation
}