// import { Button, Radio } from "antd";
// import Search from "antd/es/input/Search";
// import { useState } from "react";

// function App() {
//   const [isloading, setIsLoading] = useState(true);
//   const [color, setColor] = useState("white");
//   return (
//     <div style={{ backgroundColor: `${color}` }}>
//       <Search
//         placeholder="Search by title ..."
//         enterButton="Search"
//         loading={isloading}
//         onSearch={(e) => {
//           setColor(e);
//           console.log(color);
//         }}
//         allowClear
//       ></Search>

//       <Radio.Group
//         className="text-w"
//         options={[
//           { value: 1, label: "test 1" },
//           { value: 2, label: "test 2" },
//           { value: 3, label: "test 3" },
//         ]}
//         onChange={(e) => {
//           console.log(e.target.value);
//         }}
//       ></Radio.Group>

//       <Button
//         color="red"
//         variant="solid"
//         onClick={() => {
//           setIsLoading(!isloading);
//         }}
//       >
//         toggle loading
//       </Button>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import { Input, Button, Card, List, Pagination, Select, Space } from "antd";

const { Search } = Input;
const { Option } = Select;

export default function TodoListMockup() {
  const [isLoading, setIsLoading] = useState(false);
  const [todos] = useState([
    { id: 1, title: "Learn React", category: "Work" },
    { id: 2, title: "Read a book", category: "Personal" },
    { id: 3, title: "Buy groceries", category: "Home" },
  ]);

  const handleSearch = (value) => {
    console.log("Search:", value);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
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
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <Search
          placeholder="Search by title ..."
          enterButton="Search"
          loading={isLoading}
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        <Button type="primary" size="large">
          Add Todo
        </Button>
      </div>

      {/* Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Select
          placeholder="Filter by category"
          style={{ width: 220 }}
          allowClear
        >
          <Option value="Work">Work</Option>
          <Option value="Personal">Personal</Option>
          <Option value="Home">Home</Option>
        </Select>
      </div>

      {/* Todo List */}
      <Card
        style={{
          minHeight: 400,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <List
          dataSource={todos}
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
      </Card>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <Pagination defaultCurrent={1} total={20} />
      </div>
    </div>
  );
}
