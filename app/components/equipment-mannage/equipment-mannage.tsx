/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Popconfirm, message } from 'antd';

import styles from './equipment-mannage.less';
import {
  getEquipmentListAndTableColumn,
  deleteEquipmentByid,
  updateEquipment
} from '../../models/equipment';
import { useDispatch } from 'react-redux';
import { setSpin } from '../../actions/common';
import EquipmentEdit from '../equipment-edit/equipment-edit';

let tagList: TagItem[] = [];
const TagMannage: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // 编辑界面是否显示
  const [editVisible, setEditVisible] = useState<boolean>(false);
  // 设备列表数据
  const [equipmentList, setEquipmentList] = useState<TableItem[]>([]);
  // 单条设备信息用于传递给Edit组件
  const [equipmentInfo, setEquipmentInfo] = useState<TableItem>([]);
  // 表头数据
  const [columnData, setColumnData] = useState<TableItem[]>([]);
  // 数据总条数用于分页组件
  const [pageTotalNum, setPageTotalNum] = useState<number>();
  useEffect(() => {
    getData(1);
  }, []);
  const getData = (pageNum: number) => {
    dispatch(setSpin(true));
    getEquipmentListAndTableColumn(pageNum).then(
      ({ Total, data, formHeader, tagList: tags }) => {
        tagList = tags;
        setColumnData(formHeader);
        setEquipmentList(data);
        setPageTotalNum(Total);
        dispatch(setSpin(false));
      }
    );
  };
  // 编辑设备
  const edit = (record: TableItem) => {
    setEquipmentInfo(record);
    setEditVisible(true);
  };
  // 删除设备
  const deleteEquipment = async (id: string) => {
    const isOk = await deleteEquipmentByid(id);
    if (isOk) {
      setEquipmentList(state => {
        const stateTemp = [...state];
        const index = stateTemp.findIndex(i => i._id === id);
        stateTemp.splice(index, 1);
        return stateTemp;
      });
      message.success('设备删除成功');
      return true;
    } else {
      message.error('设备删除失败');
      return false;
    }
  };
  const handlePageChange = (i: number) => {
    getData(i);
  };
  // 编辑完成
  const onConfirm = async (data: TableItem) => {
    const isOk = await updateEquipment(data);
    if (isOk) {
      setEquipmentList(state => {
        const stateTemp = [...state];
        const index = stateTemp.findIndex(i => i._id === data._id);
        stateTemp[index] = data;
        return stateTemp;
      });
      message.success('设备修改成功');
      return true;
    } else {
      message.error('设备修改失败');
      return false;
    }
  };
  // 关闭编辑框
  const onClose = () => {
    setEditVisible(false);
  };
  const columns = [
    ...columnData,
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_text: string, record: TableItem) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => edit(record)}
              style={{ marginRight: 20 }}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定要删除吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => deleteEquipment(record._id)}
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
          </>
        );
      }
    }
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableItem) => {
        return {
          record,
          dataIndex: col.dataIndex,
          title: col.title
        };
      }
    };
  });
  return (
    <div className={styles.equipmentMannage}>
      {columnData.length > 0 && (
        <Form form={form} component={false}>
          <Table
            bordered
            dataSource={equipmentList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              total: pageTotalNum,
              onChange: handlePageChange
            }}
          />
          {/* 传入设备填入信息和所有的标签 */}
        </Form>
      )}
      <EquipmentEdit
        equipmentInfo={equipmentInfo}
        tagList={tagList}
        visible={editVisible}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </div>
  );
};

export default TagMannage;
