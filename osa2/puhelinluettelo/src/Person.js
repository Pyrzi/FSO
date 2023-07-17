const Person = ({ id, name, number, deleteName }) => {
    return (
      <li>{name} {number} 
      <button onClick={() => deleteName(id,name)}>delete</button></li>
    )
  }

  export default Person