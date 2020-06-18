/**
 * 获取下级目录
 * @param {Sting} parentId 父文件夹id
 */
let GetOFSSubFolderByPId = parentId => {
  return window.$LO.http.post(`/Document/Archive/ArchiveDirectory?parentId=${parentId}`)
}
/**
 * 获取归档配置
 * @param {Object} params 业务生成器任务参数
 */
let GetOFSDocConfig = params => {
  return window.$LO.http.post('/Document/Archive/ArchiveConfig', params)
}
/**
 * 归档
 * @param {Object} params 业务生成器归档参数
 */
let OFSDocumentSaving = params => {
  return window.$LO.http.post('/Document/Archive/ArchiveFile', params)
}

/**
 * 归档-正文、文单、处理记录、分送记录
 * @param taskId
 * @returns {*}
 */
let DocumentSaving = (params, moduleCode) => {
  switch (moduleCode) {
    case 'GB.LK.ODM.GWYY.NewSWGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenShouWenDoc/documentsaving`, params)
    case 'GB.LK.ODM.GWYY.NewQBGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenQianBaoDoc/documentsaving`, params)
    case 'GB.LK.ODM.GWYY.NewFWGLModule':
    default:
      return window.$LO.http.post(`/TaskCenter/GongWenFaWenDoc/documentsaving`, params)
  }
}
/**
 * 归档到第三方
 * @param taskID
 * @param thirdPartyName
 * @returns {*}
 */
let DocumentSavingToThirdParty = (docObjectID, thirdPartyName, moduleCode) => {
  switch (moduleCode) {
    case 'GB.LK.ODM.GWYY.NewSWGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenShouWenDoc/DocumentSavingToThirdParty?docObjectID=${docObjectID}&thirdPartyName=${encodeURI(thirdPartyName)}`)
    case 'GB.LK.ODM.GWYY.NewQBGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenQianBaoDoc/DocumentSavingToThirdParty?docObjectID=${docObjectID}&thirdPartyName=${encodeURI(thirdPartyName)}`)
    case 'GB.LK.ODM.GWYY.NewFWGLModule':
    default:
      return window.$LO.http.post(`/TaskCenter/GongWenFaWenDoc/DocumentSavingToThirdParty?docObjectID=${docObjectID}&thirdPartyName=${encodeURI(thirdPartyName)}`)
  }
}
/**
 * 通过父节点ID查询文件夹
 * @param taskId
 * @returns {*}
 */
let GetDocumentSavingList = (isRoot, parentID, operCode, moduleCode) => {
  let doc
  switch (moduleCode) {
    case 'GB.LK.ODM.GWYY.NewSWGLModule':
      doc = 'GongWenShouWenDoc'
      break
    case 'GB.LK.ODM.GWYY.NewQBGLModule':
      doc = 'GongWenQianBaoDoc'
      break
    case 'GB.LK.ODM.GWYY.NewFWGLModule':
    default:
      doc = 'GongWenFaWenDoc'
  }
  let url
  if (isRoot) {
    url = `/TaskCenter/${doc}/getdocumentsavinglist`
  } else {
    url = `/TaskCenter/${doc}/getdocumentsavinglist?parentID=${parentID}&currentRight=${operCode}`
  }
  return window.$LO.http.post(url)
}
/**
 * 归档-查询是否可以归档
 * @param taskID
 * @returns {*}
 */
let GetODMDocConfig = (taskIDs, moduleCode) => {
  switch (moduleCode) {
    case 'GB.LK.ODM.GWYY.NewSWGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenShouWenDoc/IsAllowDocumentSavingQuery`, taskIDs)
    case 'GB.LK.ODM.GWYY.NewQBGLModule':
      return window.$LO.http.post(`/TaskCenter/GongWenQianBaoDoc/IsAllowDocumentSavingQuery`, taskIDs)
    case 'GB.LK.ODM.GWYY.NewFWGLModule':
    default:
      return window.$LO.http.post(`/TaskCenter/GongWenFaWenDoc/IsAllowDocumentSavingQuery`, taskIDs)
  }
}
/**
 * 归档不弹窗权限获取
 * @param taskID
 * @returns {*}
 */
let DetermineDefaultArchivePath = (taskID, moduleCode) => {
  let doc
  switch (moduleCode) {
    case 'GB.LK.ODM.GWYY.NewSWGLModule':
      doc = 'GongWenShouWenDoc'
      break
    case 'GB.LK.ODM.GWYY.NewQBGLModule':
      doc = 'GongWenQianBaoDoc'
      break
    case 'GB.LK.ODM.GWYY.NewFWGLModule':
    default:
      doc = 'GongWenFaWenDoc'
  }
  return window.$LO.http.post(`/TaskCenter/${doc}/DetermineDefaultArchivePath?taskID=${taskID}`)
}
/**
 * 归档-获取第三方档案系统
 */
let GetThirdPartySystems = () => {
  return window.$LO.http.post(`/TaskCenter/GongWenFaWenDoc/GetThirdPartySystems`)
}

/**
 * 归档-批量归档
 */
let SaveBatchGuiDang = (par) => {
  return window.$LO.http.post(`/TaskCenter/GongWenFaWenDoc/SaveBatchGuiDang`, par)
}

export {
  DocumentSaving,
  DocumentSavingToThirdParty,
  GetDocumentSavingList,
  GetThirdPartySystems,
  GetODMDocConfig,
  DetermineDefaultArchivePath,
  SaveBatchGuiDang,
  GetOFSSubFolderByPId,
  GetOFSDocConfig,
  OFSDocumentSaving
}
