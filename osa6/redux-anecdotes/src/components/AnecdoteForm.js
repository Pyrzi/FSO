import { useDispatch } from 'react-redux'
import { new_anecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {

const dispatch = useDispatch()

const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.new_anecdote.value
    event.target.new_anecdote.value = ''
    dispatch(new_anecdote(content))
  }

return (
    <>
    <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input 
          name="new_anecdote"/>
        </div>
        <button type="submit">create</button>
      </form>
    </>
)
}

export default AnecdoteForm