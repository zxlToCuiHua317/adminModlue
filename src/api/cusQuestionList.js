import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/cusQuestionList',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/cusQuestionList/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/cusQuestionList',
    method: 'put',
    data
  })
}

export function getDataBySotr() {
  return request({
    url: 'api/cusQuestionList',
    method: 'get',
    sort: 'id,desc'
  })
}

// 根据id获取数据
export function getDataById(id) {
  return request({
    url: '/api/cusQuestionList/findById?id=' + id + '',
    method: 'get'
  })
}

// 获取字典信息
export function GetGameData() {
  return request({
    url: '/api/dictDetail?page=0&size=10&sort=dictSort%2Casc&sort=id%2Cdesc&dictName=cus_gameCode',
    method: 'get'
  })
}

export function GetQusTypeData() {
  return request({
    url: '/api/dictDetail?page=0&size=10&sort=dictSort%2Casc&sort=id%2Cdesc&dictName=cus_kr_desc',
    method: 'get'
  })
}

export function GetAnsStatusData() {
  return request({
    url: '/api/dictDetail?page=0&size=10&sort=dictSort%2Casc&sort=id%2Cdesc&dictName=cus_status',
    method: 'get'
  })
}

export function GetDelStatusData() {
  return request({
    url: '/api/dictDetail?page=0&size=10&sort=dictSort%2Casc&sort=id%2Cdesc&dictName=cus_delstatus',
    method: 'get'
  })
}

export function GetContent(mainid) {
  return request({
    url: '/api/cusQuestionReply?mainid=' + mainid + '',
    method: 'get'
  })
}

export function replay(id, message) {
  console.log(message)
  return request({
    url: '/api/cusQuestionReply/replyMsg',
    method: 'get',
    params: {
      id: id,
      message: message
    }
  })
}

export function delCache(id) {
  return request({
    url: '/api/cusQuestionList/delCache?id=' + id + '',
    method: 'get'
  })
}

export function exportExel(date, enddate) {
  return request({
    url: '/api/cusQuestionList/download?page=0&size=10&sort=id desc&createTime=' + date + '&createTime=' + enddate + '',
    method: 'get'
  })
}

export default { add, edit, del }
