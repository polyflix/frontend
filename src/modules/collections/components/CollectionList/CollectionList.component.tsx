import { motion } from 'framer-motion';
import React from 'react';
import { NoData } from '../../../ui/components/NoData/NoData.component';
import { Collection } from '../../models';
import { CollectionItem } from './CollectionItem.component';

type Props = {
  collections: Collection[]
}

export const CollectionList: React.FC<Props> = ({ collections }) => (collections ? (
  <>
    <motion.div className="w-full h-full bg-black bg-opacity-50 flex flex-col justify-center px-5">
      <ul className="rounded-3xl bg-black bg-opacity-50 p-2 sm:p-5 xl:p-6">
        {collections.map((collection) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
          />
        ))}
      </ul>
    </motion.div>
  </>
) : (
  <NoData />
));
