import { useEffect, useState } from 'react';

const useFetchContents = ({ listId }) => {
  const [listContents, setListContents] = useState([]);

  useEffect(() => {
    async function fetchListContent() {
      try {
        const req = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        };

        const response = await fetch(`/api/listContent/${listId}`, req);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const contents = await response.json();
        setListContents(contents);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListContent();
  }, [listContents, listId]);

  const handleDeleteClick = async (selectedContent, setSelectedContent) => {
    try {
      const req = {
        listContentId: selectedContent,
        listId,
      };
      const response = await fetch('/api/listContent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete list content: ${response.status}`);
      }

      const deletedMed = await response.json();
      const newList = listContents.filter(
        (content) => content.listContentId !== deletedMed.listContentId
      );
      setListContents(newList);
      setSelectedContent(null);
    } catch (error) {
      console.log(error);
    }
  };

  return { listContents, setListContents, handleDeleteClick };
};

export default useFetchContents;
