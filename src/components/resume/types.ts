
export interface ResumeDropzoneProps {
  className?: string;
  onFileUploaded?: (file: File) => void;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const allowedFileTypes = [
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
  'text/plain',
  'application/rtf',
  'text/rtf'
];

export const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
