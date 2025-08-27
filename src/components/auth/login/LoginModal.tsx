"use client";
import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { signIn } from 'next-auth/react';

const LoginModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: { username: string; password: string }) => {
    setConfirmLoading(true);
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    setConfirmLoading(false);
    if (res?.error) {
      message.error("Login failed");
    } else {
      message.success('Login successful');
      closeModal();
    }
  };

  return (
    <div>
      <Button type="primary" onClick={openModal}>
        Sign in
      </Button>

      <Modal
        title="Sign in"
        open={isOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Enter username" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter password" autoComplete="current-password" />
          </Form.Item>

          <Form.Item>
            <Button className='w-full' type="primary" htmlType="submit" loading={confirmLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export { LoginModal };