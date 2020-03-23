import React, { useState, useEffect, useMemo } from 'react';
import { Select, Button } from 'antd';
import { Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCommonAndAllEquipmentTag,
  setCommonDrawerVisible
} from '@/actions/equipment-statistics';
import AddCommonTag from './add-common-tag';
import { getGroupInfoByTagName } from '@/models/equipment';
const { Option } = Select;
const EquipmentStatistics: React.FC = () => {
  const dispatch = useDispatch();
  // 所有标签
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  // 常用标签
  const commonTagList = useSelector<StoreState, string[]>(
    state => state.equipmentStatistics.commonTagList
  );
  // 下拉标签
  const selectTagList = useMemo(
    () => tagList.filter(i => !commonTagList.includes(i.tagName)),
    [commonTagList]
  );
  // 标签数据
  useEffect(() => {
    dispatch(getCommonAndAllEquipmentTag());
  }, []);
  const showDrawer = () => {
    dispatch(setCommonDrawerVisible(true));
  };
  // 点击标签按钮
  const tagNameBtnClick = async i => {
    console.log(await getGroupInfoByTagName(i));
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a style={{ marginRight: 16 }}>Invite {record.name}</a>
          <a>Delete</a>
        </span>
      )
    }
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ];

  return (
    <>
      <div className="flex">
        <div>
          <Select
            showSearch
            placeholder="按标签类型搜索"
            style={{ minWidth: 200 }}
          >
            {selectTagList.map(i => (
              <Option value={i.tagName}>{i.tagName}</Option>
            ))}
          </Select>
        </div>
        <div className="flex-1 mr-20">
          {commonTagList.map(i => (
            <Button
              key={i}
              type="primary"
              onClick={() => tagNameBtnClick(i)}
              style={{ marginLeft: 20, marginBottom: 20 }}
            >
              {i}
            </Button>
          ))}
        </div>
        <Button
          style={{ backgroundColor: 'rgb(0, 119, 255)', color: '#fff' }}
          onClick={showDrawer}
        >
          添加常用统计项
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <AddCommonTag />
    </>
  );
};

export default EquipmentStatistics;
