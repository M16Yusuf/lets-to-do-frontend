import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function EditTodoModal({
  open,
  onCancel,
  todo,
  onUpdated,
  categories = [],
}) {
  const [form] = Form.useForm();

  console.log(categories);

  useEffect(() => {
    if (todo && open) {
      form.setFieldsValue({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        due_date: todo.due_date ? dayjs(todo.due_date) : null,
        category_id: todo.category_id,
      });
    }
  }, [todo, open]);

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          due_date: values.due_date ? values.due_date.toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      message.success("Todo updated successfully");
      onUpdated?.(); // 🔁 Refresh list di parent
      onCancel(); // Tutup modal
    } catch (err) {
      console.error(err);
      message.error("Failed to update todo");
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Todo"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Priority" name="priority">
          <Select>
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Due Date" name="due_date">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Category" name="category_id">
          <Select placeholder="Select category">
            {categories.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
