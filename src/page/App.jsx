import { useEffect, useState } from "react";
import { Input, Button, Card, List, Pagination, Select, Space } from "antd";
import { useSearchParams } from "react-router";

// context
import { useTodos } from "./../contexts/todo/useTodo";
import { useCategories } from "./../contexts/category/useCategory";

// utils
import formatDateAndCheckPast from "./../utils/timestampToData";

// component
import AddTodoModal from "./../components/AddTodoModal";
import ViewTodoModal from "./../components/ViewTodoModal";

const { Option } = Select;

export default function App() {
  const { todos, loading, fetchTodos } = useTodos();
  const { categories, fetchCategories } = useCategories();

  // state modal controller
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  // searchparam
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "desc";
  const query = searchParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!params.get("page")) {
      params.set("page", "1");
      changed = true;
    }

    if (!params.get("sort")) {
      params.set("sort", "desc");
      changed = true;
    }

    if (changed) setSearchParams(params);
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (searchValue) {
          params.set("query", searchValue);
          params.set("page", "1"); // reset ke halaman 1 ketika search berubah
        } else {
          params.delete("query");
        }
        return params;
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, setSearchParams]);

  const handleSortToggle = () => {
    setSearchParams({
      page,
      sort: sort === "asc" ? "desc" : "asc",
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage);
      return params;
    });
  };

  useEffect(() => {
    fetchTodos(searchParams.toString());
    fetchCategories();
  }, [searchParams]);

  const handleAddTodo = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("http://127.0.0.1:3000/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create todo");
      setIsModalOpen(false);
      fetchTodos(searchParams.toString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = (id) => {
    setSelectedTodoId(id);
    setViewModalOpen(true);
  };

  const handleRefreshTodos = () => {
    fetchTodos(searchParams.toString());
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "20px",
        background: "#fff",
        minHeight: "90vh",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 8,
      }}
    >
      {/* Search bar + Add button */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        {/* Search Input */}
        <Input
          placeholder="Search by title ..."
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            flex: "1 1 250px",
            minWidth: "200px",
          }}
        />

        {/* Sort Button */}
        <Button
          type="default"
          onClick={handleSortToggle}
          style={{
            flex: "0 0 auto",
            minWidth: "120px",
            alignSelf: "center",
          }}
        >
          Sort: {searchParams.get("sort")}
        </Button>

        {/* Category Select */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "150px",
            flex: "0 0 auto",
          }}
        >
          <label style={{ fontSize: "8px", fontFamily: "sans-serif" }}>
            not implemented yet
          </label>
          <Select placeholder="Category" style={{ width: "100%" }}>
            {categories?.data &&
              categories.data.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </div>

        {/* Add Button */}
        <Button
          type="primary"
          style={{
            flex: "0 0 100%", // otomatis ke bawah di layar kecil
            minWidth: "120px",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Add Todo
        </Button>
      </div>

      {/* Todo List */}
      <Card
        style={{
          minHeight: 400,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {!loading && todos?.data && (
          <List
            dataSource={todos.data}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => handleViewDetail(item.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                }}
              >
                <span>{item.title}</span>
                {item.category_id &&
                  (() => {
                    const category = categories?.data?.find(
                      (cat) => cat.id === item.category_id
                    );

                    return (
                      category && (
                        <span
                          style={{
                            padding: "4px",
                            color: category.color,
                            border: `1px solid ${category.color}`,
                            borderRadius: "5px",
                          }}
                        >
                          {category.name}
                        </span>
                      )
                    );
                  })()}
                <span style={{ color: "#999" }}>
                  Deadline :
                  {item.due_date &&
                    formatDateAndCheckPast(item.due_date).dateOnly}
                </span>
                <span style={{ color: "#999" }}>
                  {item.is_completed ? "completed ✅" : "not complete ✖️"}
                </span>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        {!loading && todos?.pagenation?.total && (
          <Pagination
            defaultCurrent={1}
            total={todos.pagenation.total}
            onChange={handlePageChange}
          />
        )}
      </div>

      {/* form modal */}
      <AddTodoModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddTodo}
        categories={categories?.data || []}
        loading={isSubmitting}
      />

      {/* detail todo */}
      <ViewTodoModal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        todoId={selectedTodoId}
        onUpdated={handleRefreshTodos}
        categories={categories.data}
      />
    </div>
  );
}
