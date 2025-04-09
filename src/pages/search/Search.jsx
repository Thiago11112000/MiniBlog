import React from 'react'
import { useQuery } from '../../hooks/useQuery';
//hooks 
import {useFechDocuments} from '../../hooks/useFetchDocuments';
const Search = () => {
    const query = useQuery();
    const search = query.get("q");
  return (
    <div>
        <h2> Search</h2>
        <p>{search}</p>
    </div>
  )
}

export default Search