import { Form, Input, Select, Radio, Button, message, Switch } from 'antd';
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { getMaxTagWeight, createTag } from '../../models/tag';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const TagAdd: React.FC = () => {
  const [form] = Form.useForm();
  const [chooseTodayVisible, setChooseTodayVisible] = useState(false);
  const onFinish = useCallback(async (values: FormValue) => {
    console.log(values);

    const isOk = await createTag(values as TagItem);
    if (isOk) {
      message.success('标签添加成功');
      form.setFieldsValue({
        tagValueList: [],
        tagName: '',
        tagType: '文字',
        tagWeight: values.tagWeight + 100,
        tagRequire: true
      });
      console.log(22);
    } else {
      message.error('标签添加失败');
    }
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      tagType: '文字',
      tagRequire: true,
      tagValueList: [],
      timeTagChooseToday: true
    });
    getMaxTagWeight().then(i =>
      form.setFieldsValue({
        tagWeight: i
      })
    );
  }, []);
  const tagTypeChange = (e: any) => {
    e.target.value === '时间'
      ? setChooseTodayVisible(true)
      : setChooseTodayVisible(false);
  };
  return useMemo(
    () => (
      <Form
        form={form}
        name="complex-form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ marginTop: 100 }}
      >
        <Form.Item
          label="标签名"
          name="tagName"
          rules={[{ required: true, message: '标签名必填' }]}
        >
          <Input style={{ width: 160 }} placeholder="请输入标签名" />
        </Form.Item>
        <Form.Item label="标签数据类型" name="tagType">
          <Radio.Group defaultValue="文字" onChange={tagTypeChange}>
            <Radio value="文字">文字</Radio>
            <Radio value="数字">数字</Radio>
            <Radio value="整数">整数</Radio>
            <Radio value="时间">时间</Radio>
          </Radio.Group>
        </Form.Item>
        {chooseTodayVisible ? (
          <Form.Item
            label="是否默认选择当天"
            valuePropName="checked"
            name="timeTagChooseToday"
          >
            <Switch />
          </Form.Item>
        ) : (
          <Form.Item label="标签数据可选项" style={{ marginBottom: 0 }}>
            <Form.Item
              name="tagValueList"
              style={{
                display: 'inline-block',
                width: 'calc(50% - 5px)',
                marginRight: 8
              }}
            >
              <Select mode="tags" />
            </Form.Item>
          </Form.Item>
        )}

        <Form.Item label="标签权重" name="tagWeight">
          <Input style={{ width: 160 }} placeholder="请输入标签名" />
        </Form.Item>
        <Form.Item label="是否必填" valuePropName="checked" name="tagRequire">
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    ),
    [chooseTodayVisible]
  );
};
export default TagAdd;
