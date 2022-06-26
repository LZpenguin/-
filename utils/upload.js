function uploadPic(filePath,callback) {
  wx.uploadFile({
    filePath: filePath,
    name: 'file',
    url: 'https://www.tmnhs.top/api/file/upload',
    success: res => {
      callback(res)
    }
  })
}

module.exports = {
  uploadPic
}