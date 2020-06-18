/**
 * 根据组织Id查询下级组织信息
 * @param {String} Id  例："1.D/1001.D/1010.D"
 * @param {String} Kind 例：D
 */
let GetChildren = (Id, Kind) => {
  return window.$LO.http.post(`/Workflow/v2/Org/GeChildren`, { Id, Kind })
}
/**
 * 组织搜索/人员搜索
 * @param {String} Filter 搜索关键词
 * @param {Array} Kinds 搜索组织类型
 * @param {Array} Ranges 组织 fullId 集合
 */
let Find = (Filter, Kinds, Ranges) => {
  return window.$LO.http.post(`/Workflow/v2/Org/Find`, { Filter, Kinds, Ranges })
}
/**
 * 获取所有常用联系人分组
 */
let GetAllRootConstant = () => {
  return window.$LO.http.post(`/Workflow/v2/Org/GetAllRootConstant`)
}
// 获取子部门
let GetChildrenAsync = params => {
  return window.$LO.http.post(`/TaskCenter/Workflow/GeChildrenAsync`, params)
}
// 获取子部门
let FindAsync = params => {
  return window.$LO.http.post(`/TaskCenter/Workflow/FindAsync`, params)
}
export {
  GetChildrenAsync,
  FindAsync,
  GetChildren,
  Find,
  GetAllRootConstant
}
