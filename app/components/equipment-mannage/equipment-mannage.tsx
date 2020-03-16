/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Tag,
  Table,
  Input,
  InputNumber,
  Form,
  Button,
  Select,
  Popconfirm
} from 'antd';

import styles from './equipment-mannage.less';
import { getEquipmentListAndTableColumn } from '../../models/equipment';
import { useDispatch } from 'react-redux';
import { setSpin } from '../../actions/common';
import EquipmentEdit from '../equipment-edit/equipment-edit';
const { Option } = Select;

let tagList: TagItem[] = [];
const TagMannage: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // 需要编辑的项
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
  const edit = (record: TableItem) => {
    setEquipmentInfo(record);
    setEditVisible(true);
  };

  const handlePageChange = (i: number) => {
    getData(i);
  };
  // 编辑完成
  const onConfirm = async (data: TableItem) => {
    console.log(data);
  };
  // 关闭编辑框
  const onClose = () => {
    setEditVisible(false);
  };
  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as TableItem;
      const newData = [...tagList];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        dispatch(updateTags(item._id, row, newData));
      } else {
        newData.push(row);
        // setData(newData)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
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
              onConfirm={() => deleteT(record.key, tagList)}
            >
              <Button
                type="danger"
                // onClick={() => deleteTag(record)}
              >
                删除
              </Button>
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
