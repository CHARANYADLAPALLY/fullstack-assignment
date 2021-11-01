import React, { useState } from "react";
import ReactDOM from "react-dom";

const Display = ({ header, anecdote, index, votes }) => (
  <div>
    <h1>{header}</h1>
    {anecdote[index]}
    <br />
    has {votes[index]} votes
  </div>
);

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const MostVotes = ({ header, votes }) => {
  const maxVotes = Math.max(...votes);
  const index = votes.indexOf(Math.max(...votes));
  const noVotes = (
    <div>
      <h1>{header}</h1>
      <p>nobody voted yet!</p>
    </div>
  );
  const displayVotes = (
    <div>
      <h1>{header}</h1>
      <p>
        {anecdotes[index]}
        <br />
        has {votes[index]} votes
      </p>
    </div>
  );

  return maxVotes > 0 ? displayVotes : noVotes;
};

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(6).fill(0));

  const nextAnecdote = () => {
    const randomAnecdotes = Math.floor(Math.random() * anecdotes.length);
    return setSelected(randomAnecdotes);
  };

  const handleVote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    return setVotes(copy);
  };

  return (
    <div>
      <Display
        header="Anecdote of the day"
        anecdote={props.anecdotes}
        index={selected}
        votes={votes}
      />
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote" />
      <MostVotes header="Anecdote with most votes" votes={votes} />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
