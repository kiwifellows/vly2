import { FormattedMessage } from 'react-intl'
import React from 'react'

const orgHistoryTitle = (
  <FormattedMessage
    id='orgTabs.history.title'
    defaultMessage='Previous opportunities'
    description='Title to display on the organisation history panel'
  />
)

const orgHistoryNotFound = (
  <FormattedMessage
    id='orgTabs.history.notfound'
    defaultMessage='This organisation does not have any archived opportunities.'
    description='Message to display when an organisation does not have any archived opportunities'
  />
)

export {
  orgHistoryTitle,
  orgHistoryNotFound
}
