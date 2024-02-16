import React from "react";

export function QuizBowl() {
  return (
    <aside className="sidebar">
      <div className="filter-box">
        <h3 style={{ textAlign: "center" }}>Filter</h3>
        <form>
          <ul>
            <li>
              <label htmlFor="level">Level:</label>
              <select id="level">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </li>
            <li>
              <label htmlFor="difficulty">Difficulty:</label>
              <select id="difficulty">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </li>
            <li>
              <label htmlFor="topic">Topic:</label>
              <input type="text" id="topic" placeholder="Enter topic" />
            </li>
          </ul>
        </form>
      </div>
    </aside>
  );
}
