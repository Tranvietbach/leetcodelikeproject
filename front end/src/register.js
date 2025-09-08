import React, { useState } from 'react';
import { Form, Input, Button, Upload, Avatar, Typography, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Title } = Typography;

const RegisterForm = () => {
  const [payload, setPayload] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    country: '',
    githubUrl: '',
    bio: '',
    avatarBase64: ''
  });
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPayload((prev) => ({ ...prev, avatarBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:2109/api/register', payload);
      alert('Đăng ký thành công!');
      navigate('/login');
      
    } catch (err) {
      alert('Đăng ký thất bại! ' + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <Card
        style={{
          padding: 24,
          borderRadius: 16,
          backgroundColor: '#00a45a',
          color: '#fff',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}
      >
        <Title level={3} style={{ color: '#ffffffff', textAlign: 'center' }}>
          Register
        </Title>

        <Form style={{ color: '#ffffffff'}} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" required>
            <Input name="username" value={payload.username} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input name="email" type="email" value={payload.email} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Password" required>
            <Input.Password name="password" value={payload.password} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Full Name(optional)">
            <Input name="fullName" value={payload.fullName} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Country(optional)">
            <Input name="country" value={payload.country} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="GitHub URL(optional)">
            <Input name="githubUrl" value={payload.githubUrl} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Bio(optional)">
            <Input.TextArea name="bio" rows={3} value={payload.bio} onChange={handleInputChange} />
          </Form.Item>

          <Form.Item label="Avatar(optional)">
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={({ file }) => handleFileChange({ file })}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {payload.avatarBase64 && (
              <div style={{ marginTop: 10 }}>
                <Avatar shape="square" size={100} src={payload.avatarBase64} />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              style={{ backgroundColor: '#40a9ff', borderColor: '#40a9ff' }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;
