import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Tag, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCommonDrawerVisible,
  setCommonTagList
} from '@/actions/equipment-statistics';
import { setCommonUseEquipmentTag } from '@/models/common';
const { CheckableTag } = Tag;
const AddCommonTag: React.FC = () => {
  const [commonTagArray, setCommonTagArray] = useState<string[]>([]);
  const dispatch = useDispatch();
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  const commonTagList = useSelector<StoreState, string[]>(
    state => state.equipmentStatistics.commonTagList
  );
  // 初始化常用标签数据数据
  useEffect(() => {
    setCommonTagArray(commonTagList);
  }, [commonTagList]);
  // 抽屉开关状态
  const drawerVisible = useSelector<StoreState, boolean>(
    state => state.equipmentStatistics.commonDrawerVisible
  );
  // 标签名数组
  const tagNameArray = useMemo(() => tagList.map(i => i.tagName), [tagList]);

  const closeDrawer = () => {
    dispatch(setCommonDrawerVisible(false));
  };
  const tagChange = (checked: boolean, i: string) => {
    if (checked) {
      setCommonTagArray(tags => {
        const tempTags = [...tags];
        tempTags.push(i);
        return tempTags;
      });
    } else {
      setCommonTagArray(tags => {
        const tempTags = [...tags];
        tempTags.splice(
          tempTags.findIndex(j => i === j),
          1
        );
        return tempTags;
      });
    }
  };
  // 确定修改
  const confirm = async () => {
    const isOk = await setCommonUseEquipmentTag(commonTagArray);
    if (isOk) {
      message.success('修改常用标签成功');
      dispatch(setCommonTagList(commonTagArray));
      closeDrawer();
    } else {
      message.error('修改常用标签失败');
    }
  };
  // 取消修改
  const cancel = () => {
    setCommonTagArray(commonTagList);
    closeDrawer();
  };
  return (
    <>
      <Drawer
        title="添加常用统计项"
        width="600"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <div className="mb-32">
          {tagNameArray.map(i => (
            <CheckableTag
              checked={commonTagArray.includes(i)}
              key={i}
              onChange={checked => tagChange(checked, i)}
              style={{
                border: '1px solid #1c5197',
                width: 100,
                height: 40,
                lineHeight: '40px',
                marginBottom: 20,
                textAlign: 'center'
              }}
            >
              {i}
            </CheckableTag>
          ))}
        </div>
        <div className="flex center">
          <Button type="primary" onClick={confirm}>
            确定
          </Button>
          <Button type="primary" onClick={cancel} style={{ marginLeft: 50 }}>
            取消
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default AddCommonTag;
