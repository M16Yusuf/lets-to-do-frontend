import { useEffect, useState } from "react";
import { Input, Button, Card, List, Pagination, Select, Space } from "antd";
import { useSearchParams } from "react-router";

import { useTodos } from "./../contexts/todo/useTodo";

const { Search } = Input;
const { Option } = Select;

export default function TodoListMockup() {
  const { todos, loading, fetchTodos } = useTodos();

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
  }, [searchParams]);

  useEffect(() => {
    console.log(todos);
  }, [todos, fetchTodos]);

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
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search by title ..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type="default" onClick={handleSortToggle}>
          Short : {searchParams.get("sort")}
        </Button>
        <Button type="primary">Add Todo</Button>
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
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                }}
              >
                <span>{item.title}</span>
                <span style={{ color: "#999" }}>{item.category}</span>
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
    </div>
  );
}
