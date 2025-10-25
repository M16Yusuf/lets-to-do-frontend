import { Modal, Form, Input, Select, DatePicker, Button, Space } from "antd";
const { Option } = Select;

export default function AddTodoModal({
  open,
  onCancel,
  onSubmit,
  categories = [],
  loading = false,
}) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      due_date: values.due_date?.toISOString(),
    });
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Todo"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input title!" }]}
        >
          <Input placeholder="Todo title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Todo description" rows={3} />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Select priority" }]}
        >
          <Select placeholder="Select priority">
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Select category" }]}
        >
          <Select placeholder="Select category">
            {categories.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: "Select due date" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
