import React, { useEffect, useState, Fragment, useCallback } from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  message,
  InputNumber,
  DatePicker
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getTags, setTags } from '../../actions/tag';
import { createEquipment } from '../../models/equipment';
const formItemStyle = { width: 300 };

const EquipmentAdd: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //记录 打开的自行填写的表单的key
  const [inputList, setInputList] = useState<string[]>([]);
  // 记录 输入了值的 自行填写表单的key
  const [inputHasValueList, setInputHasValueList] = useState<string[]>([]);
  const tagList = useSelector<StoreState, TagItem[]>(state => state.tag.tags);
  useEffect(() => {
    dispatch(getTags());

    return () => {
      dispatch(setTags([]));
    };
  }, []);
  const onFinish = async (values: FormValue) => {
    let data: {} = {};
    for (let key in values) {
      values[key] && (data[key] = values[key]);
    }
    for (let key in data) {
      if (key.includes('custom')) {
        data[key.slice(0, -6)] = data[key];
        delete data[key];
      }
    }
    for (let key in data) {
      data[key]._isAMomentObject && (data[key] = data[key].format());
    }
    const isOk = await createEquipment(data);
    if (isOk) {
      message.success('设备添加成功');
      setInputList([]);
      form.resetFields(Object.keys(values));
    } else {
      message.error('设备添加失败');
    }
  };
  //当有默认值的时候显示输入框
  const toggleInputStatusWhenHasDefault = (i: string) => {
    setInputList(list => {
      !list.includes(i)
        ? list.push(i)
        : list.splice(
            list.findIndex(j => j === i),
            1
          );
      return [...list];
    });
  };
  // 当有默认值却要自行填写表单时
  const hasDefaultInputChange = useCallback(
    (e: React.FormEvent<EventTarget>, i: TagItem) => {
      // 如果表单不是必填的,退出函数
      if (!i.tagRequire) return;
      let value;
      console.log(typeof e, e);

      if (typeof e === 'string' || typeof e === 'number' || e === null) {
        value = e;
      } else {
        const target = e.target as HTMLInputElement;
        value = target.value;
      }
      // 如果表单有值并且该表单没有保存到列表 将该项保存
      if (value && !inputHasValueList.includes(i.key)) {
        setInputHasValueList(list => {
          list.push(i.key);
          return [...list];
        });
        return;
      }
      // 如果表单没值，删除该项
      if (!value) {
        setInputHasValueList(list => {
          list.splice(
            list.findIndex(j => j === i.key),
            1
          );
          return [...list];
        });
      }
    },
    [inputHasValueList]
  );

  // 动态切换是否必填状态（当有默认值却要手动输入时需要）
  const isRequired = useCallback(
    (i: TagItem): boolean => {
      if (!i.tagRequire) return false;
      return !inputHasValueList.includes(i.key);
    },
    [inputHasValueList]
  );
  // 有可选值
  const itemHasValueList = (i: TagItem) => {
    // 自行填写的表单
    let innerInputItem;

    switch (i.tagType) {
      // 如果tagValueList有值
      // 如果是文字类型的标签
      case '文字':
        innerInputItem = (
          <Input
            style={formItemStyle}
            placeholder={`请输入${i.tagName}`}
            onChange={e => hasDefaultInputChange(e, i)}
          />
        );
        break;
      case '数字':
        innerInputItem = (
          <InputNumber
            style={formItemStyle}
            onChange={e => hasDefaultInputChange(e, i)}
            placeholder={`请输入${i.tagName}`}
          />
        );
        break;
      case '整数':
        innerInputItem = (
          <InputNumber
            style={formItemStyle}
            precision={0}
            onChange={e => hasDefaultInputChange(e, i)}
            placeholder={`请输入${i.tagName}`}
          />
        );
        break;
      case '时间':
        innerInputItem = (
          <DatePicker
            style={formItemStyle}
            onChange={e => hasDefaultInputChange(e, i)}
            placeholder={`请输入${i.tagName}`}
          />
        );
    }
    return (
      <Fragment key={i.key}>
        <Form.Item
          key={i.key}
          label={`${i.tagName}`}
          name={i.tagName}
          // dependencies={[`${i.tagName}custom`]}
          rules={[
            {
              required: isRequired(i),
              message: `${i.tagName} 是必填字段`
            }
          ]}
        >
          <Radio.Group>
            {i.tagValueList.map(i => (
              <Radio value={i} key={i}>
                {i}
              </Radio>
            ))}
            <Button
              type="primary"
              onClick={() => toggleInputStatusWhenHasDefault(i.key)}
            >
              自行填写
            </Button>
          </Radio.Group>
        </Form.Item>
        {inputList.includes(i.key) && (
          //  点击自行添加按钮显示的区域
          <Form.Item
            key={`${i.tagName}custom`}
            name={`${i.tagName}custom`}
            wrapperCol={{ offset: 8, span: 16 }}
          >
            {innerInputItem}
          </Form.Item>
        )}
      </Fragment>
    );
  };
  // 没有可选值
  const itemNotHasValueList = (i: TagItem) => {
    let itemInner;
    switch (i.tagType) {
      // 如果tagValueList有值
      // 如果是文字类型的标签
      case '文字':
        itemInner = (
          <Input style={formItemStyle} placeholder={`请输入${i.tagName}`} />
        );
        break;
      case '数字':
        itemInner = (
          <InputNumber
            style={formItemStyle}
            placeholder={`请输入${i.tagName}`}
          />
        );
        break;
      case '整数':
        itemInner = (
          <InputNumber
            style={formItemStyle}
            precision={0}
            placeholder={`请输入${i.tagName}`}
          />
        );
        break;
      case '时间':
        itemInner = (
          <DatePicker
            style={formItemStyle}
            placeholder={`请输入${i.tagName}`}
          />
        );
    }
    return (
      <Form.Item
        label={i.tagName}
        name={i.tagName}
        key={i.key}
        rules={[{ required: i.tagRequire, message: `${i.tagName} 是必填字段` }]}
      >
        {itemInner as JSX.Element}
      </Form.Item>
    );
  };

  const formItem = () =>
    tagList.map(i =>
      i.tagValueList.length > 0 ? itemHasValueList(i) : itemNotHasValueList(i)
    );

  const formItems = () =>
    tagList.length > 0 && (
      <>
        {formItem()}
        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button type="primary" htmlType="submit" style={{ width: 200 }}>
            确定
          </Button>
        </Form.Item>
      </>
    );
  return (
    <Form
      onFinish={onFinish}
      form={form}
      name="complex-form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: 20 }}
    >
      {formItems()}
    </Form>
  );
};
export default EquipmentAdd;
