import { useContext, useState } from 'react';
import Plant from '../components/Plant';
import Search from '../components/Search';
import { SearchContext } from '../SearchContext';
import { SpeciesContext } from '../SpeciesContext';
import Caret from '../icons/Caret.jsx'

function AllPlants() {
  const {
    biSearch,
    comSearch,
    handleBiNameSearchState,
    handleComNameSearchState,
  } = useContext(SearchContext);

  const { allPlants } = useContext(SpeciesContext);
  const [sort, setSort] = useState({keyToSort: "binomial_name", direction: "asc"})
  const [type, setType] = useState('');
  
  let filteredPlants = getSortedArray(allPlants.filter(
    (plant) =>
      (biSearch === '' || plant.binomial_name.toLowerCase().includes(biSearch.toLowerCase())) &&
      (comSearch === '' || plant.common_name.toLowerCase().includes(comSearch.toLowerCase())) &&
      (type === '' || plant.species_type.toLowerCase() === type.toLowerCase())
  ));

  let plantComps = filteredPlants.map((plant) => <Plant plant={plant} key={plant.id} />);

  const headers = [
    {
      id: 1,
      KEY: "binomial_name",
      LABEL: "Binomial Name"
    },
    {
      id: 2,
      KEY: "common_name",
      LABEL: "Common Name"
    },
    {
      id: 3,
      KEY: "species_type",
      LABEL: "Type"
    },
    {
      id: 4,
      KEY: "height",
      LABEL: "Max Height (ft)"
    },
    {
      id: 5,
      KEY: "moisture",
      LABEL: "Moisture"
    },
    {
      id: 6,
      KEY: "light",
      LABEL: "Light"
    }
  ]

  function changeType(e) {
    setType(e.target.value);
  }

  const types = ["Tree", "Shrub", "Grass", "Herb"]
  
  function handleHeaderClick(header) {
    setSort({
      keyToSort: header.KEY,
      direction:
        header.KEY === sort.keyToSort ? sort.direction === 'asc' ? 'desc' : 'asc' : 'desc'
    })
  }

  function getSortedArray(arrayToSort) {
    if (sort.direction === 'asc') {
      return arrayToSort.sort((a, b) => a[sort.keyToSort].localeCompare(b[sort.keyToSort], undefined, { sensitivity: 'base' }));
    }
    return arrayToSort.sort((a, b) => b[sort.keyToSort].localeCompare(a[sort.keyToSort], undefined, { sensitivity: 'base' }));
  }

  return (
    <div className="table-container">
      <div className="filters-container">
        <Search
          handleBiNameSearchState={handleBiNameSearchState}
          handleComNameSearchState={handleComNameSearchState}
          biSearch={biSearch}
          comSearch={comSearch}
        />
        <div className="select-container">
          <select onChange={changeType} value={type}>
            <option value="">All Types</option>
            {types.map((type, index) => {
              return <option key={index} value={type}>{type}</option>
            })}
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
           {headers.map((header, index) => (
            <th key={index} onClick={() => handleHeaderClick(header)}>
              <div className="header-container">
                <span>{header.LABEL}</span>
                  {header.KEY === sort.keyToSort && (
                    <Caret direction={sort.keyToSort === header.KEY ? sort.direction : 'asc'}
                    />
                  )}
              </div>
            </th>
           ))}
          </tr>
        </thead>
        <tbody>{plantComps}</tbody>
      </table>
    </div>
  );
}

export default AllPlants;
