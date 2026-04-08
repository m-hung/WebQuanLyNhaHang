import React from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Tables from "./pages/Tables";

export default function App() {
  const [page, setPage] = React.useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "categories":
        return <Categories />;
      case "tables":
        return <Tables />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar setPage={setPage} />
      {/* flex-1 giúp nội dung chính chiếm hết phần còn lại */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}