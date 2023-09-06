import { useContext } from 'react';
import { DataContext } from './App';
import ListTableDropDown from './ListTableDropDown';

export default function MyList() {
  const data = useContext(DataContext);

  return (
    <>
      {data.lists.length > 0 ? (
        data.lists.map((list) => {
          return (
            <ListTableDropDown
              key={list.listId}
              listName={list.name}
              listId={list.listId}
            />
          );
        })
      ) : (
        <div className="flex justify-center">You have no lists</div>
      )}
    </>
  );
}
