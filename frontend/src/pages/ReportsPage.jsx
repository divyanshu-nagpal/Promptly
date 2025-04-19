import React, { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Check,
  Flag,
  Trash2,
  AlertCircle,
  FileText,
  MessageSquare,
  ClipboardList,
  X,
} from "lucide-react";

const ReportsPage = () => {
  const [groupedReports, setGroupedReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [reportStats, setReportStats] = useState({
    totalReports: 0,
    promptReports: 0,
    commentReports: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalTarget, setModalTarget] = useState(null);
  // Initialize all sections as visible by default
  const [animatedSections, setAnimatedSections] = useState({
    "reports-hero": true,
    "reports-content": true,
    "stats-section": true,
    "reports-list": true,
    "no-reports": true,
  });

  useEffect(() => {
    fetchReports();

    // Setup animation observer - but with a fallback for immediate visibility
    setTimeout(() => {
      const sections = document.querySelectorAll(".animate-on-scroll");

      // If IntersectionObserver is available, use it
      if ("IntersectionObserver" in window) {
        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        };

        const observerCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              setAnimatedSections((prev) => ({
                ...prev,
                [entry.target.id]: true,
              }));
            }
          });
        };

        const observer = new IntersectionObserver(
          observerCallback,
          observerOptions
        );

        sections.forEach((section) => {
          if (section.id) {
            observer.observe(section);
          }
        });

        return () => {
          sections.forEach((section) => {
            if (section.id) {
              observer.unobserve(section);
            }
          });
        };
      } else {
        // Fallback for browsers without IntersectionObserver support
        // Make all sections visible immediately
        const allSectionsVisible = {};
        sections.forEach((section) => {
          if (section.id) {
            allSectionsVisible[section.id] = true;
          }
        });
        setAnimatedSections((prev) => ({
          ...prev,
          ...allSectionsVisible,
        }));
      }
    }, 100);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/reports/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const reports = response.data;
      const grouped = {};
      let totalReports = 0;
      let promptReports = 0;
      let commentReports = 0;

      for (const report of reports) {
        const { targetId, targetType } = report;
        totalReports++;

        if (targetType === "prompt") {
          promptReports++;
        } else {
          commentReports++;
        }

        if (!grouped[targetId]) {
          grouped[targetId] = {
            targetType,
            reports: [],
            content: null,
          };

          try {
            const res = await api.get(
              `/api/${
                targetType === "prompt" ? "prompts" : "comments/single"
              }/${targetId}`
            );
            grouped[targetId].content = res.data;
          } catch (error) {
            grouped[targetId].content = { error: "Failed to load content" };
          }
        }

        grouped[targetId].reports.push(report);
      }

      setReportStats({
        totalReports,
        promptReports,
        commentReports,
      });
      setGroupedReports(grouped);
      setError("");
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmationModal = (
    action,
    targetId,
    targetType = null,
    reportId = null
  ) => {
    setModalAction(action);
    setModalTarget({ targetId, targetType, reportId });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setModalTarget(null);
  };

  const handleApprove = async (targetId) => {
    try {
      await api.post(
        "/api/reports/approve",
        { targetId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const reportsToRemove = groupedReports[targetId].reports.length;
      const isPrompt = groupedReports[targetId].targetType === "prompt";

      setReportStats((prev) => ({
        totalReports: prev.totalReports - reportsToRemove,
        promptReports: isPrompt
          ? prev.promptReports - reportsToRemove
          : prev.promptReports,
        commentReports: !isPrompt
          ? prev.commentReports - reportsToRemove
          : prev.commentReports,
      }));

      const updated = { ...groupedReports };
      delete updated[targetId];
      setGroupedReports(updated);
      closeModal();
    } catch (error) {
      console.error("Error approving content:", error);
      setError(`Failed to approve item`);
      closeModal();
    }
  };

  const handleDelete = async (targetId, targetType, _id) => {
    try {
      setDeleteLoading(targetId);
      await api.delete("/api/reports/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { targetId, targetType, _id },
      });

      // Calculate reports to be removed
      const reportsToRemove = groupedReports[targetId].reports.length;
      const isPrompt = groupedReports[targetId].targetType === "prompt";

      // Update global stats
      setReportStats((prev) => ({
        totalReports: prev.totalReports - reportsToRemove,
        promptReports: isPrompt
          ? prev.promptReports - reportsToRemove
          : prev.promptReports,
        commentReports: !isPrompt
          ? prev.commentReports - reportsToRemove
          : prev.commentReports,
      }));

      // Remove the item from the grouped reports
      const updated = { ...groupedReports };
      delete updated[targetId];
      setGroupedReports(updated);
      closeModal();
    } catch (error) {
      console.error("Error deleting content:", error);
      setError(`Failed to delete ${targetType}`);
      closeModal();
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleConfirmAction = () => {
    if (!modalTarget) return;

    if (modalAction === "approve") {
      handleApprove(modalTarget.targetId);
    } else if (modalAction === "delete") {
      handleDelete(
        modalTarget.targetId,
        modalTarget.targetType,
        modalTarget.reportId
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section with animated gradient background */}
      <section
        id="reports-hero"
        className="animate-on-scroll relative pt-24 pb-16 px-4 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
        </div>

        <div
          className={`max-w-5xl mx-auto relative ${
            animatedSections["reports-hero"] ? "animate-fade-in" : ""
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <Flag className="h-3.5 w-3.5 mr-2" />
              <span>Moderation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Content{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Reports
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Review and manage flagged content from users
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section
        id="reports-content"
        className="animate-on-scroll relative px-4 pb-20"
      >
        <div
          className={`max-w-5xl mx-auto relative z-10 ${
            animatedSections["reports-content"] ? "animate-fade-in" : ""
          }`}
        >
          {/* Stats Overview */}
          <div
            id="stats-section"
            className="animate-on-scroll grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {/* Total Reports */}
            <div
              className={`relative group ${
                animatedSections["stats-section"]
                  ? "animate-fade-in-delayed-1"
                  : ""
              }`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-900/30 p-3 rounded-lg">
                    <ClipboardList className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">
                      Total Reports
                    </h3>
                    <p className="text-3xl font-semibold text-white">
                      {reportStats.totalReports}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Reports */}
            <div
              className={`relative group ${
                animatedSections["stats-section"]
                  ? "animate-fade-in-delayed-2"
                  : ""
              }`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-900/30 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">
                      Prompt Reports
                    </h3>
                    <p className="text-3xl font-semibold text-white">
                      {reportStats.promptReports}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Reports */}
            <div
              className={`relative group ${
                animatedSections["stats-section"]
                  ? "animate-fade-in-delayed-3"
                  : ""
              }`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-900/30 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">
                      Comment Reports
                    </h3>
                    <p className="text-3xl font-semibold text-white">
                      {reportStats.commentReports}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-900/30 border border-red-800 p-4 mb-6 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : Object.keys(groupedReports).length > 0 ? (
            <div id="reports-list" className="animate-on-scroll space-y-6">
              {Object.entries(groupedReports).map(
                ([targetId, group], index) => {
                  // Aggregate report reasons
                  const reasonCount = {};
                  group.reports.forEach((report) => {
                    report.reason.forEach((r) => {
                      reasonCount[r] = (reasonCount[r] || 0) + 1;
                    });
                  });

                  return (
                    <div
                      key={targetId}
                      className="relative group opacity-100" // Remove conditional opacity classes
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative bg-gray-900 rounded-xl border border-gray-800 backdrop-blur-sm p-6 transition-all duration-300 hover:transform hover:scale-[1.01]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                          <div className="flex items-center mb-3 md:mb-0">
                            <div className="p-2 rounded-full bg-blue-900/30 mr-3">
                              {group.targetType === "prompt" ? (
                                <FileText className="h-5 w-5 text-blue-400" />
                              ) : (
                                <MessageSquare className="h-5 w-5 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-white">
                                {group.targetType === "prompt"
                                  ? "Prompt"
                                  : "Comment"}
                              </h2>
                            </div>
                          </div>

                          {/* Badge showing number of reports */}
                          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm border border-blue-800/50">
                            <Flag className="h-3.5 w-3.5 mr-2" />
                            <span>
                              {group.reports.reduce(
                                (total, report) =>
                                  total + (report.reason?.length || 0),
                                0
                              )}{" "}
                              Report
                              {group.reports.reduce(
                                (total, report) =>
                                  total + (report.reason?.length || 0),
                                0
                              ) !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* Content Display */}
                        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          {group.content?.error ? (
                            <p className="text-gray-300 italic">
                              {group.content.error}
                            </p>
                          ) : group.targetType === "prompt" ? (
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-sm font-medium text-gray-400">
                                  Title
                                </h3>
                                <p className="text-white">
                                  {group.content.title}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-400">
                                  Input
                                </h3>
                                <p className="text-white">
                                  {group.content.input}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-400">
                                  Output
                                </h3>
                                {group.content.output &&
                                group.content.output.includes(process.env.REACT_APP_OUTPUT_SPLIT) ? (
                                  (() => {
                                    const [textPart, imageUrl] =
                                      group.content.output.split(process.env.REACT_APP_OUTPUT_SPLIT);
                                    return (
                                      <>
                                        <p className="text-white">
                                          {textPart.trim()}
                                        </p>
                                        <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-700">
                                          <img
                                            src={imageUrl.trim()}
                                            alt="Prompt Output"
                                            className="max-w-full h-auto rounded mx-auto"
                                          />
                                        </div>
                                      </>
                                    );
                                  })()
                                ) : (
                                  <p className="text-white whitespace-pre-wrap">
                                    {group.content.output}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="text-sm font-medium text-gray-400">
                                Comment
                              </h3>
                              <p className="text-white">{group.content.text}</p>
                            </div>
                          )}
                        </div>

                        {/* Report Reasons Table */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-300 mb-3">
                            Report Reasons
                          </h3>
                          <div className="overflow-hidden rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead className="bg-gray-800">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                  >
                                    Reason
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                                  >
                                    Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-gray-900 divide-y divide-gray-800">
                                {Object.entries(reasonCount).map(
                                  ([reason, count]) => (
                                    <tr
                                      key={reason}
                                      className="hover:bg-gray-800/50 transition-colors"
                                    >
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                        {reason}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-400 border border-blue-800/50">
                                          {count}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Action Buttons with proper spacing */}
                        <div className="flex justify-end space-x-3">
                          {/* Approve Button */}
                          <button
                            onClick={() =>
                              openConfirmationModal("approve", targetId)
                            }
                            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-105"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() =>
                              openConfirmationModal(
                                "delete",
                                targetId,
                                group.targetType,
                                group.reports[0]._id
                              )
                            }
                            disabled={deleteLoading === targetId}
                            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete{" "}
                            {group.targetType.charAt(0).toUpperCase() +
                              group.targetType.slice(1)}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div id="no-reports" className="animate-on-scroll relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 rounded-xl border border-gray-800 backdrop-blur-sm py-12 px-6 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  All Clear!
                </h3>
                <p className="text-gray-400">
                  No reports found. Everything looks good.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modal-appear">
              <div className="relative">
                {/* Modal header */}
                <div className="px-6 pt-5 pb-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      Confirm{" "}
                      {modalAction === "approve" ? "Approval" : "Deletion"}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-white focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Modal body */}
                <div className="px-6 py-4">
                  <p className="text-gray-300">
                    {modalAction === "approve"
                      ? "Are you sure you want to approve this content and remove all related reports?"
                      : `Are you sure you want to delete this ${modalTarget?.targetType}? This action cannot be undone.`}
                  </p>
                </div>

                {/* Modal footer */}
                <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={deleteLoading === modalTarget?.targetId}
                    className={`px-4 py-2 rounded-md text-white focus:outline-none transition duration-200 ${
                      modalAction === "approve"
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                    }`}
                  >
                    {deleteLoading === modalTarget?.targetId ? (
                      <>
                        <div className="inline-block animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      `Yes, ${modalAction === "approve" ? "Approve" : "Delete"}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animation styles */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delayed-1 {
          animation: fadeIn 0.8s ease-out 0.1s forwards;
        }

        .animate-fade-in-delayed-2 {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
        }

        .animate-fade-in-delayed-3 {
          animation: fadeIn 0.8s ease-out 0.5s forwards;
        }

        .animate-fade-in-delayed-4 {
          animation: fadeIn 0.8s ease-out 0.7s forwards;
        }

        .animate-fade-in-delayed-5 {
          animation: fadeIn 0.8s ease-out 0.9s forwards;
        }

        .animate-modal-appear {
          animation: modalAppear 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalAppear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;
