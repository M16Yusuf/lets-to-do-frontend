import { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, Typography } from "antd";

const { Title, Text } = Typography;

export default function ViewTodoModal({ open, onCancel, todoId }) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!todoId || !open) return;

    const fetchTodoDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/todos/${todoId}`);
        if (!res.ok) throw new Error("Failed to fetch todo detail");
        const data = await res.json();
        console.log(data);
        setTodo(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetail();
  }, [todoId, open]);

  return (
    <Modal
      title="Todo Detail"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <Spin size="large" />
        </div>
      ) : todo ? (
        <div>
          <Title level={4} style={{ marginBottom: "16px" }}>
            {todo.title}
          </Title>

          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Description">
              {todo.description || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Text strong>{todo.priority?.toUpperCase() || "N/A"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Category ID">
              {todo.category_id ?? "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {todo.due_date ? new Date(todo.due_date).toLocaleString() : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {todo.is_completed ? "✅ Completed" : "❌ Not Completed"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {todo.created_at
                ? new Date(todo.created_at).toLocaleString()
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {todo.updated_at
                ? new Date(todo.updated_at).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Text type="secondary">No data available.</Text>
      )}
    </Modal>
  );
}
