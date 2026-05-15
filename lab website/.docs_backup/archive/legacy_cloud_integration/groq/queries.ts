// GROQ Queries for Global Search Engine 
// This powers the Cmd+K Global Search Modal

// 1. Global Multi-Type Search Query
// Fetches Publications, Projects, and Presentations matching the keyword across multiple fields
export const globalSearchQuery = `
*[_type in ["publication", "project", "presentation"] && (
  title match $keyword + "*" ||
  description match $keyword + "*" ||
  excerpt match $keyword + "*" ||
  presenter match $keyword + "*" 
)] {
  _id,
  _type,
  title,
  
  // Conditionally extract short excerpts based on type
  _type == "publication" => {
    "excerpt": coalesce(excerpt, pt::text(abstract)[0..120] + "..."),
    datePublished
  },
  
  _type == "project" => {
    "excerpt": coalesce(pt::text(description)[0..120] + "..."),
    status,
    progressPercent
  },
  
  _type == "presentation" => {
    presenter,
    "excerpt": time + " - " + date
  }
} | order(_score desc)[0...15] // Limit to 15 best matches
`;

// 2. Archival Routing System Query
// Supports dynamic routing: /archive/[year]/[month]
export const archiveTimeFilterQuery = `
*[_type in ["publication", "project"] && 
  (_type == "publication" && count(datePublished) > 0 && dateTime(datePublished) match $yearMonth + "*") ||
  (_type == "project" && status == "completed" && dateTime(targetDate) match $yearMonth + "*")
] {
  _id,
  _type,
  title,
  "date": coalesce(datePublished, targetDate),
  slug
} | order(date desc)
`;

// 3. RSS Feed Query
// Pulls the latest 20 publications and completed projects for the XML generator
export const rssFeedQuery = `
*[_type in ["publication", "project"] && 
  (_type == "publication" || (_type == "project" && status == "completed"))
] | order(_createdAt desc)[0...20] {
  title,
  "link": "https://herbalomicslab.com/" + _type + "/" + slug.current,
  "description": coalesce(excerpt, pt::text(description)[0..200]),
  "pubDate": _createdAt
}
`;
