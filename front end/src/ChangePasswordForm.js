import React, { useEffect, useState } from 'react';
import { Form, Button, message, Card } from 'antd';
import { Password } from 'primereact/password';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ChangePasswordForm = () => {
      const [user, setUser] = useState(null);
    
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
    useEffect(() => {
    axios.get(`http://localhost:2109/api/users/${localStorage.getItem("token")}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);
  const onFinish = async (values) => {
    if (!user.statusmail) {
      alert("chưa xác thực email, vui lòng xác thực email trước khi đổi mật khẩu");
        navigate('/Profile');
      return;
    }
    const { oldPassword, newPassword, confirmPassword } = values;
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Chưa đăng nhập');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
    
      const response = await axios.put('http://localhost:2109/api/new/change-password', {
        token, oldPassword, newPassword, confirmPassword
      });

      message.success('Đổi mật khẩu thành công');
        navigate('/login');

    } catch (error) {
      const errorMsg = error.response?.data || 'Đã có lỗi xảy ra';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Đổi mật khẩu" style={{ maxWidth: 500, margin: 'auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true }]}>
          <Password toggleMask feedback={false} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
          <Password toggleMask style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true }]}>
          <Password toggleMask style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ChangePasswordForm;
