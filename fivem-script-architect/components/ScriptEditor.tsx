
import React, { useState, useEffect } from 'react';
import { ScriptFile } from '../types';
import { FileCode, Copy, Download, Check } from 'lucide-react';

interface ScriptEditorProps {
  files: ScriptFile[];
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reset active file index when the files array changes (e.g., new script generated)
  useEffect(() => {
    setActiveFileIndex(0);
  }, [files]);

  if (!files || files.length === 0) return null;

  const activeFile = files[activeFileIndex] || files[0];

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      {/* Tab bar */}
      <div className="flex bg-[#0f172a] border-b border-slate-700 overflow-x-auto">
        {files.map((file, index) => (
          <button
            key={file.name + index}
            onClick={() => setActiveFileIndex(index)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-r border-slate-700 ${
              activeFileIndex === index
                ? 'bg-[#1e293b] text-blue-400 border-t-2 border-t-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode size={16} />
            {file.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {activeFile?.language || 'plain text'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Download file"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto bg-[#0f172a] p-6">
        <pre className="font-mono text-sm leading-relaxed text-slate-300">
          <code>{activeFile?.content || ''}</code>
        </pre>
      </div>
    </div>
  );
};
