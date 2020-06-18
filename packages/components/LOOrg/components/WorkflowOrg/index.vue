<template>
  <el-dialog :close-on-click-modal="false"
             v-dialogDrag
             :close-on-press-escape="false"
             width="690px"
             class="user-tree"
             :title="title"
             :before-close="cancel"
             append-to-body
             :visible.sync="isShowOrg">
    <div class="con-wrap">
      <div class="tree-wrap">
        <div class="tree-query">
          <el-input placeholder="输入关键字"
                    size="mini"
                    @keyup.enter.native="queryOrgRole"
                    v-model="searchText">
            <i class="cursor el-input__icon el-icon-search"
               slot="suffix"
               @click="queryOrgRole">
            </i>
          </el-input>
        </div>
        <div v-if="isQuery"
             class="queryTable">
          <el-table empty-text=" "
                    :border="true"
                    height="329"
                    ref="queryTable"
                    :data="queryList"
                    @selection-change="queryOrgRoleChange"
                    @row-dblclick="searchTbRowDbClick"
                    tooltip-effect="dark"
                    style="width: 320px">
                    <template slot="empty">
          <div v-if="firstLoad">
            <img src="@~/assets/image/no-data.png"  style="height:116px"/>
            <div style="color:#3C4858; margin-top:15px"
                 class="no-data-text">暂无相关数据哦！</div>
          </div>
        </template>
            <el-table-column type="selection"
                             width="35">
            </el-table-column>
            <el-table-column label="姓名"
                             width="140"
                             :resizable="true">
              <template slot-scope="scope">
                <span class="gongwen-title flag"
                      :title="scope.row.label">
                  <i class="icon-user-dept"
                     :class="setClassNameForDeptOrUser(scope.row)"></i>
                  <span>{{scope.row.label}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="部门"
                             width="144"
                             :resizable="true">
              <template slot-scope="scope">
                <span class="gongwen-title fulldept">
                  <span v-if="title === '更改处理人'"
                        :title="flipDept(scope.row.Name) ">{{flipDept(scope.row.Name)}}</span>
                  <span v-else
                        :title="flipDept(scope.row.Name)">{{flipDept(scope.row.Name)}}</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="treediv sroll-wrap"
             v-show="!isQuery">
          <!-- 非查询状态 仅包含用户 -->
          <div class="peoples only-user"
               v-if="tempData.treeData.length === 0">
            <el-checkbox class="people"
                         v-for="(executor) in tempData.executors"
                         v-model="executor.selected"
                         :key="executor.ID"
                         @change="peopleChange(executor)"
                         v-show="isPeople(executor)">
              <img class="only-user-icon"
                   :src="getExecutorSexImg(executor)" />
              <span class="only-user-username"
                    :title="executor.Name | filterExecutor">
                {{executor.Name | onlyUserFilter}}</span>
              <span class="only-user-deptname"
                    :title="executor.Name | filterFullDeptName">{{executor.Name | filterFullDeptName}}</span>
            </el-checkbox>
          </div>
          <!-- 非查询状态 含有部门或角色 -->
          <div class="peoples"
               v-if="tempData.treeData.length > 0">
            <el-checkbox class="people"
                         v-for="(executor) in tempData.executors"
                         v-model="executor.selected"
                         :key="executor.ID"
                         @change="peopleChange(executor)"
                         v-show="isPeople(executor)">
              <span>
                <img class="checkbox-icon"
                     :src="getExecutorSexImg(executor)" />
                <span style="margin-left:5px;">{{executor.Name | filterExecutor}}</span>
              </span></el-checkbox>
          </div>
          <el-tree v-if="!isQuery"
                   empty-text=""
                   class="lo-el-tree"
                   :data="tempData.treeData"
                   :props="defaultProps"
                   show-checkbox
                   :load="getOrgList"
                   lazy
                   :check-strictly="true"
                   node-key="ID"
                   ref="tree"
                   @node-expand="nodeExpand"
                   @node-collapse="nodeCollapse"
                   @check-change="handleCheckChange"
                   :render-content="renderContent"
                   :default-expanded-keys="defaultExpandedKeys"
                   highlight-current>
          </el-tree>
        </div>
      </div>
      <div class="selected-wrap">
        <el-table empty-text=" "
                  :border="true"
                  height="345"
                  ref="selectedTable"
                  :data="selectedList"
                  tooltip-effect="dark"
                  style="width: 100%">
          <el-table-column label="姓名"
                           :resizable="true">
            <template slot-scope="scope">
              <span class="gongwen-title flag"
                    :title="scope.row.label">
                <i class="icon-user-dept"
                   :class="setClassNameForDeptOrUser(scope.row)"></i>
                <span>{{scope.row.label}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="部门"
                           :resizable="true">
            <template slot-scope="scope">
              <span class="gongwen-title fulldept">
                <span v-if="title === '更改处理人'"
                      :title="flipDept(scope.row.Name) ">{{flipDept(scope.row.Name)}}</span>
                <span v-else
                      :title="flipDept(scope.row.Name)">{{flipDept(scope.row.Name)}}</span>
                <i class="el-icon-delete delete"
                   @click="removeItem(scope.row)"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="remove">
          <a @click="removeAllItem">全部移除</a>
        </div>
      </div>
    </div>
    <div class="footer-btns">
      <el-button class="save"
                 type="primary"
                 @click="confirm">确定</el-button>
      <el-button class="cancel"
                 @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import InOutMixin from './mixins/inOutMixin'
import { GetChildren, Find, GetAllRootConstant } from '@~/service/Org.api'
export default {
  name: 'OrgSelector',
  mixins: [InOutMixin],
  data () {
    return {
      searchText: '',
      tempData: {
        executors: [],
        treeData: []
      },
      defaultProps: {
        children: 'children',
        id: 'ID',
        label: 'label',
        isLeaf: 'isLeaf'
      },
      selectedList: [],
      isQuery: false,
      searchRanges: [], // 搜索范围，组织fullId集合
      queryList: [],
      lxrgroup: [],
      defaultExpandedKeys: [],
      firstLoad: false
    }
  },
  props: {
    isShowOrg: {
      type: Boolean,
      default: false
    },
    executors: {
      type: Array
    },
    title: {
      type: String,
      default: '选择处理人'
    },
    showCY: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    $settingTableScrollBottom (self) {
      self.$nextTick(() => {
        let container = self.$el.querySelector('.el-table__body-wrapper')
        container.scrollTop = container.scrollHeight
      })
    },
    nodeExpand (row, data) {
      switch (row.className) {
        case 'icon-user-dept dept': row.className = 'icon-user-dept deptopen'; break
        case 'icon-user-dept hxdept': row.className = 'icon-user-dept hxdeptopen'; break
        default:
          break
      }
    },
    nodeCollapse (row) {
      switch (row.className) {
        case 'icon-user-dept deptopen': row.className = 'icon-user-dept dept'; break
        case 'icon-user-dept hxdeptopen': row.className = 'icon-user-dept hxdept'; break
        default:
          break
      }
    },
    // 翻转 部门全路径
    flipDept (fullName) {
      var arr = fullName.split('/')
      if (arr.length > 1) {
        return arr.reverse().splice(1, arr.length).join('/')
      } else {
        return fullName
      }
    },
    setClassNameForDeptOrUser (row, isTree) {
      let className = 'un-know-sex'
      if (row.sex === -1) {
        if (this.isHuXin(row)) {
          if (row.fullId && row.fullId.indexOf('/') === -1) {
            className = 'hxroot'
          } else {
            className = 'hxdept'
          }
        } else {
          if (row.fullId && row.fullId.indexOf('/') === -1) {
            className = 'root'
          } else {
            className = 'dept'
          }
        }
      } else if (row.sex === 0) {
        if (this.isHuXin(row)) {
          if (row.fullId && row.fullId.indexOf('/') > -1) {
            className = 'trust-male'
          } else {
            className = 'male'
          }
        } else {
          className = 'male'
        }
      } else if (row.sex === 1) {
        if (this.isHuXin(row)) {
          if (row.fullId && row.fullId.indexOf('/') > -1) {
            className = 'trust-female'
          } else {
            className = 'female'
          }
        } else {
          className = 'female'
        }
      } else if (row.sex === -1) {
        // className = 'dept'

        if (this.isHuXin(row)) {
          if (row.FullID && row.FullID.indexOf('/') === -1) {
            className = 'hxdept'
          } else {
            className = 'hxroot'
          }
        } else {
          if (row.FullID && row.FullID.indexOf('/') === -1) {
            className = 'dept'
          } else {
            className = 'root'
          }
        }
      } else if (row.sex === 0) {
        if (this.isHuXin(row)) {
          if (row.fullId && row.fullId.indexOf('/') > -1) {
            className = 'trust-male'
          } else {
            className = 'male'
          }
        } else {
          className = 'male'
        }
      } else if (row.sex === 1) {
        if (this.isHuXin(row)) {
          if (row.fullId && row.fullId.indexOf('/') > -1) {
            className = 'trust-female'
          } else {
            className = 'female'
          }
        } else {
          className = 'female'
        }
      }
      let roleKey = this.getExecutorKind(row)
      // 角色组的图标
      if (roleKey.indexOf('RG') > -1) {
        className = 'rggroup'
      }
      // 角色的图标
      if (roleKey === 'R') {
        className = 'rgicon'
      }
      // 职业的图标
      if (roleKey === 'P') {
        className = 'picon'
      }
      if (isTree) {
        className = 'icon-user-dept ' + className
      }
      return className
    },
    isHuXin (row) {
      if (row.IsMapOrg || row.isMapOrg || row.isMap || row.IsMap || row.souceID || row.SouceID) {
        return true
      } else {
        return false
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class={data.className}></i>
          <span style="margin-left:5px;">{node.label}</span>
        </span>
      )
    },
    setTreeData (executors) {
      this.tempData = {
        executors: [],
        treeData: []
      }
      this.searchRanges = []
      executors.map((executor, i) => {
        executor.ID = executor.fullId
        executor.Name = executor.fullName
        executor.name = executor.name || this.nameExecutor(executor.fullName)
        // 首先初始化查询范围
        this.searchRanges.push(executor.ID)
        let kind = this.getExecutorKind(executor)
        if (kind === 'S') {
          this.tempData.executors.push({
            disabled: executor.selected,
            label: name,
            deptName: this.deptExecutor(executor.fullName),
            ...executor
          })
        }
        if (kind !== 'S') {
          this.tempData.treeData.push({
            label: this.nameExecutor(executor.Name),
            children: [],
            disabled: executor.selected,
            isLeaf: false,
            className: this.setClassNameForDeptOrUser(executor, true),
            ...executor
          })
        }
        if (executor.selected) {
          this.selectedList.push({
            label: this.nameExecutor(executor.Name),
            deptName: this.deptExecutor(executor.Name),
            ...executor
          })
        }
      })
      // 如果仅存在一个根部门 默认展开
      // if (this.tempData.treeData && this.tempData.treeData.length === 1) {
      //   this.defaultExpandedKeys = [this.tempData.treeData[0].ID]
      // }
      this.tempData.treeData.forEach(itm => {
        if (itm.selected) {
          this.defaultExpandedKeys.push(itm.ID)
        }
      })
    },
    nameExecutor (name) {
      let lastName = name.split('/')
      return lastName[lastName.length - 1]
    },
    deptExecutor (name) {
      let lastName = name.split('/')
      let res = lastName.length > 1 ? lastName[lastName.length - 2] : lastName[lastName.length - 1]
      return res
    },
    judgeRoleOrg (ID) {
      let lastName = ID.split('/')
      let tempArr = lastName[lastName.length - 1].split('.')
      let lastExtensionName = tempArr[tempArr.length - 1]
      let res = ''
      if (lastExtensionName === 'S') {
        res = false
      } else if (lastExtensionName === 'D' || lastExtensionName === 'P') {
        res = 'org'
      } else if (lastExtensionName === 'RG' || lastExtensionName === 'R') {
        res = 'role'
      } else if (lastExtensionName === 'LG') { // 常用联系人标识
        res = 'link'
      }
      return res
    },
    /**
     * @description 获取处理人类型
     * @remark 流程上下文中返回的处理人缺少Kind属性时 用name判断
     * @return {String} 组织类型 (S--用户|D--部门|P--岗位|R--角色|RG--角色组|LG--常用联系人)
     */
    getExecutorKind (executor) {
      let kind = executor.Kind || executor.kind
      if (kind) {
        return kind
      }
      // 格式：1.D/1001.D/1010.D/1016.D/1058.S
      let fullId = executor.ID || executor.id || executor.Id
      // 截取.后的字符
      kind = fullId.substring(fullId.lastIndexOf('.') + 1, fullId.length)
      return kind
    },
    isPeople (executor) {
      return this.getExecutorKind(executor) === 'S'
    },
    /**
       * 懒加载树获取组织机构子节点
       * element-tree使用方法
       * @param node:当前点击节点信息
       * @param resolve:传递参数方法
       * */
    getOrgList (node, resolve) {
      if (node.level === 0) {
        // 判断是否有顶级节点，true则显示常用联系人
        let arrtemp = this.tempData.treeData.filter((itm, idx) => {
          return (itm.ID.indexOf('.D') > -1 && itm.ID.indexOf('/') === -1)
        })
        if (arrtemp.length > 0) {
          // 获取常用人下分组
          GetAllRootConstant().then(res => {
            let cylxrGroup = []
            res.data.forEach(item => {
              cylxrGroup.push({
                ID: item.fullId,
                label: item.name,
                children: [],
                cylxr: true,
                disabled: false, // 默认分组不可勾选
                isLeaf: false,
                className: this.setClassNameForDeptOrUser({ sex: -1, ID: '-1' }, true),
                ...item
              })
            })
            if (this.showCY) {
              let obj = {
                label: '常用联系人',
                type: 'cy',
                children: cylxrGroup,
                disabled: true, // 默认常用联系人不可勾选
                isLeaf: false,
                className: this.setClassNameForDeptOrUser({ sex: -1, ID: '-1' }, true)
              }
              return resolve([...[obj], ...this.tempData.treeData])
            } else {
              return resolve([...this.tempData.treeData])
            }
          })
        } else {
          return resolve(this.tempData.treeData)
        }
      } else {
        // type存在常用联系人
        if (!node.data.type) {
          if (this.judgeRoleOrg(node.data.ID)) {
            let id = node.data.ID
            let kind = this.getExecutorKind(node.data)
            GetChildren(id, kind).then(res => {
              let data = res.data
              let myList = []
              data.forEach(itm => {
                myList.push({
                  deptName: this.deptExecutor(itm.fullName),
                  ID: itm.fullId,
                  label: itm.name,
                  Name: itm.fullName,
                  isLeaf: itm.kind === 'S',
                  className: this.setClassNameForDeptOrUser(itm, true),
                  ...itm
                })
              })
              resolve(myList)
              this.setTreeNodeCheckStatus()
            }).catch(res => {
              resolve([])
            })
          }
        } else {
          // 加载常用联系人
          return resolve(node.data.children)
        }
      }
    },
    // 初始化树的选中状态
    setTreeNodeCheckStatus () {
      this.selectedList.forEach(itm => {
        this.$refs.tree.setChecked(itm.ID, true, false)
      })
    },
    getcylxrdata (id) {
      return new Promise((resolve, reject) => {
        GetChildren(id, 'LG').then(res => {
          return resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置树节点的选择状态
    handleCheckChange (nodeData, checked, childrenChecked) {
      // 检查部门、角色、角色组下面有无人员
      if (checked) {
        // 点击常用联系人分组
        if (nodeData.cylxr) {
          // 点击常用联系人分组
          this.getcylxrdata(nodeData.ID).then(res => {
            let list = []
            res.forEach(i => {
              list.push(i.fullId)
              let arrtemp = this.selectedList.filter(itm => {
                return i.fullId === itm.ID
              })
              if (arrtemp.length === 0) {
                this.selectedList.push({
                  ID: i.fullId, pid: nodeData.ID, label: this.nameExecutor(i.name), Name: i.fullName, deptName: i.fullName, selected: true, ...i
                })
              }
            })
            let listd = []
            this.selectedList.forEach(i => {
              listd.push(i.ID)
            })
            let arrtemplist = this.lxrgroup.filter(itm => {
              return nodeData.ID === itm
            })
            if (arrtemplist.length === 0) {
              this.lxrgroup.push(nodeData.ID)
            }
            let data = [...listd, ...list, ...this.lxrgroup]
            this.$refs.tree.setCheckedKeys(data)
          })
        } else {
          let arrtemp = this.selectedList.filter(itm => {
            return nodeData.ID === itm.ID
          })
          if (arrtemp.length === 0) {
            nodeData.selected = true
            this.selectedList.push({
              ...nodeData
            })
          }
          this.tempData.executors.forEach(itm => {
            if (nodeData.ID === itm.ID) {
              itm.selected = true
              itm.disabled = true
            }
          })
        }
      } else {
        if (nodeData.cylxr) {
          for (let i = this.lxrgroup.length - 1; i >= 0; i--) {
            if (this.lxrgroup[i] === nodeData.ID) {
              let index = i
              this.lxrgroup.splice(index, 1)// 存在即删除
            }
          }
          for (let i = this.selectedList.length - 1; i >= 0; i--) {
            if (this.selectedList[i].pid === nodeData.ID) {
              let index = i
              this.$refs.tree.setChecked(this.selectedList[i].ID, false, false)
              this.selectedList.splice(index, 1)// 存在即删除
            }
          }
        } else {
          nodeData.selected = false
          this.removeItemFromSelectedList(nodeData)
          this.tempData.executors.forEach(itm => {
            if (nodeData.ID === itm.ID) {
              itm.selected = false
              itm.disabled = false
            }
          })
        }
      }
      // 如果右侧table出现滚动条，则自动到滚动条底部(此为公共函数)
      this.$settingTableScrollBottom(this)
    },
    removeItem (row) {
      if (!this.$refs.tree) {
        // 组织树不存在的情况，对应的是搜索出来的待选列表
        this.queryList.forEach(itm => {
          if (row.ID === itm.ID) {
            itm.selected = false
            itm.disabled = false
            this.removeItemFromSelectedList(row)
          }
        })
        this.tempData.executors.forEach(itm => {
          if (row.ID === itm.ID) {
            itm.selected = false
            itm.disabled = false
          }
        })
        this.removeItemFromSelectedList(row)
      } else {
        // 组织树存在，对应的是组织树
        // 设置默认选择的人员的状态
        this.tempData.executors.forEach(itm => {
          if (row.ID === itm.ID) {
            itm.selected = false
            itm.disabled = false
          }
        })
        // 设置树的状态
        this.$refs.tree.setChecked(row.ID, false, false)
        if (!this.$refs.tree.getNode(row.ID)) {
          this.removeItemFromSelectedList(row)
        }
        // guanal 直接删除
        this.removeItemFromSelectedList(row)
      }
    },
    // 清除已选列表中“删除按钮对应的那项数据”
    removeItemFromSelectedList (row) {
      // 清除已选列表中“删除按钮对应的那项数据”
      let index = null
      this.selectedList.forEach((t, i) => {
        if (row.ID === t.ID) {
          index = i
        }
      })
      if (index !== null) {
        this.selectedList.splice(index, 1)
      }
    },
    removeAllItem () {
      if (!this.$refs.tree) {
        // 组织树不存在的情况，对应的是搜索出来的待选列表
        this.queryList.forEach(itm => {
          itm.selected = false
          itm.disabled = false
        })
      } else {
        // 组织树存在，对应的是组织树
        // 设置默认选择的人员的状态
        this.tempData.executors.forEach(itm => {
          itm.selected = false
          itm.disabled = false
        })
        // 设置树的状态
        this.$refs.tree.setCheckedKeys([])
      }
      this.selectedList = []
    },
    // 已选择人员的选择和删除
    peopleChange (obj) {
      if (obj.selected) {
        let arrtemp = this.selectedList.filter((itm, idx) => {
          return obj.ID === itm.ID
        })
        if (arrtemp.length === 0) {
          obj.selected = true
          this.selectedList.push({
            ...obj
          })
        }
        // 设置树的状态
        this.$refs.tree.setChecked(obj.ID, true, false)
      } else {
        obj.selected = false
        this.removeItemFromSelectedList(obj)
        // 设置树的状态
        this.$refs.tree.setChecked(obj.ID, false, false)
      }
      // 如果右侧table出现滚动条，则自动到滚动条底部(此为公共函数)
      this.$settingTableScrollBottom(this)
    },
    queryOrgRole () {
      this.firstLoad = false
      this.isQuery = !!this.searchText
      if (this.searchText) {
        Find(this.searchText, ['D', 'R'], this.searchRanges).then(res => {
          let data = res.data
          // 当前已选列表中ID集合
          let arrtemp = this.selectedList.map(itm => {
            return itm.ID
          })
          this.queryList = []
          data.forEach(item => {
            item.label = this.nameExecutor(item.name)
            item.deptName = this.deptExecutor(item.fullName)
            item.Name = item.fullName
            item.ID = item.fullId
            item.selected = arrtemp.indexOf(item.fullId) !== -1
            item.className = this.setClassNameForDeptOrUser(item, true)
            // 数组去重
            if (this.queryList.filter(t => t.ID === item.ID).length === 0) {
              this.queryList.push(item)
            }
          })

          this.$nextTick(() => {
            this.queryList.forEach(itm => {
              if (itm.selected) {
                this.$refs.queryTable.toggleRowSelection(itm, true)
              }
            })
          })
          if (this.queryList.length === 0) {
            this.firstLoad = true
          }
        })
      }
    },
    searchTbRowDbClick (row, column, event) {
      // 是否已选中
      let isSelected = this.selectedList.filter(itm => itm.ID === row.ID).length > 0
      // 置状态
      this.$refs.queryTable.toggleRowSelection(row, !isSelected)
    },
    queryOrgRoleChange (rows) {
      this.selectedList = this.selectedList.filter(item => {
        let temp = true
        this.queryList.forEach(itm => {
          if (item.ID === itm.ID) {
            temp = false
          }
        })
        return temp
      })

      rows.forEach(itm => {
        itm.selected = true
        this.selectedList.push(itm)
      })
    },
    getExecutorSexImg (executor) {
      if (executor.sex === 0) {
        return require('../../../../assets/image/LOOrg/icon-male.png')
      }
      if (executor.sex === 1) {
        return require('../../../../assets/image/LOOrg/icon-female.png')
      }
    }
  },
  watch: {
    searchText (val) {
      if (val.length === 0) {
        this.isQuery = false
      }
    },
    executors () {
      this.setTreeData(this.executors)
    }
  },
  filters: {
    filterExecutor (name) {
      let lastName = name.split('/')
      return lastName[lastName.length - 1]
    },
    filterFullDeptName (name) {
      try {
        var index = name.lastIndexOf('/')
        return name.substring(0, index)
      } catch (e) {
        return name
      }
    },
    onlyUserFilter (name) {
      let lastName = name.split('/')
      let userName = lastName[lastName.length - 1]
      if (userName.length > 6) {
        userName = userName.substring(0, 6) + '...'
      }
      return userName
    }
  },
  mounted () {
    if (this.executors.length > 0) {
      this.setTreeData(this.executors)
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.treediv {
  border-bottom: 1px solid #e1e1e1;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  padding: 0 8px;
  height: 328px;
  width: 320px;
}
.queryTable {
  flex-direction: column;
  & /deep/ th:first-child {
    .cell {
      overflow: hidden;
      text-overflow: clip !important;
    }
  }
  & /deep/ .el-table-column--selection .cell {
    text-overflow: clip !important;
  }
}
.user-tree /deep/ .el-table--border th,
.user-tree /deep/ .el-table th.is-leaf {
  text-align: left;
  padding: 0;
}
.user-tree /deep/ .el-table--border th,
.user-tree /deep/ .el-table th.is-leaf > .cell {
  height: 30px;
  // text-align: left;
  line-height: 29px;
}
.user-tree /deep/ .el-table--border td,
.user-tree
  /deep/
  .el-table__body-wrapper
  .el-table--border.is-scrolling-left
  ~ .el-table__fixed,
.user-tree /deep/ .el-table td {
  border: none !important;
  padding: 8px 0 9px;
}
.user-tree /deep/ .el-table td.gutter,
.user-tree /deep/ .el-table th.gutter {
  background: #f3f3f3;
  height: 30px;
  border-bottom: 1px solid #e1e1e1 !important;
  display: table-cell;
  width: auto;
}
.user-tree /deep/ .el-table td .gongwen-title {
  display: flex !important;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0 !important;
}
.user-tree /deep/ .el-table td .gongwen-title span {
  width: 119px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}
.fulldept {
  color: #666666;
}
.user-tree /deep/ .el-table td .gongwen-title:hover {
  color: #393939 !important;
}
.user-tree /deep/ .el-table td .gongwen-title:hover span {
  color: #393939 !important;
}
.user-tree /deep/ .el-dialog__header {
  padding: 13px 20px 10px;
}
.user-tree /deep/ .el-dialog__header .el-dialog__title {
  line-height: 24px;
  font-size: 13px;
  color: #393939;
  font-weight: 700;
}
.user-tree /deep/ .el-dialog__header .el-dialog__headerbtn {
  top: 16px;
  font-size: 19px;
}
.user-tree /deep/ .el-dialog__body {
  padding: 0px 20px 20px;
  color: #606266;
  font-size: 13px;
}
.user-tree /deep/ .el-table td {
  border: none !important;
  text-align: center;
  font-size: 13px;
  padding: 3px 0px 4px 0px;
}

.el-icon-search {
  font-size: 18px;
  color: #3b8dee;
}

.lo-el-tree {
  margin-bottom: 15px;
  width: 100%;
}
.lo-el-tree /deep/ .el-icon-caret-right {
  z-index: 99;
  color: #747474;
}
.lo-el-tree /deep/ .el-icon-caret-right.is-leaf{
      color: transparent;
}
.user-tree
  /deep/
  .lo-el-tree.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #e2e8f1;
}

.user-tree /deep/ .lo-el-tree.el-tree-node__content:hover {
  background: #e2e8f1;
}
.user-tree /deep/ .icon-user-dept {
  width: 16px;
  height: 16px;
  display: inline-block;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 16px 16px;
  margin-right: 3px;
  flex-shrink: 0;
}

.user-tree /deep/ .icon-user-dept.root {
  background-image: url("../../../../assets/image/LOOrg/icon-dept_root.png");
}

.user-tree /deep/ .icon-user-dept.hxroot {
  background-image: url("../../../../assets/image/LOOrg/icon-dept_root_net.png");
}

.user-tree /deep/ .icon-user-dept.dept {
  background-image: url("../../../../assets/image/LOOrg/icon-files.png");
}

.user-tree /deep/ .icon-user-dept.deptopen {
  background-image: url("../../../../assets/image/LOOrg/icon-dept.png");
}

.user-tree /deep/ .icon-user-dept.hxdept {
  background-image: url("../../../../assets/image/LOOrg/icon-dummy.png");
}

.user-tree /deep/ .icon-user-dept.hxdeptopen {
  background-image: url("../../../../assets/image/LOOrg/trust-dept.png");
}

.user-tree /deep/ .icon-user-dept.trust-male {
  background-image: url("../../../../assets/image/LOOrg/trust-male.png");
}

.user-tree /deep/ .icon-user-dept.trust-female {
  background-image: url("../../../../assets/image/LOOrg/trust-female.png");
}

.user-tree /deep/ .icon-user-dept.male {
  background-image: url("../../../../assets/image/LOOrg/icon-male.png");
}
.user-tree /deep/ .icon-user-dept.female {
  background-image: url("../../../../assets/image/LOOrg/icon-female.png");
}
/* 角色组图片 */
.user-tree /deep/ .icon-user-dept.rggroup {
  background-image: url("../../../../assets/image/LOOrg/icon-rggroup.png");
}
/* 角色图片 */
.user-tree /deep/ .icon-user-dept.rgicon {
  background-image: url("../../../../assets/image/LOOrg/icon-rgicon.png");
}
/* 职业图片 */
.user-tree /deep/ .icon-user-dept.picon {
  background-image: url("../../../../assets/image/LOOrg/icon-picon.png");
}
.user-tree /deep/ .el-tree-node__content > .custom-tree-node {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.user-tree .con-wrap {
  display: flex;
  justify-content: space-between;
}
.user-tree .tree-wrap {
  width: 320px;
  padding: 0;
  height: 375px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  overflow-x: hidden;
  align-items: flex-start;
}
.user-tree .tree-wrap .tree-query {
  padding: 8px;
  height: 46px;
  width: 100%;
  border-top: 1px solid #e1e1e1;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}
.user-tree .tree-wrap .sroll-wrap {
  flex: 1;
  overflow-y: auto;
}
.user-tree .selected-wrap {
  position: relative;
  width: 320px;
  height: 375px;
}
.user-tree .selected-wrap /deep/ .el-table::before {
  display: none;
}
.user-tree .selected-wrap .delete {
  margin: 0 0px 0 10px;
  cursor: pointer;
}
.user-tree .selected-wrap .delete:hover {
  color: #3b8dee;
}
.user-tree .selected-wrap .remove {
  width: 100%;
  height: 30px;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  font-weight: 400;
  color: #3b8dee;
  line-height: 28px;
  cursor: pointer;
  z-index: 99;
  border-right: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  border-left: 1px solid #e1e1e1;
  padding-left: 10px;
}
.user-tree .selected-wrap .remove:hover {
  color: #5ea3f4;
}
.user-tree .operation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 30px;
  height: 466px;
  margin: 0 15px;
}
.user-tree .operation .el-icon-arrow-right {
  color: #fff;
}
.user-tree .operation .el-button--mini,
.user-tree .operation .el-button--mini.is-round {
  padding: 8px;
}
.user-tree .operation .el-button + .el-button {
  margin-left: 0;
  margin-top: 30px;
}
.user-tree .footer-btns {
  text-align: right;
  height: 30px;
  margin-top: 10px;
}
.user-tree .footer-btns .save {
  line-height: 30px;
  height: 30px;
  padding: 0 20px;
}
.user-tree .footer-btns .cancel {
  border: 1px solid #cdcdcd;
  line-height: 30px;
  height: 30px;
  padding: 0 20px;
}
.user-tree .people {
  display: flex;
  align-items: center;
  height: 26px;
}
.user-tree .people:hover {
  background: #efefef;
}
.user-tree .wenjianjia1 {
  width: 14px;
  height: 13px;
  display: inline-block;
   background: url("../../../../assets/image/LOOrg/icon-files.png") no-repeat 0 0;
  background-size: 14px 13px;
  margin-right: 2px;
}
.user-tree .user-avtor {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-right: 10px;
  background: url("../../../../assets/image/LOOrg/icon-touxiang.png") no-repeat 0 0;
  background-size: 24px 24px;
  border-radius: 4px;
  border-color: #fff;
}
.user-tree .query-list li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.user-tree .query-list .name-col,
.user-tree .query-list .dept-col,
.user-tree .query-list .el-checkbox {
  display: inline-block;
  width: 108px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 20px;
  line-height: 40px;
}
.user-tree .query-list .dept-col {
  color: #999;
  margin-right: 1px;
}
.user-tree .query-list /deep/ .icon-user-dept {
  vertical-align: middle;
}
.user-tree .query-list /deep/ .icon-user-dept.female {
  background-position: 0 0;
}
/* 角色组 */
.user-tree .query-list /deep/ .icon-user-dept.rggroup {
  background-position: 0 0;
}
/* 角色 */
.user-tree .query-list /deep/ .icon-user-dept.rgicon {
  background-position: 0 0;
}
/* 职业 */
.user-tree .query-list /deep/ .icon-user-dept.picon {
  background-position: 0 0;
}
.user-tree .query-list /deep/ .icon-user-dept.male {
  background-position: 0 0;
}
.user-tree .query-list /deep/ .icon-user-dept.dept {
  background-position: 0 0;
}
.user-tree .query-list .el-checkbox {
  width: auto;
  margin-right: 10px;
  padding-left: 2px;
}
.selected-wrap /deep/ .el-table-column--selection .cell {
  padding: 0 !important;
}
.user-tree /deep/ .el-tree-node__content > .el-checkbox {
  margin-right: 5px;
}
.user-tree /deep/ .el-message-box__title {
  font-size: 14px !important;
  color: #333 !important;
  font-weight: bold !important;
}
.user-tree .selected-wrap /deep/ .el-table__empty-block .el-table__empty-text {
  text-align: center;
  display: block;
  line-height: 50px;
  width: 50%;
  color: #393939;
  margin: 90px auto !important;
}
.user-tree
  .selected-wrap
  /deep/
  .el-table__empty-block
  .el-table__empty-text:before {
  display: none;
}
/* 自定义 chrome 的滚动条样式 */
.user-tree ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
.user-tree ::-webkit-scrollbar-thumb {
  background: #e2e3e8;
  border-radius: 5px;
  cursor: pointer;
}
div.peoples.only-user /deep/ .el-checkbox__input {
  vertical-align: text-bottom;
}
.peoples /deep/ .el-checkbox__label {
  padding-left: 5px !important;
}
.checkbox-icon {
  vertical-align: text-top;
}
.only-user-icon {
  vertical-align: text-top;
}
.only-user-username {
  width: 75px;
  display: inline-block;
}
.only-user-deptname {
  margin-left: 0px;
}
.cursor {
  cursor: pointer;
}
.tree-wrap /deep/ .el-table__empty-text
 {
   line-height: initial;
 }
</style>
