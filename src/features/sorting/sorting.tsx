import { useDispatch } from 'react-redux'
import './sorting.css'
import { type AppDispatch } from '../../store/store'
import { sort } from '../productList';
import { useState } from 'react';

const sortingOptions = [
    { text: 'Sort in ascending order', value: 'ASCENDING', selected: true },
    { text: 'Sort in descending order', value: 'DESCENDING', selected: false },
]

function Sort() {
    const dispatch = useDispatch<AppDispatch>();
    const [options, setOptions] = useState(sortingOptions);

    const handleSortUpdate = (index: string) => {
        const updateOptions = options.map((option, i) => ({
            ...option,
            selected: +index === i
        }))
        setOptions(updateOptions)
        dispatch(sort(sortingOptions[+index].value))
    }

    return (
        <select onChange={(ev) => handleSortUpdate(ev.target.value)}>
            {
                sortingOptions.map((option, i) => {
                    const { text } = option
                    return <option value={i} key={i}>{text}</option>
                })
            }

        </select>
    )
}
export default Sort