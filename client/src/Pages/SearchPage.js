import Searchable from '../Searchable';

export default function SearchPage() {
  return (
    <div className="app flex-column w-full justify-center items-center">
      <div className="flex justify-center w-full">
        <div className="basis-1/3 flex-column justify-center items-center">
          <Searchable />
        </div>
      </div>
    </div>
  );
}
