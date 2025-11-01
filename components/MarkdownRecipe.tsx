import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRecipeProps {
  markdown: string;
}

const MarkdownRecipe: React.FC<MarkdownRecipeProps> = ({ markdown }) => {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-gray-800 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 my-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-2 my-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-4" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-gray-800" {...props} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRecipe;


