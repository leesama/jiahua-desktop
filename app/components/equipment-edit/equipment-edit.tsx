import React, { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormEditDynamicFileds from '../common/form-edit-dynamic-fileds/form-edit-dynamic-fileds';
import moment from 'moment';
import { momentFormat } from '@/config';

const { Option } = Select;

const EquipmentEdit: React.FC<{
  equipmentInfo: TableItem;
  tagList: TagItem[];
  visible: boolean;
  onConfirm: (data: TableItem) => Promise<boolean>;
  onClose: () => void;
}> = ({ equipmentInfo, tagList, visible, onConfirm, onClose }) => {
  console.log(equipmentInfo, -11);

  /**
   * 如果 onConfirm返回值为真，关闭编辑面板
   * @param data 修改后的数据
   */
  const onFinsh = async (data: TableItem) => {
    // const isOk = await createEquipment(data);
    // if (isOk) {
    //   message.success('设备添加成功');
    //   return true;
    // } else {
    //   message.error('设备添加失败');
    //   return false;
    // }
    const isOk = await onConfirm(data);
    if (isOk) {
      onClose();
    }
  };
  return (
    <Drawer
      title="修改设备信息"
      width={1100}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button style={{ marginRight: 8 }}>取消</Button>
          <Button type="primary">确定</Button>
        </div>
      }
    >
      {visible && (
        <FormEditDynamicFileds
          tagList={tagList}
          onFinsh={onFinsh}
          defaultTagsValue={equipmentInfo}
        />
      )}
    </Drawer>
  );
};

export default EquipmentEdit;
