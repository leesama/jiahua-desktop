import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Drawer, Button, Select, message } from 'antd';
import FormEditDynamicFileds from '../common/form-edit-dynamic-fileds/form-edit-dynamic-fileds';

const EquipmentEdit: React.FC<{
  equipmentInfo: TableItem;
  tagList: TagItem[];
  visible: boolean;
  onConfirm: (data: TableItem) => Promise<boolean>;
  onClose: () => void;
}> = ({ equipmentInfo, tagList, visible, onConfirm, onClose }) => {
  /**
   * 如果 onConfirm返回值为真，关闭编辑面板
   * @param data 修改后的数据
   */

  const onFinsh = async (data: TableItem) => {
    // 如果修改成功,关闭页面，弹出提示
    const isOk = await onConfirm(data);
    if (isOk) {
      onClose();
      return true;
    } else {
      return false;
    }
  };
  return (
    <Drawer
      title="修改设备信息"
      width={1100}
      onClose={onClose}
      visible={visible}
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
