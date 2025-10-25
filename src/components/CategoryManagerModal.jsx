import { useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  Tag,
  message,
  ColorPicker,
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CategoryManagerModal({
  open,
  onClose,
  categories = [],
  onUpdated,
}) {
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setOpenForm(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      color: category.color,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:3000/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      message.success("Category deleted successfully");
      onUpdated?.();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const url = editingCategory
        ? `http://127.0.0.1:3000/api/categories/${editingCategory.id}`
        : `http://127.0.0.1:3000/api/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save category");

      message.success(
        editingCategory
          ? "Category updated successfully"
          : "Category created successfully"
      );
      setOpenForm(false);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      message.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <strong>{text}</strong>,
      ellipsis: true,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <Tag
          color={color}
          style={{
            border: `1px solid ${color}`,
            background: "#fff",
            color: color,
          }}
        >
          {color}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space wrap>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              loading={loading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Modal utama */}
      <Modal
        open={open}
        title="Manage Categories"
        onCancel={onClose}
        destroyOnClose
        width={window.innerWidth < 600 ? "95%" : 700}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
          >
            Add Category
          </Button>,
        ]}
      >
        <div
          style={{
            overflowX: "auto",
            padding: "16px",
          }}
        >
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            pagination={false}
            size="small"
            style={{ minWidth: 500 }}
          />
        </div>
      </Modal>

      {/* Modal form Add/Edit */}
      <Modal
        open={openForm}
        title={editingCategory ? "Edit Category" : "Add Category"}
        onCancel={() => setOpenForm(false)}
        footer={null}
        destroyOnClose
        width={window.innerWidth < 500 ? "90%" : 400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ color: "#1677ff" }}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g. Work, Personal" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please pick a color" }]}
          >
            <ColorPicker
              showText
              presets={[
                {
                  label: "Preset Colors",
                  colors: [
                    "#1677ff",
                    "#52c41a",
                    "#f5222d",
                    "#faad14",
                    "#13c2c2",
                    "#722ed1",
                    "#eb2f96",
                  ],
                },
              ]}
              onChange={(color) =>
                form.setFieldValue("color", color.toHexString())
              }
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
