import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import RunnerSidebar from "./RunnerSidebar";
import RunnerHeader from "./RunnerHeader";

const RunnerLayout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RunnerSidebar isOnline={isOnline} setIsOnline={setIsOnline} />
      <div className="flex-1 flex flex-col">
        <RunnerHeader isOnline={isOnline} setIsOnline={setIsOnline} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RunnerLayout;
