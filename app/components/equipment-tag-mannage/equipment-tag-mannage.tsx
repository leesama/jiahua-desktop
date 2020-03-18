/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Tag,
  Table,
  Input,
  InputNumber,
  Form,
  Button,
  Select,
  Popconfirm,
  Switch
} from 'antd';
import styles from './equipment-tag-mannage.less';
import { TableComponents } from '_rc-table@7.1.2@rc-table/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEquipmentTags,
  updateTags,
  deleteTag,
  setEquipmentTags
} from '../../actions/equipment-tag';
import { isNumber } from '@/utils';
const signal = axios.CancelToken.source();
const { Option } = Select;
interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: React.ReactNode;
  inputType:
    | 'number'
    | 'text'
    | 'array'
    | 'radioArray'
    | 'switch'
    | 'timeTagValue';
  record: TagItem;
  index: number;
  children: React.ReactNode;
}
type StoreValue = any;
interface Store {
  [name: string]: StoreValue;
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
      inputNode = (
        <Form.Item name={dataIndex}>
          <InputNumber />
        </Form.Item>
      );
      break;
    case 'text':
      inputNode = (
        <Form.Item name={dataIndex}>
          <Input />
        </Form.Item>
      );
      break;
    case 'timeTagValue':
      inputNode = (
        <Form.Item>
          <Button type="link">时间类型值以填写当日日期作为默认值</Button>
        </Form.Item>
      );
      break;
    case 'array':
      inputNode = (
        <Form.Item
          name={dataIndex}
          dependencies={['tagType']}
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value: []) {
                if (getFieldValue('tagType') === '整数') {
                  return value.some(i => !/^\d+$/.test(i))
                    ? Promise.reject('当前标签可选值必须为整数!')
                    : Promise.resolve();
                }
                if (getFieldValue('tagType') === '数字') {
                  return value.some(i => !isNumber(i))
                    ? Promise.reject('当前标签可选值必须为数字!')
                    : Promise.resolve();
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <Select mode="tags" />
        </Form.Item>
      );
      break;
    case 'radioArray':
      inputNode = (
        <Form.Item name={dataIndex}>
          <Select>
            <Option value="文字">文字</Option>
            <Option value="数字">数字</Option>
            <Option value="整数">整数</Option>
            <Option value="时间">时间</Option>
          </Select>
        </Form.Item>
      );
      break;
    case 'switch':
      inputNode = (
        <Form.Item name={dataIndex} valuePropName="checked">
          <Switch />
        </Form.Item>
      );
      break;
    default:
      break;
  }

  return (
    <td {...restProps}>{editing ? (inputNode as JSX.Element) : children}</td>
  );
};

const TagMannage: React.FC = () => {
  // 用useRef保存编辑之前的store数据，因为要通过改变store数据来切换组件
  const stateBeforeEdit = useRef<TagItem[]>();
  const dispatch = useDispatch();
  const [editingKey, setEditingKey] = useState('');
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(getEquipmentTags());
    return () => {
      signal.cancel();
      dispatch(setEquipmentTags([]));
    };
  }, []);
  const isEditing = (record: TagItem) => record.key === editingKey;
  const edit = (record: TagItem) => {
    stateBeforeEdit.current = JSON.parse(JSON.stringify(tagList));
    console.log(stateBeforeEdit.current, 111);
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    stateBeforeEdit.current &&
      dispatch(setEquipmentTags(stateBeforeEdit.current));
    setEditingKey('');
  };

  const deleteT = (key: string, tagList: TagItem[]) => {
    dispatch(deleteTag(key, tagList));
  };

  const save = async (key: string) => {
    try {
      const row = (await form.validateFields()) as TagItem;
      const newData = [...tagList];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        newData.sort((a, b) => a.tagWeight - b.tagWeight);
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
    {
      title: '标签名',
      dataIndex: 'tagName',
      key: 'tagName',
      editable: false
    },
    {
      title: '标签类型',
      dataIndex: 'tagType',
      key: 'tagType',
      editable: true
    },
    {
      title: '标签可选值',
      dataIndex: 'tagValueList',
      key: 'tagValueList',
      render: (_text: string, record: TagItem) => {
        if (record.tagType === '时间') return null;
        return record.tagValueList.length === 0 ? (
          <Tag
            color="gold"
            key="gold"
            style={{ height: 30, paddingBottom: 30 }}
          >
            暂未设置标签可选值
          </Tag>
        ) : (
          record.tagValueList.map(i => (
            <Tag color="blue" key={i} style={{ height: 30, paddingBottom: 30 }}>
              {i}
            </Tag>
          ))
        );
      },
      editable: true
    },
    {
      title: '标签权重',
      dataIndex: 'tagWeight',
      key: 'tagWeight',
      editable: true
    },
    {
      title: '是否必填',
      dataIndex: 'tagRequire',
      key: 'tagRequire',
      render: (_text: string, record: TagItem) =>
        record.tagRequire ? <span>是</span> : <span>否</span>,
      editable: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_text: string, record: TagItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Button type="link" onClick={() => cancel()}>
              取消
            </Button>
          </span>
        ) : (
          <>
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
  } as TableComponents<TagItem>;

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TagItem) => {
        let inputType: string;
        switch (col.dataIndex) {
          case 'tagWeight':
            inputType = 'number';
            break;
          case 'tagValueList':
            record.tagType === '时间'
              ? (inputType = 'timeTagValue')
              : (inputType = 'array');
            break;
          case 'tagType':
            inputType = 'radioArray';
            break;
          case 'tagRequire':
            inputType = 'switch';
            break;
          default:
            inputType = 'text';
            break;
        }
        return {
          record,
          inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        };
      }
    };
  });
  // 监听表单的单选框变化，变化后修改数据
  const onValuesChange = (changedValues: Store, allValues: Store) => {
    if (!changedValues.tagType) {
      return;
    }
    tagList[tagList.findIndex(i => i.key === allValues.key)].tagType =
      changedValues.tagType;
    allValues.key;
    dispatch(setEquipmentTags([...tagList]));
  };
  return (
    <div className={styles.tagMannage}>
      <Form form={form} component={false} onValuesChange={onValuesChange}>
        {tagList.length > 0 && (
          <Table
            components={components}
            bordered
            dataSource={tagList}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel
            }}
          />
        )}
      </Form>
    </div>
  );
};

export default TagMannage;
