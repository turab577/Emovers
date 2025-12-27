import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface QuillInstance {
  root: HTMLElement;
  getSelection: () => { index: number; length: number } | null;
  setSelection: (index: number, length?: number) => void;
  insertText: (index: number, text: string) => void;
  getFormat: (range: { index: number; length: number }) => Record<string, any>;
  format: (name: string, value: any) => void;
  formatLine: (index: number, length: number, name: string, value: any) => void;
  getLength: () => number;
  insertEmbed: (index: number, type: string, value: string) => void;
  getText: () => string;
  focus: () => void;
}

declare global {
  interface Window {
    Quill: {
      new (container: HTMLElement, options: Record<string, unknown>): QuillInstance;
      sources: {
        USER: string;
      };
    };
  }
}

export default function ProfessionalEmailEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillInstance | null>(null);
  const [subject, setSubject] = useState('Your journey with us starts here');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkPanel, setShowLinkPanel] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const fontSizes = [
    { value: 'small', label: 'Small', size: '12px' },
    { value: false, label: 'Normal', size: '14px' },
    { value: 'large', label: 'Large', size: '18px' },
    { value: 'huge', label: 'X-Large', size: '24px' }
  ];

  const emojiButtonRef = useRef<HTMLDivElement>(null);
  const fontSizeDropdownRef = useRef<HTMLDivElement>(null);
  const linkPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const quillCSS = document.createElement('link');
    quillCSS.rel = 'stylesheet';
    quillCSS.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    document.head.appendChild(quillCSS);

    const quillScript = document.createElement('script');
    quillScript.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    quillScript.onload = () => {
      if (editorRef.current && window.Quill && !quillRef.current) {
        quillRef.current = new window.Quill(editorRef.current, {
          theme: 'snow',
          placeholder: 'Start typing your email...',
          modules: {
            toolbar: false
          }
        });

        // Set initial content
        // quillRef.current.root.innerHTML = `
        //   <p>Hi,</p>
        //   <p><br></p>
        //   <p>Welcome, where intelligent automation meets effortless outreach. With our platform, you can easily import your leads, create campaigns using ready-made templates, and let AI craft personalized emails that truly connect with your audience. From scheduling follow-ups to tracking engagement, everything is designed to help you reach your goals faster and more efficiently — so you can focus on building meaningful relationships, not managing manual tasks.</p>
        //   <p><br></p>
        //   <p>Best,</p>
        //   <p><br></p>
        //   <p>The AppointMe Team</p>
        // `;

        const editorContainer = editorRef.current.querySelector('.ql-editor') as HTMLElement;
        if (editorContainer) {
          editorContainer.style.minHeight = '350px';
          editorContainer.style.maxHeight = '350px';
          editorContainer.style.overflowY = 'auto';
          editorContainer.style.fontFamily = 'Arial, sans-serif';
          editorContainer.style.fontSize = '14px';
          editorContainer.style.lineHeight = '1.6';
          editorContainer.style.color = '#374151';
          editorContainer.style.padding = '20px';
        }

        // Handle link clicks
        editorContainer.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'A' && target.getAttribute('href')) {
            e.preventDefault();
            window.open(target.getAttribute('href')!, '_blank');
          }
        });

        // Track selection for link text
        quillRef.current.root.addEventListener('mouseup', () => {
          const range = quillRef.current?.getSelection();
          if (range && range.length > 0) {
            const text = quillRef.current?.getText().substring(range.index, range.index + range.length) || '';
            setSelectedText(text);
          }
        });
      }
    };
    document.body.appendChild(quillScript);

    const handleClickOutside = (event: MouseEvent) => {
      if (emojiButtonRef.current && !emojiButtonRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (fontSizeDropdownRef.current && !fontSizeDropdownRef.current.contains(event.target as Node)) {
        setShowFontSizeDropdown(false);
      }
      if (linkPanelRef.current && !linkPanelRef.current.contains(event.target as Node)) {
        setShowLinkPanel(false);
        setLinkUrl('');
        setLinkText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💡', '📧', '✅', '⭐', '💪', '😎', '🙌', '💯', '🚀'];

  const insertEmoji = (emoji: string) => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection() || { index: quillRef.current.getLength(), length: 0 };
      quillRef.current.insertText(range.index, emoji);
      quillRef.current.setSelection(range.index + emoji.length);
      quillRef.current.focus();
    }
    setShowEmojiPicker(false);
  };

  const handleBold = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        const format = quillRef.current.getFormat(range);
        quillRef.current.format('bold', !format.bold);
      }
      quillRef.current.focus();
    }
  };

  const handleItalic = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        const format = quillRef.current.getFormat(range);
        quillRef.current.format('italic', !format.italic);
      }
      quillRef.current.focus();
    }
  };

  const handleUnderline = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        const format = quillRef.current.getFormat(range);
        quillRef.current.format('underline', !format.underline);
      }
      quillRef.current.focus();
    }
  };

  const handleFontSizeChange = (sizeValue: string | boolean) => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.format('size', sizeValue);
      }
      quillRef.current.focus();
    }
    setShowFontSizeDropdown(false);
  };

  const handleAlignLeft = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.formatLine(range.index, range.length || 1, 'align', false);
      }
      quillRef.current.focus();
    }
  };

  const handleAlignCenter = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.formatLine(range.index, range.length || 1, 'align', 'center');
      }
      quillRef.current.focus();
    }
  };

  const handleBulletList = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range) {
        const format = quillRef.current.getFormat(range);
        quillRef.current.formatLine(range.index, range.length || 1, 'list', format.list === 'bullet' ? false : 'bullet');
      }
      quillRef.current.focus();
    }
  };

  const handleInsertLink = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection();
      if (range && range.length > 0) {
        setLinkText(selectedText);
      }
      setShowLinkPanel(true);
    }
  };

  const insertLink = () => {
    if (quillRef.current && linkUrl.trim()) {
      const range = quillRef.current.getSelection();
      if (range) {
        if (range.length === 0 && linkText.trim()) {
          // Insert new text with link
          quillRef.current.insertText(range.index, linkText);
          quillRef.current.setSelection(range.index, linkText.length);
          quillRef.current.format('link', linkUrl);
        } else if (range.length > 0) {
          // Apply link to selected text
          quillRef.current.format('link', linkUrl);
        }
        // Apply blue color to link
        quillRef.current.format('color', '#2563eb');
      }
      setShowLinkPanel(false);
      setLinkUrl('');
      setLinkText('');
      quillRef.current.focus();
    }
  };

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && quillRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const range = quillRef.current!.getSelection() || { index: quillRef.current!.getLength(), length: 0 };
        quillRef.current!.insertEmbed(range.index, 'image', imageUrl);
        quillRef.current!.setSelection(range.index + 1);
        quillRef.current!.focus();
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto  bg-white min-h-screen">
      <style>{`
        .ql-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .ql-editor {
          color: #374151;
        }
        .ql-editor p {
          margin-bottom: 0;
        }
        .ql-editor ul {
          padding-left: 1.5em;
        }
        .ql-editor li {
          padding-left: 0.5em;
        }
        .ql-toolbar.ql-snow {
          display: none;
        }
        .ql-container.ql-snow {
          border: none;
        }
        .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
        }
        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        .ql-editor::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .ql-editor::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .ql-editor a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 500;
          cursor: pointer;
        }
        .ql-editor a:hover {
          color: #1d4ed8 !important;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
          border-radius: 8px;
        }
        
        /* Quill font size classes */
        .ql-size-small { font-size: 12px !important; }
        .ql-size-large { font-size: 18px !important; }
        .ql-size-huge { font-size: 24px !important; }
      `}</style>

      {/* Header */}
      <div className="flex gap-3 mb-6">
        <div className="p-3 bg-[#ECFDF2] rounded-lg  flex items-center justify-center flex-shrink-0">
          <Image src='/images/template.svg' alt='Template' height={24} width={24} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="heading-4 font-semibold text-[#111827]">Welcome email</p>
          <p className="heading-6 font-regular text-[#70747D]">Make a great first impression with a warm welcome.</p>
        </div>
      </div>

      {/* Editable Subject Line */}
      <div className="mb-6">
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-[#70747D] min-w-[70px] font-medium">Subject:</p>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 bg-transparent heading-6 font-regular focus:outline-none focus:ring-2 focus:ring-[#f87b1b] focus:ring-opacity-50 text-[#111827] px-2 py-1 rounded"
            placeholder="Enter email subject"
          />
        </div>
      </div>

      {/* Editor Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div ref={editorRef} />
        
        {/* Toolbar */}
        <div className="border-t border-gray-200 px-6 py-4 bg-white flex items-center gap-4 flex-wrap">
          {/* Font Size Dropdown - FIXED POSITION */}
          <div className="relative" ref={fontSizeDropdownRef}>
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-300 min-w-[80px] justify-between"
              title="Font Size"
            >
              <span className="flex items-center gap-1">
                <span style={{ fontSize: '16px', fontWeight: '600' }}>A</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>i</span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {showFontSizeDropdown && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[140px]">
                {fontSizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => handleFontSizeChange(size.value)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex justify-between items-center"
                    style={{ fontSize: size.size }}
                  >
                    <span>A</span>
                    <span className="text-gray-500 text-xs">{size.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Formatting Buttons */}
          <button
            onClick={handleBold}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Bold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            </svg>
          </button>

          <button
            onClick={handleItalic}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Italic"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 4h-9M14 20H5M15 4L9 20"/>
            </svg>
          </button>

          <button
            onClick={handleUnderline}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Underline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16"/>
            </svg>
          </button>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Alignment */}
          <button
            onClick={handleAlignLeft}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Align left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="17" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
          </button>

          <button
            onClick={handleAlignCenter}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Align center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="10" x2="6" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="18" y1="18" x2="6" y2="18"/>
            </svg>
          </button>

          <button
            onClick={handleBulletList}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Bullet list"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Insert Options */}
          <button
            onClick={handleInsertLink}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Insert link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>

          <button
            onClick={handleInsertImage}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Insert image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>

          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Emoji Picker - FIXED POSITION */}
          <div className="relative" ref={emojiButtonRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Insert emoji"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>

            {showEmojiPicker && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-8 gap-1 z-50"
                style={{ width: '280px' }}
              >
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => insertEmoji(emoji)}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link Insertion Panel */}
      {showLinkPanel && (
        <div ref={linkPanelRef} className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Insert Hyperlink</h3>
          <div className="space-y-3">
            {selectedText && (
              <div className="text-xs text-gray-600 bg-blue-100 px-3 py-2 rounded">
                Selected text: "<span className="font-medium">{selectedText}</span>"
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Enter link text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') insertLink();
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLinkPanel(false)}
                className="px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="px-3 py-2 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

