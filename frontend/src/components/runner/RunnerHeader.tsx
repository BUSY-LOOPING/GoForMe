import React from "react";

interface RunnerHeaderProps {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
  title?: string;
  subtitle?: string;
}

const RunnerHeader: React.FC<RunnerHeaderProps> = ({
  isOnline,
  setIsOnline,
  title = "Available Jobs",
  subtitle = "Jobs in your area waiting to be completed",
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg">
              <span className="material-icons">notifications</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RunnerHeader;
