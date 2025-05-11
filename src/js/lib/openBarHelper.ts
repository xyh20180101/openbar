import { fs, os } from "./cep/node"
import { csi, evalTS } from "./utils/bolt"
import { CSEvent } from './cep/csinterface'
import menuCommandData from '../lib/menuCommands/data.json'

class OpenBarHelper {

    public aeLanguage = 'zh_CN'

    constructor() {
        evalTS('getAeLanguage').then(result => this.aeLanguage = result)
    }

    public naiveUITheme = {
        common: {
            primaryColor: '#2d8ceb',
            primaryColorHover: '#2d8ceb',
            primaryColorPressed: '#2d8ceb',
            primaryColorSuppl: '#2d8ceb ',

            bodyColor: '#1e1e1e',
            cardColor: '#2c2c2c',
            textColorBase: '#b9b9b9',
            textColor1: '#ffffffde',
            textColor2: '#ffffffa6',
            borderColor: '#3a3a3a'
        }
    }

    isAeRuntime(): boolean {
        return typeof os.homedir === 'function'
    }

    getDataDirectory() {
        return os.homedir() + '\\.openbar'
    }

    getDataPath() {
        return this.getDataDirectory() + '\\data.json'
    }

    getLabel = (showLabelLength: any, label: string) => {
        if (showLabelLength === '1')
            return label.substring(0, 1)
        else if (showLabelLength === '2')
            return label.substring(0, 2)
        else if (showLabelLength === 'all')
            return label
    }

    getData() {
        //从缓存中获取数据
        let cache = null
        if (this.isAeRuntime()) {
            cache = fs.existsSync(this.getDataPath()) ? JSON.parse(fs.readFileSync(this.getDataPath(), null).toString()) : null
        }
        else {
            const lsCache = localStorage.getItem('data')
            cache = lsCache === null ? null : JSON.parse(lsCache)
        }

        if(cache !== null)
            return cache
        
        const data = {
            nodeTree: [
                {
                    key: 'default', label: '默认面板', children: [], type: 'panel', isVisible: true
                }
            ],
            settings: {
                language: 'zh',
                flexDirection: 'row',
                flexGap: 8,
                showIcon: true,
                showLabel: true,
                showLabelLength: 'all',
                buttonStyleType: 'ghost',
                buttonShapeType: '',
                colorful: false,
                color: {
                    main: 'rgba(255, 255, 255, 0.8)',
                    effectButton: 'rgba(102, 204, 255, 1)',
                    presetButton: 'rgba(204, 102, 255, 1)',
                    expressionButton: 'rgba(255, 204, 102, 1)',
                    menuCommandButton: 'rgba(102, 255, 204, 1)',
                    commandButton: 'rgba(204, 204, 204, 1)'
                },
                buttonSize: 3,
                autoName: true
            }
        }

        this.setData(data)
        return data
    }

    setData(data: any) {
        //更新缓存
        if (this.isAeRuntime()) {
            if (!fs.existsSync(this.getDataDirectory()))
                fs.mkdirSync(this.getDataDirectory())

            fs.writeFileSync(this.getDataPath(), JSON.stringify(data))
        } else {
            localStorage.setItem('data', JSON.stringify(data))
        }
    }

    getMenuCommandData() {
        return menuCommandData[this.aeLanguage]
    }

    sendUpdatedEvent(data: any) {
        if (this.isAeRuntime()) {
            const event = new CSEvent('dataUpdated', 'APPLICATION', null, null)
            event.data = data
            csi.dispatchEvent(event)
        }
    }

    registerUpdatedEvent(dataRef: any) {
        if (this.isAeRuntime()) {
            csi.addEventListener('dataUpdated', (event: any) => {
                dataRef.value = event.data
            })
        }
        else {
            window.addEventListener('storage', (event) => {
                if (event.key === 'data' && event.newValue !== null) {
                    dataRef.value = JSON.parse(event.newValue)
                }
            })
        }
    }
}

export const openBarHelper = new OpenBarHelper()