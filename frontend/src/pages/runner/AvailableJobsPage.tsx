import React, { useState, useEffect } from "react";
import { runnerService, type RunnerJob, type RunnerStats } from "../../services/runnerService";

const AvailableJobsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jobs, setJobs] = useState<RunnerJob[]>([]);
  const [stats, setStats] = useState<RunnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [page, selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const result = await runnerService.getAvailableJobs({
        page,
        limit: 10,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
      console.log('result', result);
      setJobs(result || []);
      setTotalPages(result.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await runnerService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "from-red-50 to-white",
          border: "border-red-200",
          badge: "bg-red-100 text-red-800",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "high":
        return {
          bg: "from-blue-50 to-white",
          border: "border-blue-200",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      case "normal":
        return {
          bg: "from-green-50 to-white",
          border: "border-green-200",
          badge: "bg-green-100 text-green-800",
          button: "bg-green-600 hover:bg-green-700",
        };
      case "low":
        return {
          bg: "from-orange-50 to-white",
          border: "border-orange-200",
          badge: "bg-orange-100 text-orange-800",
          button: "bg-orange-600 hover:bg-orange-700",
        };
      default:
        return {
          bg: "from-gray-50 to-white",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-800",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const handleAcceptJob = async (orderId: number, jobTitle: string) => {
    if (confirm(`Accept "${jobTitle}"?`)) {
      try {
        await runnerService.acceptJob(orderId);
        alert("Job accepted successfully!");
        fetchJobs(); 
        fetchStats();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to accept job");
      }
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-gray-600">Loading jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div className="h-96 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-500 border-2 border-gray-300">
          <div className="text-center">
            <span className="material-icons text-6xl mb-2">map</span>
            <div className="text-xl font-medium">Interactive Job Map</div>
            <div className="text-sm">
              Nearby jobs and your location will appear here
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Job Queue ({jobs.length})</h3>
            <div className="flex items-center space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="Property & Real Estate">
                  Property & Real Estate
                </option>
                <option value="Moving Assistance">Moving Assistance</option>
                <option value="Groceries & Essentials">
                  Groceries & Essentials
                </option>
                <option value="Professional Logistics">
                  Professional Logistics
                </option>
              </select>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="material-icons text-6xl mb-4">work_off</span>
              <p className="text-lg">No available jobs at the moment</p>
              <p className="text-sm">Check back soon for new opportunities</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map((job) => {
                  const colors = getPriorityColor(job.priority);
                  return (
                    <div
                      key={job.id}
                      className={`relative bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-lg p-5 hover:shadow-lg transition-all`}
                    >
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {job.service.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {job.delivery_address.split(",")[0]}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Order #{job.order_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${parseFloat(job.runner_earnings).toFixed(2) || "0.00"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: ${parseFloat(job.total_amount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-4">
                        {job.special_instructions || job.service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="material-icons text-sm mr-1">
                            schedule
                          </span>
                          <span>
                            {new Date(job.scheduled_date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`${colors.badge} px-2 py-1 rounded-full text-xs font-medium`}
                          >
                            {job.priority.charAt(0).toUpperCase() +
                              job.priority.slice(1)}
                          </span>
                          <button
                            onClick={() =>
                              handleAcceptJob(job.id, job.service.name)
                            }
                            className={`${colors.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                          >
                            Accept Job
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 p-6 border-l border-gray-200 bg-gray-50">
        <div className="space-y-6">
          {stats && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3">Today's Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Jobs Completed
                    </span>
                    <span className="font-medium">
                      {stats.today.jobsCompleted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours Worked</span>
                    <span className="font-medium">
                      {stats.today.hoursWorked}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Average Rating
                    </span>
                    <span className="font-medium">
                      {stats.today.averageRating} ★
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Distance
                    </span>
                    <span className="font-medium">
                      {stats.today.totalDistance} miles
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold">
                      Today's Earnings
                    </span>
                    <span className="font-bold text-green-600">
                      ${stats.today.earnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3">Active Jobs</h4>
                {stats.activeJobs > 0 ? (
                  <p className="text-sm text-gray-600">
                    You have {stats.activeJobs} active job
                    {stats.activeJobs > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No active jobs</p>
                )}
              </div>
            </>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold mb-3">Quick Tips</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="material-icons text-sm mr-2 text-blue-500">
                  lightbulb
                </span>
                <span>Peak hours: 11 AM - 2 PM, 5 PM - 8 PM</span>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-sm mr-2 text-green-500">
                  star
                </span>
                <span>Maintain 4.8+ rating for priority job access</span>
              </div>
              <div className="flex items-start">
                <span className="material-icons text-sm mr-2 text-orange-500">
                  speed
                </span>
                <span>
                  Complete jobs 10% faster than estimated for bonuses
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableJobsPage;
