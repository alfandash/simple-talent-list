"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Form, Input, Button, Typography, Card } from "antd";

const { Title } = Typography;

export default function LoginPage() {
  const [error, setError] = useState("");

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    const { username, password } = values;
    if (username === "admin" && password === "password") {
      await Cookies.set("auth", "true", { expires: 1 });
      window.location.href = "/list";
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <Title level={2}>Login</Title>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Card>
  );
}
