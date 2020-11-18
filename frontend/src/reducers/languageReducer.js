import languageService from '../services/language'
import { setNotification } from '../reducers/notificationReducer'

const reducer = (state = null, action) => {
    switch (action.type) {
    case 'GET_LANGUAGE': {
        return action.data
    }
    default: return state
    }
}

export const getLanguage = () => {
    return async dispatch => {
        const langText = window.localStorage.getItem('language')
        if (langText) {
            const language = JSON.parse(langText)
            dispatch({
                type: 'GET_LANGUAGE',
                data: language
            })
        } else {
            let validation = await languageService.getValidation()
            let library = await languageService.getLibrary()
            if (validation.error || library.error) {
                dispatch(setNotification({ message: 'Tapahtui virhe kirjastoja hakiessa. Päivitä sivu.', success: false, show: true }))
            } else {
                const language = { validation, library }
                window.localStorage.setItem('language', JSON.stringify(language))
                dispatch({
                    type: 'GET_LANGUAGE',
                    data: language
                })
            }
        }
    }
}

export default reducer