import React, { useState } from 'react';
import { Row, Col, Button, Input, Space, Radio, Typography, RadioChangeEvent } from 'antd';
import { PauseOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import classes from './app.module.css';
import { useLazyGetVoiceQuery } from '@/redux/services/voice';

function App() {
  const [paragraph, setParagraph] = useState<string>('Tuyên ngôn độc lập văn kiện có ý nghĩa lịch sử sống còn với vận mệnh dân tộc.');
  const [voice, setVoice] = useState('north_female_lien');
  const [trigger, result, lastPromiseInfo] = useLazyGetVoiceQuery()

  console.log('xxx ~> ', import.meta.env)

  const onListen = () => {
    trigger({ voice, paragraph })
  }

  return (
    <>
      <Row className={classes['app-background']} justify='center' align='middle'>
        <Col md={{ span: 16 }} lg={{ span: 10 }}>
          <Input.TextArea
            value={paragraph}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setParagraph(event.target.value)}
            rows={7}
            placeholder="Text to speech..." />
          <Typography className="mt-3">Chọn giọng đọc</Typography>
          <Radio.Group
            onChange={(evt: RadioChangeEvent) => setVoice(evt.target.value)}
            value={voice}
            className="mt-2 mb-5">
            <Radio value={'north_female_lien'}>Giọng nữ miền Bắc</Radio>
            <Radio value={'north_male_hieu'}>Giọng Nam miền Bắc</Radio>
          </Radio.Group>
          <Row justify={'center'}>
            <Col className="mt-3">
              <Space>
                <Button onClick={onListen} type="primary" icon={<PauseOutlined /> }>Nghe</Button>
                <Button icon={<CloudDownloadOutlined /> }>Tải xuống</Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default App
