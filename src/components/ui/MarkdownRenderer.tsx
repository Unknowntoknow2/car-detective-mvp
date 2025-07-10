import React from 'react';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  children, 
  className = "" 
}) => {
  // Simple markdown parser for our specific needs
  const parseMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      // Bullet points
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-4 border-border" />')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br />');
  };

  const processedContent = parseMarkdown(children);
  
  // Wrap in paragraphs and handle list items
  const finalContent = processedContent
    .replace(/(<li.*?<\/li>)/gs, (match) => {
      // If we have list items, wrap them in a ul
      return match.replace(/^<li/gm, '<ul class="list-disc ml-4 mb-3"><li').replace(/<\/li>$/gm, '</li></ul>');
    })
    .replace(/<\/ul><ul class="list-disc ml-4 mb-3">/g, '') // Remove consecutive ul tags
    .replace(/^(.*)$/gm, (match) => {
      // Wrap non-HTML lines in paragraphs
      if (!match.match(/^<(h[1-6]|li|ul|hr)/)) {
        return `<p class="mb-2">${match}</p>`;
      }
      return match;
    });

  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: finalContent }}
    />
  );
};