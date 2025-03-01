
import React from 'react';
import ResumeDropzone from '@/components/ResumeDropzone';

const Index = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Removed "Resume Upload" header text */}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-upload-blue-light text-sm font-medium text-blue-600 rounded-full">
              Prointerview
            </span>
            {/* Removed "Upload Your Resume" and description text */}
          </div>
          
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-upload-blue rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-upload-blue/40 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Prepare Your Resume</h3>
              <p className="text-sm text-gray-600">Ensure your resume is up-to-date and saved in one of our accepted formats.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-upload-blue/40 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Upload Below</h3>
              <p className="text-sm text-gray-600">Drag and drop your file in the designated area or click to browse your files.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-upload-blue/40 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Submit & Wait</h3>
              <p className="text-sm text-gray-600">After uploading, our system will process your resume for your application.</p>
            </div>
          </div>
        </div>
        
        {/* Upload area at the bottom */}
        <div className="w-full mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <ResumeDropzone />
          
          <p className="text-center text-xs text-gray-500 mt-4">
            By uploading your resume, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Resume Upload Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
