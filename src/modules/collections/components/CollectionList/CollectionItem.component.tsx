import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

import { NoData } from '../../../ui/components/NoData/NoData.component'
import { Collection } from '../../models'

type Props = {
  collection: Collection
}

export const CollectionItem: React.FC<Props> = ({ collection }) => {
  return collection ? (
    <>
      <motion.div className="w-full md:w-6/12 lg:w-4/12 h-full bg-black bg-opacity-50 flex flex-col justify-center px-5">
        <li>
          <article>
            {/* // TODO: update link to collection */}
            <Link
              to={
                '/watch/' +
                collection.videos[0].slug +
                '?c=' +
                collection.slug +
                '&index=0'
              }
              href="e"
              className="grid md:grid-cols-8 xl:grid-cols-9 items-start relative rounded-xl p-3 sm:p-5 xl:p-6 overflow-hidden hover:bg-gray-100 hover:bg-opacity-5"
            >
              <h3 className="font-semibold text-white md:col-start-3 md:col-span-6 xl:col-start-3 xl:col-span-7 mb-1 ml-9 md:ml-0">
                {collection.title}
              </h3>
              <div className="md:col-start-1 md:col-span-2 row-start-1 md:row-end-3 items-center h-full font-medium mb-1 md:mb-0 hidden sm:flex">
                <svg
                  viewBox="0 0 12 12"
                  className="w-3 h-3 mr-6 overflow-visible text-gray-300"
                >
                  <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
                </svg>
              </div>
              <p className="text-white text-opacity-70 md:col-start-3 md:col-span-6 xl:col-span-7 ml-9 md:ml-0">
                {collection.shortDescription}
              </p>
            </Link>
          </article>
        </li>
      </motion.div>
    </>
  ) : (
    <NoData />
  )
}
