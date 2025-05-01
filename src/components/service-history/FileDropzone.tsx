
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X } from 'lucide-react';

interface FileDropzoneProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export function FileDropzone({ files, onFileChange, onRemoveFile }: FileDropzoneProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="file-upload">Upload Receipt/Documentation</Label>
        
        <div className="border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-50 transition-colors">
          <Input
            id="file-upload"
            type="file"
            onChange={onFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to select file or drag and drop</span>
            <span className="text-xs text-gray-400">PDF, JPG or PNG (max 5MB)</span>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <File size={16} className="text-blue-500" />
                <span className="text-sm flex-1 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
                <button 
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
