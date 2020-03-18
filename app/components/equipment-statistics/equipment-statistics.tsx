import React, { useState, useEffect } from 'react';
import { Select, Button, Drawer, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonAndAllEquipmentTag } from '@/models/common';
const { Option } = Select;

const EquipmentStatistics: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  useEffect(() => {
    getCommonAndAllEquipmentTag().then(i => console.log(i));
  }, []);
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <Select defaultValue="lucy">
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>
            Disabled
          </Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
      <Button type="primary" onClick={showDrawer}>
        添加常用统计项
      </Button>
      <Drawer
        title="添加常用统计项"
        width="600"
        placement="right"
        closable={drawerVisible}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        {tagList.map(i => (
          <Tag color="magenta">{i.tagName}</Tag>
        ))}
      </Drawer>
    </div>
  );
};

export default EquipmentStatistics;
