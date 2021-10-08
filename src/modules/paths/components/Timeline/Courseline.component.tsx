import { motion } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

import { NoData } from '../../../ui/components/NoData/NoData.component'
import { OrderedCourse } from '../../models'

type Props = {
  course: OrderedCourse
  position: string
}

export const Courseline: React.FC<Props> = ({ course, position }) => {
  return course ? (
    <>
      <motion.div className="w-full lg:w-4/12 h-full bg-black bg-opacity-50 flex flex-col justify-left px-5">
        <li>
          <article>
            <Link
              to={'/courses/' + course.course.slug}
              href="e"
              className="grid md:grid-cols-8 xl:grid-cols-9 items-start relative rounded-xl p-3 sm:p-5 xl:p-6 overflow-hidden hover:bg-gray-100 hover:bg-opacity-5"
            >
              <h3 className="font-semibold text-white md:col-start-3 row-start-1 col-start-2 md:col-span-6 xl:col-start-3 xl:col-span-7 mb-1 ml-9 md:ml-0">
                {course.course.title}
              </h3>
              <div className="md:col-start-1 md:col-span-2 row-start-1 md:row-end-3 flex items-center font-medium mb-1 md:mb-0">
                <svg
                  viewBox="0 0 12 12"
                  className="w-3 h-3 mr-6 overflow-visible text-gray-300"
                >
                  <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
                  {position !== 'first' && position !== 'single' ? (
                    <path
                      d="M 6 -6 V -30"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="text-gray-200"
                    ></path>
                  ) : null}
                  {position !== 'last' && position !== 'single' ? (
                    <path
                      d="M 6 18 V 500"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="text-gray-200"
                    ></path>
                  ) : null}
                </svg>
                <span className="hidden md:flex">🔥</span>
              </div>
              <p className="md:col-start-3 md:col-span-6 xl:col-span-7 ml-9 md:ml-0 row-start-2 col-start-2 text-left text-white text-opacity-90">
                {course.course.shortDescription}
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
