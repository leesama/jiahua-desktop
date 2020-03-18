import React, { useEffect } from 'react';
import FormEditDynamicFileds from '../common/form-edit-dynamic-fileds/form-edit-dynamic-fileds';
import { getEquipmentTags, setEquipmentTags } from '@/actions/equipment-tag';
import { useDispatch, useSelector } from 'react-redux';
import { createEquipment } from '@/models/equipment';
import { message } from 'antd';
const EquipmentAdd: React.FC = () => {
  const dispatch = useDispatch();
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  useEffect(() => {
    dispatch(getEquipmentTags());
    return () => {
      dispatch(setEquipmentTags([]));
    };
  }, []);
  const onFinsh = async (data: TableItem) => {
    const isOk = await createEquipment(data);
    if (isOk) {
      message.success('设备添加成功');
      return true;
    } else {
      message.error('设备添加失败');
      return false;
    }
  };
  return <FormEditDynamicFileds tagList={tagList} onFinsh={onFinsh} />;
};
export default EquipmentAdd;
