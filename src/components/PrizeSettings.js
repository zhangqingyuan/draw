import React from 'react';
import { Form, Input, InputNumber, Button, Space, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const PrizeSettings = ({ onSettingsChange }) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_, allValues) => {
    onSettingsChange(allValues);
  };

  return (
    <Card title="Prize Categories">
      <Form
        form={form}
        onValuesChange={handleValuesChange}
        initialValues={{ prizes: [{ name: '', count: 1 }] }}
      >
        <Form.List name="prizes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Prize name is required' }]}
                  >
                    <Input placeholder="Prize Name" style={{ width: 200 }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'count']}
                    rules={[{ required: true, message: 'Winner count is required' }]}
                  >
                    <InputNumber min={1} placeholder="Winners" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Prize Category
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Card>
  );
};

export default PrizeSettings; 