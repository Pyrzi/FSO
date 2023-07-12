import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const mostVoted = votes.indexOf(Math.max(...votes));


  const handleNext = () => {
    const randomNum = Math.floor(Math.random() * 8);
    setSelected(randomNum);
  }

  const handleVoteClick = () => {
    const pointsCopy = [...votes];
    pointsCopy[selected] += 1;
    setVotes(pointsCopy);
  }
  
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br></br>
      has {votes[selected]} votes
      <br></br>
      <Button handleClick={handleVoteClick} text='vote' />
      <Button handleClick={handleNext} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVoted]}
      <br></br>
      has {votes[mostVoted]} votes

    </div>
  )
}

export default App
