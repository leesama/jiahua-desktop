import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useMemo
} from 'react';
import { Form, Input, Radio, Button, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import { momentFormat } from '@/config';
import styles from './form-edit-dynamic-fields.less';
const formItemStyle = { width: 300 };
const momentTime = moment();
moment.locale();
let timeFields = {};
const FormEditDynamicFileds: React.FC<{
  tagList: TagItem[];
  defaultTagsValue?: TableItem;
  onFinsh: (data: TableItem) => Promise<boolean>;
}> = ({ tagList, defaultTagsValue, onFinsh }) => {
  const [form] = Form.useForm();
  //记录 打开的自行填写的表单的key
  const [inputList, setInputList] = useState<string[]>([]);
  // 记录 输入了值的 自行填写表单的key
  const [inputHasValueList, setInputHasValueList] = useState<string[]>([]);
  // 设置表单默认值 ,因为会用到form实例需要等表单渲染成功之后在执行，使用effect  tagList
  useEffect(() => {
    if (defaultTagsValue) {
      // 如果有默认值
      // 所有时间标签名组成的数组
      const fieldsValue: TableItem = { ...defaultTagsValue };
      const timeTagNameArr = tagList
        .filter(i => i.tagType == '时间')
        .map(i => i.tagName);
      // 时间标签设置成默认值
      for (const j of timeTagNameArr) {
        defaultTagsValue[j] &&
          (fieldsValue[j] = moment(defaultTagsValue[j], momentFormat));
      }
      // 有默认值的标签
      const tagsHasValueList = tagList.filter(
        i => i.tagValueList && i.tagValueList.length > 0
      );
      // 如果有默认值的标签值不属于默认值,也就是其手动输入的,设置手动输入框
      for (const i of tagsHasValueList) {
        const tagName = i.tagName;
        const tagValue = defaultTagsValue[tagName];
        if (tagValue && !i.tagValueList.includes(tagValue)) {
          setInputList([i.key]);
          setInputHasValueList([i.key]);
          form.setFieldsValue({ [`${tagName}custom`]: tagValue });
        }
      }
      form.setFieldsValue(fieldsValue);
    } else {
      for (const i of tagList) {
        if (i.tagType === '时间') {
          timeFields[i.tagName] = momentTime;
        }
      }
      form.setFieldsValue(timeFields);
    }
  }, [tagList]);
  const submit = () => {
    form.submit();
  };
  const finish = async (values: FormValue) => {
    // 绑定id信息
    let data: TableItem = {};
    if (defaultTagsValue) {
      data._id = defaultTagsValue._id;
    }
    // 筛选掉空数据
    for (let key in values) {
      values[key] && (data[key] = values[key]);
    }

    // 将有可选数据却要手动输入的表单的手动输入数据绑定到该表单上
    for (let key in data) {
      if (key.includes('custom')) {
        data[key.slice(0, -6)] = data[key];
        delete data[key];
      }
    }
    // 时间对象转换为字符串
    for (let key in data) {
      data[key]._isAMomentObject &&
        (data[key] = data[key].format(momentFormat));
    }
    const isOk = await onFinsh(data);
    if (isOk) {
      setInputList([]);
      form.resetFields(Object.keys(values));
      form.setFieldsValue(timeFields);
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
    (e: any, i: TagItem) => {
      // 如果表单不是必填的,退出函数
      if (!i.tagRequire) return;
      let value;
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
            format={momentFormat}
            showTime={{ format: 'HH:mm:ss' }}
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
            format={momentFormat}
            showTime={{ format: 'HH:mm:ss' }}
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

  const formItems = () =>
    tagList.map(i => {
      if (i.tagType === '时间') return itemNotHasValueList(i);
      return i.tagValueList.length > 0
        ? itemHasValueList(i)
        : itemNotHasValueList(i);
    });

  return (
    <div className={styles.formEdit}>
      <Form
        onFinish={finish}
        form={form}
        name="complex-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ marginTop: 20 }}
      >
        {tagList.length > 0 && formItems()}
      </Form>
      {tagList.length > 0 && (
        <Button
          type="primary"
          onClick={submit}
          htmlType="submit"
          style={{ width: 200 }}
        >
          确定
        </Button>
      )}
    </div>
  );
};
export default FormEditDynamicFileds;
