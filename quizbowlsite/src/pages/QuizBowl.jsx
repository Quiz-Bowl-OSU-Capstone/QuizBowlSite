// import React, { useState, useEffect } from "react";

// export function QuizBowl() {
//   const [filters, setFilters] = useState({
//     species: [],
//     resource: [],
//     level: [],
//     topic: [],
//   });

//   useEffect(() => {
//     async function fetchFilters() {
//       try {
//         const response = await fetch(
//           "https://qzblapi.azurewebsites.net/api/SearchFilters"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch filters");
//         }
//         const data = await response.json();

//         const speciesOptions = data.Species.filter(Boolean);
//         const resourceOptions = data.Resource.filter(Boolean);
//         const levelOptions = data.Level.filter(Boolean);
//         const topicOptions = data.Topic.filter(Boolean);

//         setFilters({
//           species: speciesOptions,
//           resource: resourceOptions,
//           level: levelOptions,
//           topic: topicOptions,
//         });
//       } catch (error) {
//         console.error("Error fetching filters:", error);
//       }
//     }

//     fetchFilters();
//   }, []);

//   return (
//     <aside className="sidebar">
//       <div className="filter-box">
//         <h3 style={{ textAlign: "center" }}>Filter</h3>
//         <form>
//           <ul>
//             <li>
//               <label htmlFor="level">Level:</label>
//               <select id="level">
//                 {filters.level.map((level, index) => (
//                   <option key={index} value={level}>
//                     {level}
//                   </option>
//                 ))}
//               </select>
//             </li>
//             <li>
//               <label htmlFor="species">Species:</label>
//               <select id="species">
//                 {filters.species.map((species, index) => (
//                   <option key={index} value={species}>
//                     {species}
//                   </option>
//                 ))}
//               </select>
//             </li>
//             <li>
//               <label htmlFor="resource">Resource:</label>
//               <select id="resource">
//                 {filters.resource.map((resource, index) => (
//                   <option key={index} value={resource}>
//                     {resource}
//                   </option>
//                 ))}
//               </select>
//             </li>
//             <li>
//               <label htmlFor="topic">Topic:</label>
//               <select id="topic">
//                 {filters.topic.map((topic, index) => (
//                   <option key={index} value={topic}>
//                     {topic}
//                   </option>
//                 ))}
//               </select>
//             </li>
//           </ul>
//         </form>
//       </div>
//     </aside>
//   );
// }

import React, { useState, useEffect } from "react";

export function QuizBowl() {
  const [randomQuestions, setRandomQuestions] = useState([]);

  useEffect(() => {
    async function fetchRandomQuestions() {
      try {
        const response = await fetch(
          "https://qzblapi.azurewebsites.net/api/PickRandomQuestions?uid=1"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch random questions");
        }
        const data = await response.json();
        console.log("Random Questions:", data.questions);
        if (Array.isArray(data.questions)) {
          setRandomQuestions(data.questions);
        } else {
          console.error("Fetched data is not an array:", data.questions);
        }
      } catch (error) {
        console.error("Error fetching random questions:", error);
      }
    }

    fetchRandomQuestions();
  }, []);

  return (
    <div>
      <h2>Random Questions</h2>
      <ul>
        {randomQuestions.map((question, index) => (
          <li key={index}>
            <strong>Question:</strong> {question.Question}
            <br />
            <strong>Answer:</strong> {question.Answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
