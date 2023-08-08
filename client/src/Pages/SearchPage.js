import Searchable from '../Searchable';

export default function SearchPage({ handleClick }) {
  return (
    <div className="app flex-column w-full justify-center items-center">
      <div className="flex justify-center w-full">
        <div className="w-2/3 sm:w-1/3 flex-column justify-center items-center">
          <Searchable />
        </div>
      </div>
    </div>
  );
}
