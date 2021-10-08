import { SearchIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { TagSelect } from '../../../tags/components/TagSelect.component'
import { Tag } from '../../../tags/models/tag.model'
import { TagService } from '../../../tags/services/tag.service'
import { WithClassname } from '../../types'

export const TagSearchBar: React.FC<WithClassname> = () => {
  const history = useHistory()

  const [tags, setTags] = useState<Tag[]>([])

  const handleSubmit = async () => {
    if (tags.length !== 0) {
      history.push('/search/' + TagService.TagsToURL(tags))
    }
  }

  return (
    <div className="flex w-full max-w-3xl">
      <TagSelect
        onChange={setTags}
        tags={tags}
        className="w-full rounded"
        isForm={false}
      />
      {tags.length !== 0 && (
        <SearchIcon
          onClick={handleSubmit}
          className="cursor-pointer text-nx-white w-8 mx-2 transition hover:text-nx-gray"
        />
      )}
    </div>
  )
}
