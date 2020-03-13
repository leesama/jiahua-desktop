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

import { TableComponents } from '_rc-table@7.1.2@rc-table/lib/interface';
import styles from './equipment-mannage.less';
import { getEquipmentListAndTableColumn } from '../../models/equipment';
import { useDispatch } from 'react-redux';
import { setSpin } from '../../actions/common';
import EquipmentEdit from '../equipment-edit/equipment-edit';
const { Option } = Select;
interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: React.ReactNode;
  inputType: 'number' | 'text' | 'array' | 'radioArray';
  record: TableItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;
  switch (inputType) {
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'text':
      inputNode = <Input />;
      break;
    case 'array':
      inputNode = <Select mode="tags" />;
      break;
    case 'radioArray':
      inputNode = (
        <Select>
          <Option value="文字">文字</Option>
          <Option value="数字">数字</Option>
          <Option value="整数">整数</Option>
          <Option value="时间">时间</Option>
        </Select>
      );
      break;
    default:
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          {inputNode as JSX.Element}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
let equipmentAllInfo: TagItem[];
const TagMannage: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  // 需要编辑的项
  const [editingKey, setEditingKey] = useState('');
  // 设备列表数据
  const [equipmentList, setEquipmentList] = useState<TableItem[]>([]);
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
      ({ Total, data, formHeader, tagList }) => {
        equipmentAllInfo = tagList;
        setColumnData(formHeader);
        setEquipmentList(data);
        setPageTotalNum(Total);
        dispatch(setSpin(false));
      }
    );
  };
  const isEditing = (record: TableItem) => record.key === editingKey;
  const edit = (record: TableItem) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  const handlePageChange = (i: number) => {
    getData(i);
  };
  // 取消编辑状态
  const onCloseDrawer = () => {
    setEditingKey('');
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
        setEditingKey('');
      } else {
        newData.push(row);
        // setData(newData)

        setEditingKey('');
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
        const editable = isEditing(record);
        return (
          <>
            {editable && (
              // 传入设备填入信息和所有的标签
              <EquipmentEdit
                equipmentInfo={record}
                equipmentAllInfo={equipmentAllInfo}
                visible={editable}
                onClose={onCloseDrawer}
              />
            )}
            <Button
              type="primary"
              disabled={editingKey !== ''}
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
                disabled={editingKey !== ''}
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

  const components = {
    body: {
      cell: EditableCell
    }
  } as TableComponents<TableItem>;

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableItem) => {
        let inputType: string;
        switch (col.dataIndex) {
          case 'tagWeight':
            inputType = 'number';
            break;
          case 'tagValueList':
            inputType = 'array';
            break;
          case 'tagType':
            inputType = 'radioArray';
            break;
          default:
            inputType = 'text';
            break;
        }
        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title
          // editing: isEditing(record)
        };
      }
    };
  });
  return (
    <div className={styles.equipmentMannage}>
      {columnData.length > 0 && (
        <Form form={form} component={false}>
          <Table
            components={components}
            bordered
            dataSource={equipmentList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              total: pageTotalNum,
              onChange: handlePageChange
            }}
          />
        </Form>
      )}
    </div>
  );
};

export default TagMannage;
