# Lets to do Frontend

![badge react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![badge javascsipt](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

A simple responsive React web application built as part of the Industrix Full Stack Engineer Intern Coding Challenge. This frontend connects to a RESTful API [backend](https://github.com/M16Yusuf/lets-to-do-backend) (built in Go with GORM) and provides full CRUD functionality for Todos and Categories, with clean UI and responsive design using Ant Design.

## 🚀 Features Implemented

✅ Core Features

- Todo Management

- Create, edit, delete todos

- Toggle completion status

- View todo detail in a modal

- Category Management

- Create, update, delete categories

- Assign category to todo

- Manage category color via color picker

- Todo List Management

- Search todos by title

- Pagination with 10 items per page

- Sort ascending/descending

- Clean responsive list view

💡 Extra Features

- React Context API for state management (useTodos, useCategories)

- Responsive Layout (desktop, tablet, mobile)

- Modular Code Structure — clean separation by context and components

## Code struckture

```
frontend/
├── src/
│   ├── contexts/
│   │   ├── todo/
│   │   └── category/
│   ├── components/
│   │   ├── TodoListMockup.jsx
│   │   ├── AddTodoModal.jsx
│   │   ├── ViewTodoModal.jsx
│   │   ├── EditTodoModal.jsx
│   │   └── CategoryManagerModal.jsx
│   ├── utils/
│   │   └── timestampToDate.js
│   ├── App.jsx
│   └── main.jsx
└── package.json

```

### 💬 Technical Questions & Answers

How did you handle pagination and filtering?

- Pagination handled via backend query params: ?page, ?limit, and ?query (for search).

- Sorting via ?sort=asc|desc.

- Frontend syncs with URL using useSearchParams for navigation consistency.

How did you implement responsive design?

- Used Ant Design grid system and component flexibility.

- Modal widths adjust based on window.innerWidth.

- Key breakpoints:

  - ≤ 600px → full width modal

  - ≤ 768px → stacked layout

  - 768px → side-by-side elements.

How did you structure your React components?

- Separated by domain:

  - contexts/ → global state (Todos, Categories)

  - components/ → modular UI units (Add/Edit/View modals, manager)

- Used useReducer + Context for predictable async state (loading, error, data).

- Pagination/search state managed via useSearchParams for URL persistence.

If you had more time, what would you improve?

- Add filtering by priority and completion status.

- Use Ant Design Table with advanced column filters.

- Integrate Docker Compose for full stack setup.

- Add backend unit tests for repository and handler layers.

## 📧 Contact Info

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/m16yusuf/)

## 🎯 Related Project

[https://github.com/M16Yusuf/lets-to-do-backend](https://github.com/M16Yusuf/lets-to-do-backend)
