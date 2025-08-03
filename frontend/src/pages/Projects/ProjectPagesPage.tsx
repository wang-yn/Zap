import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Dropdown, 
  message,
  Modal,
  Form,
  Input,
  Empty,
  Spin,
  Breadcrumb,
  Space
} from 'antd';
import { 
  PlusOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CopyOutlined,
  FileTextOutlined,
  HomeOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { formatTime } from '../../utils';

const { Title, Text, Paragraph } = Typography;

interface Page {
  id: string;
  name: string;
  path: string;
  title?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

export const ProjectPagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 加载项目信息
  const loadProject = async () => {
    if (!projectId) return;
    
    try {
      const response = await api.get(`/projects/${projectId}`);
      setProject(response);
    } catch (error) {
      console.error('加载项目失败:', error);
      message.error('加载项目失败');
    }
  };

  // 加载页面列表
  const loadPages = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}/pages`);
      setPages(response || []);
    } catch (error) {
      console.error('加载页面失败:', error);
      message.error('加载页面失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadPages();
    }
  }, [projectId]);

  // 创建页面
  const handleCreatePage = async (values: { name: string; path: string; title?: string }) => {
    if (!projectId) return;
    
    try {
      const pageData = {
        ...values,
        projectId,
        components: [],
        layout: {
          background: '#ffffff',
          padding: 16
        },
        isPublished: false
      };
      
      const response = await api.post('/pages', pageData);
      message.success('页面创建成功');
      setCreateModalOpen(false);
      form.resetFields();
      await loadPages();
      
      // 跳转到编辑器
      navigate(`/projects/${projectId}/pages/${response.id}`);
    } catch (error: any) {
      console.error('创建页面失败:', error);
      message.error(error.response?.data?.message || '创建页面失败');
    }
  };

  // 删除页面
  const handleDeletePage = async (pageId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除这个页面吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.delete(`/pages/${pageId}`);
          message.success('页面删除成功');
          await loadPages();
        } catch (error: any) {
          console.error('删除页面失败:', error);
          message.error(error.response?.data?.message || '删除页面失败');
        }
      }
    });
  };

  // 复制页面
  const handleCopyPage = (page: Page) => {
    setCreateModalOpen(true);
    form.setFieldsValue({
      name: `${page.name} (副本)`,
      path: `${page.path}-copy`,
      title: page.title
    });
  };

  // 编辑页面
  const handleEditPage = (pageId: string) => {
    navigate(`/projects/${projectId}/pages/${pageId}`);
  };

  // 预览页面
  const handlePreviewPage = (pageId: string) => {
    window.open(`/preview/${projectId}/${pageId}`, '_blank');
  };

  // 页面卡片的下拉菜单
  const getPageMenuItems = (page: Page) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditPage(page.id)
    },
    {
      key: 'preview',
      label: '预览',
      icon: <EyeOutlined />,
      onClick: () => handlePreviewPage(page.id)
    },
    {
      key: 'copy',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => handleCopyPage(page)
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeletePage(page.id)
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/dashboard')}
            style={{ padding: 0 }}
          >
            首页
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            onClick={() => navigate('/projects')}
            style={{ padding: 0 }}
          >
            项目管理
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{project?.name || '项目'}</Breadcrumb.Item>
      </Breadcrumb>

      {/* 页面头部 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Space style={{ marginBottom: 8 }}>
            <Button 
              type="text" 
              icon={<LeftOutlined />} 
              onClick={() => navigate('/projects')}
            >
              返回项目列表
            </Button>
          </Space>
          <Title level={2} style={{ margin: 0 }}>
            {project?.name} - 页面管理
          </Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
            {project?.description || '管理项目中的所有页面'}
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setCreateModalOpen(true)}
        >
          创建页面
        </Button>
      </div>

      {/* 页面列表 */}
      <Spin spinning={loading}>
        {pages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">还没有页面</Text>
                <br />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  style={{ marginTop: 16 }}
                  onClick={() => setCreateModalOpen(true)}
                >
                  创建第一个页面
                </Button>
              </div>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            {pages.map((page) => (
              <Col xs={24} sm={12} md={8} lg={6} key={page.id}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    <div
                      style={{
                        height: 120,
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleEditPage(page.id)}
                    >
                      <FileTextOutlined style={{ fontSize: '32px' }} />
                    </div>
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditPage(page.id)}
                    >
                      编辑
                    </Button>,
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />}
                      onClick={() => handlePreviewPage(page.id)}
                    >
                      预览
                    </Button>,
                    <Dropdown
                      menu={{ items: getPageMenuItems(page) }}
                      placement="bottomRight"
                      trigger={['click']}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Text strong style={{ fontSize: '16px' }}>
                          {page.name}
                        </Text>
                        <Text style={{ color: page.isPublished ? '#52c41a' : '#faad14', fontSize: '12px' }}>
                          ● {page.isPublished ? '已发布' : '草稿'}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          路径: {page.path}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          更新于 {formatTime(page.updatedAt)}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {/* 创建页面模态框 */}
      <Modal
        title="创建新页面"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePage}
        >
          <Form.Item
            name="name"
            label="页面名称"
            rules={[
              { required: true, message: '请输入页面名称' },
              { max: 100, message: '页面名称不能超过100个字符' }
            ]}
          >
            <Input placeholder="请输入页面名称" />
          </Form.Item>
          
          <Form.Item
            name="path"
            label="页面路径"
            rules={[
              { required: true, message: '请输入页面路径' },
              { pattern: /^\/[a-zA-Z0-9\-_\/]*$/, message: '路径格式不正确，应以/开头，只能包含字母、数字、短横线和下划线' }
            ]}
          >
            <Input placeholder="例如: /home, /about" />
          </Form.Item>

          <Form.Item
            name="title"
            label="页面标题"
            rules={[
              { max: 200, message: '页面标题不能超过200个字符' }
            ]}
          >
            <Input placeholder="页面标题（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};