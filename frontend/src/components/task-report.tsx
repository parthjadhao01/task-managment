"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Task {
  _id: string;
  name: string;
  workspaceId: string;
  projectId: {
    _id: string;
    workspaceId: string;
    name: string;
  };
  dueDate: Date;
  description: string;
  status: "Backlog" | "Todo" | "Doing" | "Done";
  createdAt?: string;
  updatedAt?: string;
  priority?: "Low" | "Medium" | "High";
  progress?: number;
}

interface TaskReportProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskReport({ task, isOpen, onClose }: TaskReportProps) {
  const handleDownloadPDF = async () => {
    const report = document.getElementById("report-content");
    if (!report) return;

    const canvas = await html2canvas(report, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${task.name}_report.pdf`);
  };

  const handlePrint = () => {
    const element = document.getElementById("report-content");
    if (!element) return;
    const printWindow = window.open("", "", "width=1000,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Task Report - ${task.name}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 50px; background: #f9fafb; }
            .report-container { background: white; border-radius: 12px; padding: 40px; }
            @media print { body { background: white; } .report-container { box-shadow: none; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="report-container">
            ${element.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Completion Report</DialogTitle>
        </DialogHeader>

        <div id="report-content" className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
          {/* ===== HEADER SECTION ===== */}
          <div className="flex items-center justify-between border-b-2 border-blue-600 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-400 to-blue-700 text-white font-bold text-lg rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                TM
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Task Completion Report</h1>
                <p className="text-sm text-gray-500">Generated on {format(new Date(), "PPP")}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              Report ID: #{task._id.slice(-6).toUpperCase()}
            </div>
          </div>

          {/* ===== DETAILS GRID ===== */}
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Task Name" value={task.name} />
            <InfoCard label="Status" value={task.status} color={statusColor(task.status)} />
            <InfoCard label="Project" value={task.projectId?.name} />
            <InfoCard label="Assigned To" value="Parth Jadhao (Software Engineer)" />
            <InfoCard label="Priority" value={task.priority || "High"} />
            <InfoCard label="Progress" value={`${task.progress || 85}%`} />
          </div>

          {/* ===== EXTRA INFO ===== */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <InfoCard label="Due Date" value={format(new Date(task.dueDate), "PPP")} />
            <InfoCard
              label="Completed Date"
              value={task.updatedAt ? format(new Date(task.updatedAt), "PPP") : "Pending"}
            />
          </div>

          {/* ===== DESCRIPTION ===== */}
          {task.description && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <div className="text-sm font-semibold text-gray-500 uppercase mb-1">Description</div>
              <div className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </div>
            </div>
          )}

          {/* ===== REVIEW SECTION ===== */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <InfoCard label="Created By" value="Parth Jadhao (Manager)" />
            <InfoCard label="Reviewed By" value="Anita Sharma (Lead QA)" />
          </div>

          {/* ===== SIGNATURE SECTION ===== */}
          <div className="signature-section mt-10 flex justify-between">
            <Signature label="Prepared By" />
            <Signature label="Approved By" />
          </div>

          {/* ===== FOOTER ===== */}
          <div className="footer mt-8 text-center text-sm text-gray-500 border-t pt-4">
            <p>This report was automatically generated by <b>TaskManager AI System</b></p>
            <p>© {new Date().getFullYear()} TaskManager Inc. All rights reserved.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="size-4 mr-2" /> Print
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="size-4 mr-2" /> Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------ Helper Components ------------------ */
function InfoCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className={`p-4 rounded-lg ${color || "bg-gray-50"}`}>
      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</div>
      <div className="text-base text-gray-800 font-medium">{value}</div>
    </div>
  );
}

function Signature({ label }: { label: string }) {
  return (
    <div className="signature text-center w-1/2 px-4">
      <div className="mt-12 border-t border-gray-400"></div>
      <div className="text-sm text-gray-500 mt-2">{label}</div>
    </div>
  );
}

function statusColor(status: string): string {
  switch (status) {
    case "Backlog":
      return "bg-gray-100 border border-gray-200";
    case "Todo":
      return "bg-blue-50 border border-blue-200";
    case "Doing":
      return "bg-yellow-50 border border-yellow-200";
    case "Done":
      return "bg-green-50 border border-green-200";
    default:
      return "bg-gray-50";
  }
}
