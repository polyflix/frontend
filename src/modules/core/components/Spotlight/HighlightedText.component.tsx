type HighlightedTextProps = {
  text: string
  search: string
}

/**
 * Returns an highlighted text, depending on the search param
 */
export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  search,
}: HighlightedTextProps) => {
  const parts = text.split(new RegExp(`(${search})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <span key={i} style={{ background: 'red', color: 'white' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  )
}
