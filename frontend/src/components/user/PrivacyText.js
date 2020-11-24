import React from 'react'
import { useSelector } from 'react-redux'
import FormattedText from '../case/components/FormattedText'

const PrivacyText = () => {
    const library = useSelector(state => state.language)?.library?.frontend.user
    return (
        <div>
            <FormattedText value={library.privacy} />
        </div>
    )
}

export default PrivacyText