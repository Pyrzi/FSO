import Person from './Person'

const PersonsFiltered = ({personsFiltered}) => {
    return(
        <>
            {personsFiltered.map(person => 
                <Person key={person.name} name={person.name} number={person.number} />
            )}
        
        </>
    )
}

export default PersonsFiltered