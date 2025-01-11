import React from "react"

interface TextWithLinksProps {
  text: string
}

const TextWithLinks: React.FC<TextWithLinksProps> = ({ text }) => {
  // Regular expression to detect [vanity text](url) pattern
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g

  // Split the text into parts using the regex
  const parts = text.split(linkRegex)

  return (
    <>
      {parts.map((part, index) => {
        if (index % 3 === 1) {
          // This part is the vanity text
          const url = parts[index + 1] // The corresponding URL is the next part
          return (
            <a
              key={`link-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {part}
            </a>
          )
        }

        if (index % 3 === 2) {
          // Skip rendering the raw URL part
          return null
        }

        // Render plain text
        return <span key={`text-${index}`}>{part}</span>
      })}
    </>
  )
}

export default TextWithLinks
