import React, { useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { MonacoWrapper } from '../../styles';

interface MonacoEditorWrapperProps {
  content: string;
  onCursorPositionChange?: (_line: number, _column: number) => void;
}

export default function MonacoEditorWrapper({
  content,
  onCursorPositionChange,
}: MonacoEditorWrapperProps): React.ReactElement {
  const handleEditorMount: OnMount = useCallback(
    (editor) => {
      // Track cursor position changes
      editor.onDidChangeCursorPosition((e) => {
        if (onCursorPositionChange) {
          onCursorPositionChange(e.position.lineNumber, e.position.column);
        }
      });

      // Focus the editor
      editor.focus();
    },
    [onCursorPositionChange]
  );

  return (
    <MonacoWrapper role="tabpanel" aria-label="Code editor">
      <Editor
        height="100%"
        language="hcl"
        theme="vs-dark"
        value={content}
        options={{
          readOnly: true,
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: 'Menlo-Regular, Monaco, Consolas, monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'off',
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
        }}
        onMount={handleEditorMount}
        beforeMount={(monaco) => {
          // Register HCL language if not already registered
          if (!monaco.languages.getLanguages().some((lang) => lang.id === 'hcl')) {
            monaco.languages.register({ id: 'hcl' });
            monaco.languages.setMonarchTokensProvider('hcl', {
              tokenizer: {
                root: [
                  // Comments
                  [/#.*$/, 'comment'],
                  [/\/\/.*$/, 'comment'],
                  [/\/\*/, 'comment', '@comment'],

                  // Strings
                  [/"([^"\\]|\\.)*$/, 'string.invalid'],
                  [/"/, 'string', '@string'],

                  // Keywords
                  [
                    /\b(resource|data|variable|output|locals|module|provider|terraform|required_providers|required_version|backend|provisioner|connection|lifecycle|for_each|count|depends_on|source|version)\b/,
                    'keyword',
                  ],

                  // Types
                  [
                    /\b(string|number|bool|list|map|set|object|tuple|any)\b/,
                    'type',
                  ],

                  // Booleans
                  [/\b(true|false|null)\b/, 'constant'],

                  // Numbers
                  [/\d+(\.\d+)?/, 'number'],

                  // Identifiers
                  [/[a-zA-Z_][\w-]*/, 'identifier'],

                  // Operators
                  [/[{}()[\]]/, '@brackets'],
                  [/[=!<>]=?/, 'operator'],

                  // Whitespace
                  [/\s+/, 'white'],
                ],
                comment: [
                  [/[^/*]+/, 'comment'],
                  [/\*\//, 'comment', '@pop'],
                  [/[/*]/, 'comment'],
                ],
                string: [
                  [/\$\{/, 'delimiter.bracket', '@interpolation'],
                  [/[^"$\\]+/, 'string'],
                  [/\\./, 'string.escape'],
                  [/"/, 'string', '@pop'],
                ],
                interpolation: [
                  [/\}/, 'delimiter.bracket', '@pop'],
                  [/[^}]+/, 'variable'],
                ],
              },
            });
          }
        }}
      />
    </MonacoWrapper>
  );
}
