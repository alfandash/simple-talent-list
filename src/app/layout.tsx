"use client";

import "antd/dist/reset.css"; // Import reset CSS dari Ant Design
import { Layout, Menu, Button } from "antd";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const { Header, Sider, Content } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth", { path: "/" });
    window.location.href = "/";
  };

  // Check if we're on the login page
  const isLoginPage =
    typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <html lang="en">
      <body>
        {isLoginPage ? (
          children
        ) : (
          <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
              <div
                className="logo"
                style={{
                  height: 32,
                  margin: 16,
                  color: "#fff",
                  fontSize: "18px",
                  textAlign: "center",
                  lineHeight: "32px",
                }}
              >
                {collapsed ? "E" : "Efish Talent"}
              </div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["1"]}
                items={[
                  {
                    key: "1",
                    icon: <FileTextOutlined />,
                    label: "Talent List",
                    onClick: () => router.push("/list"),
                  },
                  {
                    key: "2",
                    icon: <UserOutlined />,
                    label: "Profile",
                  },
                ]}
              />
            </Sider>
            <Layout>
              <Header
                style={{
                  padding: "0 16px",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                />
                <Button type="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </Header>
              <Content
                style={{
                  margin: "16px",
                  padding: 24,
                  background: "#fff",
                  minHeight: 280,
                }}
              >
                {children}
              </Content>
            </Layout>
          </Layout>
        )}
      </body>
    </html>
  );
}
