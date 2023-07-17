import Person from './Person'

const PersonsFiltered = ({personsFiltered, deleteName}) => {
    return(
        <>
            {personsFiltered.map(person => 
                <Person key={person.id} id={person.id} name={person.name} number={person.number} deleteName={deleteName} />
            )}
        
        </>
    )
}

export default PersonsFiltered