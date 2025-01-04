import React from 'react';
import { Table, Card } from 'antd';
import moment from 'moment';

const DrawHistory = ({ history }) => {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Prize',
      dataIndex: 'prizeName',
      key: 'prizeName',
    },
    {
      title: 'Winner',
      dataIndex: 'winner',
      key: 'winner',
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
    },
  ];

  return (
    <Card title="Drawing History">
      <Table
        columns={columns}
        dataSource={history}
        rowKey={(record) => record.timestamp}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default DrawHistory; 