import { Disclosure } from '@headlessui/react';
import ListTable from './ListTable';

export default function ListTableDropDown({ listName, listId }) {
  return (
    <div className="px-10 sm:px-20">
      <Disclosure>
        <Disclosure.Button className="py-2 w-full">
          {listName}
        </Disclosure.Button>
        <Disclosure.Panel className="text-gray-500">
          <ListTable listId={listId} />
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
}
