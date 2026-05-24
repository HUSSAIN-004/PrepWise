import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function Admin() {
  const { token } = useAuth();
  const [contentForm, setContentForm] = useState({
    category: "Data Structures",
    correctOption: 0,
    difficulty: "Easy",
    explanation: "",
    options: ["", "", "", ""],
    prompt: "",
  });
  const [dashboard, setDashboard] = useState({
    metrics: {},
    recentContent: [],
    recentUsers: [],
  });
  const [editingContentId, setEditingContentId] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("loading");
  const [submitStatus, setSubmitStatus] = useState("");

  const authHeaders = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const loadOverview = async () => {
    try {
      setStatus("loading");
      const res = await api.get("/api/admin/overview", authHeaders);
      setDashboard(res.data);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (token) {
      loadOverview();
    }
  }, [token, authHeaders]);

  const filteredUsers = dashboard.recentUsers.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase())
  );

  const submitContent = async () => {
    try {
      setSubmitStatus("saving");
      if (editingContentId) {
        await api.put(`/api/admin/content/${editingContentId}`, contentForm, authHeaders);
      } else {
        await api.post("/api/admin/content", contentForm, authHeaders);
      }
      setContentForm((current) => ({ ...current, explanation: "", options: ["", "", "", ""], prompt: "" }));
      setEditingContentId(null);
      await loadOverview();
      setSubmitStatus("saved");
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const editContent = (item) => {
    setEditingContentId(item._id);
    setContentForm({
      category: item.category,
      correctOption: item.correctOption || 0,
      difficulty: item.difficulty,
      explanation: item.explanation || "",
      options: item.options?.length ? [...item.options, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
      prompt: item.prompt,
    });
    setSubmitStatus("");
  };

  const deleteContent = async (id) => {
    try {
      await api.delete(`/api/admin/content/${id}`, authHeaders);
      await loadOverview();
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const cancelEdit = () => {
    setEditingContentId(null);
    setContentForm({
      category: "Data Structures",
      correctOption: 0,
      difficulty: "Easy",
      explanation: "",
      options: ["", "", "", ""],
      prompt: "",
    });
    setSubmitStatus("");
  };

  const exportReport = () => {
    const generatedAt = new Date();
    const workbook = XLSX.utils.book_new();
    const summaryRows = [
      ["PrepWise AI Admin Report"],
      ["Generated At", generatedAt.toLocaleString()],
      [],
      ["Metric", "Value"],
      ["Total Users", dashboard.metrics?.totalUsers || 0],
      ["Active Tests", dashboard.metrics?.activeTests || 0],
      ["Resume Analyses", dashboard.metrics?.resumeAnalyses || 0],
      ["DSA Users", dashboard.metrics?.dsaUsers || 0],
      ["Injected Content Items", dashboard.metrics?.contentCount || 0],
    ];
    const usersRows = dashboard.recentUsers.map((user) => ({
      "Joined Date": new Date(user.createdAt).toLocaleDateString(),
      Email: user.email,
      Name: user.name,
      Role: user.role,
    }));
    const contentRows = dashboard.recentContent.map((item) => ({
      Category: item.category,
      "Created At": new Date(item.createdAt).toLocaleDateString(),
      Difficulty: item.difficulty,
      Prompt: item.prompt,
      "Submitted By": item.user?.name || item.user?.email || "Admin",
    }));
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    const usersSheet = XLSX.utils.json_to_sheet(usersRows.length ? usersRows : [{ Name: "No recent users" }]);
    const contentSheet = XLSX.utils.json_to_sheet(contentRows.length ? contentRows : [{ Prompt: "No injected content yet" }]);

    summarySheet["!cols"] = [{ wch: 28 }, { wch: 24 }];
    usersSheet["!cols"] = [{ wch: 18 }, { wch: 34 }, { wch: 24 }, { wch: 14 }];
    contentSheet["!cols"] = [{ wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 60 }, { wch: 24 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Overview");
    XLSX.utils.book_append_sheet(workbook, usersSheet, "Recent Users");
    XLSX.utils.book_append_sheet(workbook, contentSheet, "Injected Content");
    XLSX.writeFile(workbook, `prepwise-admin-report-${generatedAt.toISOString().slice(0, 10)}.xlsx`);
  };

  const metrics = dashboard.metrics || {};
  const isAptitudeContent = contentForm.category === "Quantitative Aptitude";

  return (
    <div className="min-h-screen bg-background text-on-background">
      <AppSidebar />

      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto bg-background relative">
        <div className="pt-md px-margin-mobile md:px-margin-desktop pb-xl max-w-7xl mx-auto space-y-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-sm mb-lg">
            <div>
              <h2 className="text-headline-lg font-headline-lg md:text-display-lg md:font-display-lg text-on-surface mb-xs">Platform Overview</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Real-time metrics and administration controls.</p>
            </div>
            <button className="bg-surface-container-high border border-outline-variant/50 text-on-surface px-md py-xs rounded text-label-md font-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-xs" onClick={exportReport} type="button">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
          </div>

          {status === "error" && (
            <div className="rounded-lg border border-error/30 bg-error-container/20 p-sm text-body-sm text-error">
              Admin data could not be loaded.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
            {[
              { icon: "group", label: "Total Users", value: metrics.totalUsers || 0 },
              { icon: "sync", label: "Active Tests", value: metrics.activeTests || 0 },
              { icon: "description", label: "Resume Analyses", value: metrics.resumeAnalyses || 0 },
              { icon: "inventory_2", label: "Content Items", value: metrics.contentCount || 0 },
            ].map((metric) => (
              <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-md flex flex-col justify-between h-32 relative overflow-hidden group" key={metric.label}>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant mb-xs">{metric.label}</p>
                  <h3 className="text-headline-lg font-headline-lg text-on-surface">{status === "loading" ? "--" : metric.value}</h3>
                </div>
                <div className="flex items-center gap-xs text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">{metric.icon}</span>
                  <span className="text-label-sm font-label-sm">Database connected</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
            <div className="lg:col-span-2 bg-[#0B0B0B] border border-[#262626] rounded-xl overflow-hidden flex flex-col">
              <div className="p-md border-b border-outline-variant/20 flex flex-col md:flex-row gap-sm justify-between md:items-center">
                <h3 className="text-headline-md font-headline-md text-on-surface">Recent Signups</h3>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input className="bg-surface-container text-body-sm font-body-sm text-on-surface border border-outline-variant/30 rounded pl-xl pr-md py-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all w-full md:w-64 placeholder:text-on-surface-variant/50" onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." type="text" value={query} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                      <th className="px-md py-sm font-medium">User</th>
                      <th className="px-md py-sm font-medium">Role</th>
                      <th className="px-md py-sm font-medium text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-body-sm font-body-sm">
                    {filteredUsers.map((user) => (
                      <tr className="hover:bg-surface-container/30 transition-colors" key={user._id}>
                        <td className="px-md py-sm">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-label-md">{user.name?.slice(0, 2).toUpperCase()}</div>
                            <div>
                              <div className="font-medium text-on-surface">{user.name}</div>
                              <div className="text-on-surface-variant text-[12px]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-md py-sm">
                          <span className={user.role === "admin" ? "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary" : "inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-tertiary/10 text-tertiary"}>{user.role}</span>
                        </td>
                        <td className="px-md py-sm text-right text-on-surface-variant">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-md flex flex-col h-full">
              <div className="mb-md">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>
                  Inject Content
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Store admin-created practice content in MongoDB.</p>
              </div>
              <div className="flex-1 flex flex-col gap-sm">
                <div className="space-y-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">Category</label>
                  <select className="w-full bg-surface-container text-body-sm font-body-sm text-on-surface border border-outline-variant/30 rounded p-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" onChange={(event) => setContentForm((current) => ({ ...current, category: event.target.value }))} value={contentForm.category}>
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>System Design</option>
                    <option>Quantitative Aptitude</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">Difficulty Level</label>
                  <div className="flex gap-xs">
                    {["Easy", "Medium", "Hard"].map((difficulty) => (
                      <button className={contentForm.difficulty === difficulty ? "flex-1 py-xs border rounded text-label-sm font-label-sm bg-tertiary/10 text-tertiary border-tertiary transition-all" : "flex-1 py-xs border border-outline-variant/30 rounded text-label-sm font-label-sm text-on-surface-variant transition-all"} key={difficulty} onClick={() => setContentForm((current) => ({ ...current, difficulty }))} type="button">
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-xs flex-1">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">Question Prompt</label>
                  <textarea className="w-full h-24 bg-surface-container text-body-sm font-body-sm text-on-surface border border-outline-variant/30 rounded p-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none" onChange={(event) => setContentForm((current) => ({ ...current, prompt: event.target.value }))} placeholder="Enter problem statement..." value={contentForm.prompt} />
                </div>
                {isAptitudeContent && (
                  <div className="space-y-xs">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">Answer Options</label>
                    <div className="grid grid-cols-1 gap-xs">
                      {contentForm.options.map((option, index) => (
                        <div className="flex gap-xs" key={index}>
                          <button className={contentForm.correctOption === index ? "w-9 rounded bg-tertiary/10 text-tertiary border border-tertiary text-label-sm" : "w-9 rounded bg-surface-container border border-outline-variant/30 text-label-sm text-on-surface-variant"} onClick={() => setContentForm((current) => ({ ...current, correctOption: index }))} type="button">
                            {String.fromCharCode(65 + index)}
                          </button>
                          <input className="flex-1 bg-surface-container text-body-sm font-body-sm text-on-surface border border-outline-variant/30 rounded p-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" onChange={(event) => {
                            const nextOptions = [...contentForm.options];
                            nextOptions[index] = event.target.value;
                            setContentForm((current) => ({ ...current, options: nextOptions }));
                          }} placeholder={`Option ${String.fromCharCode(65 + index)}`} type="text" value={option} />
                        </div>
                      ))}
                    </div>
                    <input className="w-full bg-surface-container text-body-sm font-body-sm text-on-surface border border-outline-variant/30 rounded p-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all" onChange={(event) => setContentForm((current) => ({ ...current, explanation: event.target.value }))} placeholder="Explanation shown after submission" type="text" value={contentForm.explanation} />
                  </div>
                )}
                <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded hover:bg-primary-container transition-colors mt-sm flex items-center justify-center gap-xs disabled:opacity-50" disabled={!contentForm.prompt.trim() || submitStatus === "saving" || (isAptitudeContent && contentForm.options.some((option) => !option.trim()))} onClick={submitContent} type="button">
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  {submitStatus === "saving" ? "Saving..." : editingContentId ? "Update Content" : "Commit to Database"}
                </button>
                {editingContentId && (
                  <button className="w-full border border-outline-variant/30 text-on-surface font-label-md text-label-md py-xs rounded hover:border-primary hover:text-primary transition-colors" onClick={cancelEdit} type="button">
                    Cancel Edit
                  </button>
                )}
                {submitStatus === "saved" && <p className="text-label-sm text-tertiary">Content saved.</p>}
                {submitStatus === "error" && <p className="text-label-sm text-error">Could not save content.</p>}
              </div>
            </div>
          </div>

          <div className="bg-[#0B0B0B] border border-[#262626] rounded-xl p-md">
            <h3 className="text-headline-md font-headline-md text-on-surface mb-sm">Recent Injected Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
              {dashboard.recentContent.length > 0 ? dashboard.recentContent.map((item) => (
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-sm" key={item._id}>
                  <div className="flex justify-between gap-sm mb-xs">
                    <span className="text-label-sm text-primary">{item.category}</span>
                    <span className="text-label-sm text-on-surface-variant">{item.difficulty}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{item.prompt}</p>
                  {item.options?.length > 0 && (
                    <p className="text-label-sm text-on-surface-variant mt-xs">Options: {item.options.join(" | ")}</p>
                  )}
                  <div className="flex gap-xs mt-sm">
                    <button className="text-label-sm text-primary hover:underline" onClick={() => editContent(item)} type="button">Edit</button>
                    <button className="text-label-sm text-error hover:underline" onClick={() => deleteContent(item._id)} type="button">Delete</button>
                  </div>
                </div>
              )) : (
                <p className="text-body-sm text-on-surface-variant">No admin content added yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
