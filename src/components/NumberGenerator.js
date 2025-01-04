import React from 'react';
import { Form, InputNumber, Button, Card, Switch } from 'antd';

const NumberGenerator = ({ onGenerate, onModeChange }) => {
  const [form] = Form.useForm();

  const handleGenerate = (values) => {
    const { start, end, count } = values;
    const numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i.toString());
    }
    onGenerate(numbers);
  };

  return (
    <Card title="Number Generation">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleGenerate}
        initialValues={{ start: 1, end: 100, count: 1 }}
      >
        <Form.Item
          label="Start Number"
          name="start"
          rules={[{ required: true, message: 'Please input start number' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="End Number"
          name="end"
          rules={[{ required: true, message: 'Please input end number' }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="No Repeat Drawing">
          <Switch onChange={(checked) => onModeChange(checked)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Generate Numbers
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NumberGenerator; 