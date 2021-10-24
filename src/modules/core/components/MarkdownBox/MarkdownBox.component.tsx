import { Link, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'

type MarkdownBoxProps = {
  body: string
}

export const MarkdownBox = ({ body }: MarkdownBoxProps) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <Typography variant="h4">{children}</Typography>,
        h2: ({ children }) => <Typography variant="h4">{children}</Typography>,
        h3: ({ children }) => <Typography variant="h5">{children}</Typography>,
        h4: ({ children }) => <Typography variant="h5">{children}</Typography>,
        h5: ({ children }) => <Typography variant="h6">{children}</Typography>,
        h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
        a: ({ children }) => <Link>{children}</Link>,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside" {...props}>
            {}
          </ul>
        ),
        pre: ({ node, ...props }) => (
          <pre className="rounded-lg bg-gray-100 bg-opacity-5 p-4" {...props}>
            {}
          </pre>
        ),
      }}
      className=" py-4 md:pr-1 text-opacity-90 text-white"
    >
      {body}
    </ReactMarkdown>
  )
}
