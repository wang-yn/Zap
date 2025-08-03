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
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  CopyOutlined,
  FolderOpenOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatTime } from '../../utils';

const { Title, Text, Paragraph } = Typography;

interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 加载项目列表
  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.getProjects();
      setProjects(response || []);
    } catch (error) {
      console.error('加载项目失败:', error);
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 创建项目
  const handleCreateProject = async (values: { name: string; description?: string }) => {
    try {
      const response = await api.createProject(values);
      message.success('项目创建成功');
      setCreateModalOpen(false);
      form.resetFields();
      await loadProjects();
      
      // 跳转到编辑器
      navigate(`/projects/${response.id}/editor`);
    } catch (error: any) {
      console.error('创建项目失败:', error);
      message.error(error.response?.data?.message || '创建项目失败');
    }
  };

  // 删除项目
  const handleDeleteProject = async (projectId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后将无法恢复，确定要删除这个项目吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await api.deleteProject(projectId);
          message.success('项目删除成功');
          await loadProjects();
        } catch (error: any) {
          console.error('删除项目失败:', error);
          message.error(error.response?.data?.message || '删除项目失败');
        }
      }
    });
  };

  // 复制项目
  const handleCopyProject = (project: Project) => {
    setCreateModalOpen(true);
    form.setFieldsValue({
      name: `${project.name} (副本)`,
      description: project.description
    });
  };

  // 编辑项目
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/${projectId}/pages`);
  };

  // 预览项目
  const handlePreviewProject = (projectId: string) => {
    // TODO: 获取项目的第一个页面进行预览
    window.open(`/preview/${projectId}/default`, '_blank');
  };

  // 项目卡片的下拉菜单
  const getProjectMenuItems = (project: Project) => [
    {
      key: 'edit',
      label: '管理页面',
      icon: <EditOutlined />,
      onClick: () => handleEditProject(project.id)
    },
    {
      key: 'preview',
      label: '预览',
      icon: <EyeOutlined />,
      onClick: () => handlePreviewProject(project.id)
    },
    {
      key: 'copy',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => handleCopyProject(project)
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteProject(project.id)
    }
  ];

  // 获取状态显示
  const getStatusDisplay = (status: string) => {
    const statusMap = {
      DRAFT: { text: '草稿', color: '#faad14' },
      PUBLISHED: { text: '已发布', color: '#52c41a' },
      ARCHIVED: { text: '已归档', color: '#d9d9d9' }
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.DRAFT;
    return (
      <Text style={{ color: config.color, fontSize: '12px' }}>
        ● {config.text}
      </Text>
    );
  };

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            项目管理
          </Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
            管理您的所有项目，创建新项目或编辑现有项目
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setCreateModalOpen(true)}
        >
          创建项目
        </Button>
      </div>

      {/* 项目列表 */}
      <Spin spinning={loading}>
        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">还没有项目</Text>
                <br />
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  style={{ marginTop: 16 }}
                  onClick={() => setCreateModalOpen(true)}
                >
                  创建第一个项目
                </Button>
              </div>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            {projects.map((project) => (
              <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
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
                      onClick={() => handleEditProject(project.id)}
                    >
                      <FolderOpenOutlined style={{ fontSize: '32px' }} />
                    </div>
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditProject(project.id)}
                    >
                      管理
                    </Button>,
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />}
                      onClick={() => handlePreviewProject(project.id)}
                    >
                      预览
                    </Button>,
                    <Dropdown
                      menu={{ items: getProjectMenuItems(project) }}
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
                          {project.name}
                        </Text>
                        {getStatusDisplay(project.status)}
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          type="secondary"
                          style={{ margin: '8px 0 12px 0', minHeight: '40px' }}
                        >
                          {project.description || '暂无描述'}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          更新于 {formatTime(project.updatedAt)}
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

      {/* 创建项目模态框 */}
      <Modal
        title="创建新项目"
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
          onFinish={handleCreateProject}
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[
              { required: true, message: '请输入项目名称' },
              { max: 100, message: '项目名称不能超过100个字符' }
            ]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="项目描述"
            rules={[
              { max: 500, message: '项目描述不能超过500个字符' }
            ]}
          >
            <Input.TextArea 
              placeholder="请输入项目描述（可选）" 
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};