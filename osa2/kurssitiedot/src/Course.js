const Course = ({course}) => {
    const Total = ({parts}) => {
      const TotalSum = parts.reduce((sum, part) => sum + part.exercises, 0);
      return (
        <p><b>total of {TotalSum} exercises</b></p>
      )
    }
    const Header = ({name}) => {
      return (
        <>
          <h1>
            {name}
          </h1>
        </>
      )
    }
    const Content = ({parts}) => {
      const Part = ({part}) => {
        return (
          <p>
            {part.name} {part.exercises}
          </p>
        )
      }
      return (
        <>
        {parts.map((part, index) => (
          <Part key={index} part={part} />
        ))}
      </>
      )
    }
    return (
      <>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )
  }

  export default Course