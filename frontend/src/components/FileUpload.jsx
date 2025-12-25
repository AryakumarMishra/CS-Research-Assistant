import React, { useState } from 'react';

import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { uploadPdf, analyzeSections } from '../services/api';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFile = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file.');
            return;
        }
        setIsUploading(true);
        try {
            const uploadData = await uploadPdf(file);
            const pdfId = uploadData.pdf_id;
            toast.success('PDF uploaded successfully. Analyzing paper...');

            await analyzeSections(pdfId);
            toast.success('Paper analysis completed!');
            
            onUploadSuccess(pdfId, file.name);

        } catch (error) {
            console.error(error);
            toast.error('Failed to process PDF. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const onInputChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    return (
        <div
            className={`
                w-full max-w-xl mx-auto p-10 rounded-3xl border-2 border-dashed transition-all duration-300
                flex flex-col items-center justify-center text-center cursor-pointer group
                ${isDragging
                    ? 'border-primary bg-primary/10 scale-102 shadow-lg shadow-primary/20'
                    : 'border-slate-700 hover:border-primary/50 hover:bg-slate-800/50'
                }
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="application/pdf"
                onChange={onInputChange}
            />

            <div className="mb-6 p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                {isUploading ? (
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                    <Upload className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                )}
            </div>

            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                {isUploading ? 'Uploading Research Paper...' : 'Upload Research Paper'}
            </h3>

            <p className="text-slate-400 max-w-xs">
                {isUploading
                    ? 'Please wait while we process the document.'
                    : 'Drag & drop a PDF here, or click to browse'}
            </p>
        </div>
    );
};

export default FileUpload;
