import { openBarHelper } from '../js/lib/openBarHelper'
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'
const i18n = createI18n({
    legacy: false,
    locale: openBarHelper.getData().settings.language,
    messages: {
        en,
        zh
    }
})

const languageOptions = [
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' }
]

export { i18n, languageOptions }