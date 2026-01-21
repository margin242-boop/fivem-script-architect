
import React, { useState, useEffect } from 'react';
import { ScriptFile } from '../types';
import { FileCode, Copy, Download, Check, Terminal } from 'lucide-react';

interface ScriptEditorProps {
  files: ScriptFile[];
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col h-full glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
      {/* File Tabs */}
      <div className="flex bg-black/40 border-b border-white/5 overflow-x-auto custom-scrollbar">
        {files.map((file, index) => (
          <button
            key={file.name + index}
            onClick={() => setActiveFileIndex(index)}
            className={`flex items-center gap-3 px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-r border-white/5 ${
              activeFileIndex === index
                ? 'bg-[#020617] text-blue-400 border-b-2 border-b-blue-500'
                : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <FileCode size={14} className={activeFileIndex === index ? 'text-blue-500' : 'text-slate-700'} />
            {file.name}
          </button>
        ))}
      </div>

      {/* Editor Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-slate-600" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Language: <span className="text-blue-400">{activeFile?.language || 'plain text'}</span>
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5 transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 border border-white/5 transition-all"
            title="Download file"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto bg-[#020617] p-8 custom-scrollbar">
        <pre className="font-mono text-sm leading-loose text-slate-400 selection:bg-blue-500/30">
          <code>{activeFile?.content || ''}</code>
        </pre>
      </div>
    </div>
  );
};
