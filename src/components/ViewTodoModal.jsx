import { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  Spin,
  Typography,
  Button,
  Popconfirm,
  message,
  Tag,
} from "antd";

import EditTodoModal from "./EditTodoModal";

const { Title, Text } = Typography;

export default function ViewTodoModal({
  open,
  onCancel,
  todoId,
  onUpdated,
  categories = [],
}) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // get detail todo
  useEffect(() => {
    if (!todoId || !open) return;

    const fetchTodoDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/todos/${todoId}`);
        if (!res.ok) throw new Error("Failed to fetch todo detail");
        const data = await res.json();
        setTodo(data.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load todo detail");
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetail();
  }, [todoId, open]);

  // toggle status
  const handleToggleComplete = async () => {
    if (!todoId) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/todos/${todoId}/complete`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Failed to toggle completion");

      setTodo((prev) => ({
        ...prev,
        is_completed: !prev.is_completed,
        updated_at: new Date().toISOString(),
      }));

      onUpdated?.();

      message.success("Todo status updated successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to update todo status");
    } finally {
      setActionLoading(false);
    }
  };

  // delet todo
  const handleDelete = async () => {
    if (!todoId) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/todos/${todoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete todo");
      message.success("Todo deleted successfully");
      onCancel();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete todo");
    } finally {
      setActionLoading(false);
    }
  };

  const currentCategory = categories.find(
    (cat) => cat.id === todo?.category_id
  );

  return (
    <>
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
          <>
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
              <Descriptions.Item label="Category">
                {currentCategory ? (
                  <Tag
                    color={currentCategory.color}
                    style={{
                      border: `1px solid ${currentCategory.color}`,
                      background: "#fff",
                      color: currentCategory.color,
                      fontWeight: 500,
                    }}
                  >
                    {currentCategory.name}
                  </Tag>
                ) : (
                  "-"
                )}
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

            {/* action Buttons */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <Button onClick={() => setOpenEdit(true)}>Edit</Button>
              <Button
                type={todo.is_completed ? "default" : "primary"}
                loading={actionLoading}
                onClick={handleToggleComplete}
              >
                {todo.is_completed ? "Mark as Incomplete" : "Mark as Completed"}
              </Button>

              <Popconfirm
                title="Are you sure you want to delete this todo?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleDelete}
              >
                <Button danger loading={actionLoading}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </>
        ) : (
          <Text type="secondary">No data available.</Text>
        )}
      </Modal>
      {/* 🔹 Modal Edit */}
      <EditTodoModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        todo={todo}
        onUpdated={() => {
          onUpdated?.();
          setOpenEdit(false);
        }}
        categories={categories || []}
      />
    </>
  );
}
