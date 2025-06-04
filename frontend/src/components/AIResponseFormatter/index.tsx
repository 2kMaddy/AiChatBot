import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import remarkGfm from 'remark-gfm';

interface AiResponseFormatterProps {
  rawResponse: string;
}

const AiResponseFormatter: React.FC<AiResponseFormatterProps> = ({
  rawResponse,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {rawResponse}
    </ReactMarkdown>
  );
};

export default AiResponseFormatter;
