import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Row, Col, Button, Input, Space, Radio, Typography } from 'antd';
import { PauseOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import classes from './app.module.css';

function App() {
  const [value, setValue] = useState('north_female_lien');

  const handleChangeVoice = (e: any) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  return (
    <Provider store={store}>
      <Row className={`${classes['app-background']}`} justify='center' align='middle'>
        <Col span={10}>
          <Input.TextArea rows={7} placeholder="Text to speech..." />
          <Typography className="mt-3">Chọn giọng đọc</Typography>
          <Radio.Group onChange={handleChangeVoice} value={value} className="mt-2 mb-5">
            <Radio value={'north_female_lien'}>Giọng nữ miền Bắc</Radio>
            <Radio value={'north_male_hieu'}>Giọng Nam miền Bắc</Radio>
          </Radio.Group>
          <Row justify={'center'}>
            <Col className="mt-3">
              <Space>
                <Button type="primary" icon={<PauseOutlined /> }>Nghe</Button>
                <Button icon={<CloudDownloadOutlined /> }>Tải xuống</Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Provider>
  )
}

export default App
