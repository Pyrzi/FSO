import { useState } from 'react'

const StatisticLine = (props) => {
  return(
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>
  )
}

const Statistics = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  const g = props.allClicks.filter((member) => member === 'G').length
  const n = props.allClicks.filter((member) => member === 'N').length
  const b = props.allClicks.filter((member) => member === 'B').length

  return (
    <table>
      <StatisticLine text="good" value ={g} />
      <StatisticLine text="neutral" value ={n} />
      <StatisticLine text="bad" value ={b} />
      <StatisticLine text="all" value ={g+n+b} />
      <StatisticLine text="average" value = {(g*1+b*-1)/(g+n+b)} />
      <StatisticLine text="positive" value = {(g)/(g+n+b)*100 + " %"} />
    </table>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setAll(allClicks.concat('G'))
    //setLeft(left + 1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat('N'))
    //setRight(right + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat('B'))
  }

  return (
    <>
        <h1>give feedback</h1>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
        <h1>
        statistics
        </h1>
        <Statistics allClicks={allClicks} />
    </>
  )
}
export default App
