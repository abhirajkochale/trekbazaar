"use client";

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, XCircle, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { uploadMedia } from '@/app/actions/upload';
import type { PartnerDocument, DocumentType } from '@/lib/types';
import toast from 'react-hot-toast';

interface DocumentUploadCardProps {
  companyId: string;
  documentType: DocumentType;
  title: string;
  description: string;
  existingDocument?: PartnerDocument | null;
  onUploadComplete?: (type: DocumentType, url: string) => Promise<void>;
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
  const [uploadedDocument, setUploadedDocument] = useState<PartnerDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDocument = uploadedDocument || existingDocument;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const folderPath = `documents/${companyId}`;
      formData.append('folder', folderPath);
      
      const url = await uploadMedia(formData);

      if (onUploadComplete) {
        await onUploadComplete(documentType, url);
      }
      
      setUploadedDocument({
        id: 'temp',
        company_id: companyId,
        document_type: documentType,
        file_url: url,
        status: 'PENDING',
        review_notes: null,
        uploaded_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null
      });
      
      toast.success('Document uploaded successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusDisplay = () => {
    if (!activeDocument) return null;

    switch (activeDocument.status) {
      case 'APPROVED':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </div>
        );
      case 'REJECTED':
        return (
          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Action Required
          </div>
        );
      case 'PENDING':
      default:
        return (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> In Review
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${activeDocument?.status === 'REJECTED' ? 'border-red-300 shadow-sm shadow-red-100' : 'border-zinc-200 shadow-sm'}`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">{title}</h3>
              {getStatusDisplay()}
            </div>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xl">{description}</p>
            
            {!activeDocument && !readOnly && (
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> PDF, JPG, PNG</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            )}

            {activeDocument?.status === 'REJECTED' && activeDocument.review_notes && (
              <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-1">Update required</div>
                  {activeDocument.review_notes}
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 md:w-64">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={isUploading || readOnly || activeDocument?.status === 'APPROVED'}
            />
            
            {activeDocument ? (
              <div className="space-y-3">
                <a 
                  href={activeDocument.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center w-full aspect-[4/3] rounded-xl border-2 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all group overflow-hidden relative"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <FileText className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 transition-colors mb-2" />
                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-700 text-center break-all">
                      View Uploaded Document
                    </span>
                  </div>
                </a>
                
                {!readOnly && activeDocument.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Replace Document'}
                  </button>
                )}
              </div>
            ) : (
              !readOnly && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50 hover:bg-zinc-100 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-500">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-zinc-900 block">Click to upload</span>
                        <span className="text-xs font-medium text-zinc-500">or drag and drop</span>
                      </div>
                    </>
                  )}
                </button>
              )
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
