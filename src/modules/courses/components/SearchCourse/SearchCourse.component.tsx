import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInjection } from '@polyflix/di';
import { CollectionList } from '../CollectionList/CollectionList.component';
import { WithClassname, WithMotion } from '../../../common';
import { Collection } from '../../../collections/models/collections.model';
import { CollectionService } from '../../../collections/services/collection.service';

type Props = WithClassname &
  WithMotion & {
    addCollection: (collection: Collection) => void
    placeholder: string
  }

export const SearchCourse: React.FC<Props> = ({
  addCollection,
  placeholder,
  ...rest
}) => {
  const collectionService = useInjection<CollectionService>(CollectionService);

  const [input, setInput] = useState<string>('');
  const [collectionList, setCollectionList] = useState<Collection[]>([]);

  const onClickCollection = (collection: Collection) => {
    addCollection(collection);
    setInput('');
    setCollectionList([]);
  };

  const search = async (title: string) => {
    const paginatedCollections = await collectionService.getCollections({
      title,
      exact: false,
    });
    setInput(title);
    setCollectionList(paginatedCollections.items);
  };

  return (
    <motion.div
      {...rest}
      className="flex flex-col divide-y-2 divide-gray-300 dark:bg-nx-white rounded-md overflow-hidden col-span-2 px-2"
    >
      <input
        type="text"
        className="dark:bg-nx-white focus:outline-none py-3 px-3 font-display"
        value={input}
        onChange={(e) => search(e.target.value)}
        placeholder={placeholder}
      />
      {input && collectionList.length !== 0 ? (
        <CollectionList
          onClickCollection={onClickCollection}
          collectionList={collectionList}
          className="col-span-2"
        />
      ) : null}
    </motion.div>
  );
};
