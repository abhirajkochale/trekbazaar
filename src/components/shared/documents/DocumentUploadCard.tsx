"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { uploadMedia } from "@/app/actions/upload";
import toast from "react-hot-toast";
import type { PartnerDocument, DocumentType } from "@/lib/types";

interface DocumentUploadCardProps {
  companyId: string;
  documentType: DocumentType;
  title: string;
  description: string;
  existingDocument?: PartnerDocument | null;
  onUploadComplete: (documentType: DocumentType, url: string) => Promise<void>;
  readOnly?: boolean;
}

export function DocumentUploadCard({ 
  companyId, 
  documentType, 
  title, 
  description, 
  existingDocument, 
  onUploadComplete,
  readOnly = false
}: DocumentUploadCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `kyc/${companyId}`);

      const url = await uploadMedia(formData);
      await onUploadComplete(documentType, url);
      toast.success("Document uploaded successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to upload document");
      } else {
        toast.error("Failed to upload document");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = () => {
    if (!existingDocument) return null;
    switch (existingDocument.status) {
      case "APPROVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case "REJECTED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3 h-3" /> Rejected</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending Review</span>;
    }
  };

  const isRejected = existingDocument?.status === "REJECTED";
  const isApproved = existingDocument?.status === "APPROVED";

  return (
    <div className={`bg-white border rounded-2xl p-6 transition-colors ${isRejected ? 'border-red-200 bg-red-50/30' : 'border-zinc-200'}`}>
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        
        {/* Info Area */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold text-zinc-900">{title}</h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-zinc-500 font-medium mb-3">{description}</p>
          
          {isRejected && existingDocument?.review_notes && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 mt-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{existingDocument.review_notes}</div>
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/*,application/pdf"
            className="hidden"
          />

          {!existingDocument ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || readOnly}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          ) : (
            <div className="flex w-full sm:w-auto items-center gap-2">
              <a 
                href={existingDocument.file_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-zinc-700 font-bold px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" /> Preview
              </a>
              
              {!isApproved && !readOnly && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-zinc-100 text-zinc-700 font-bold px-4 py-2.5 rounded-xl border border-transparent hover:bg-zinc-200 transition-colors"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Replace"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {existingDocument && (
        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-400">
          <span>Uploaded on {new Date(existingDocument.uploaded_at).toLocaleDateString()}</span>
          {existingDocument.reviewed_at && <span>Reviewed on {new Date(existingDocument.reviewed_at).toLocaleDateString()}</span>}
        </div>
      )}
    </div>
  );
}
