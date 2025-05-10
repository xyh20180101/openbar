function getActiveComp() {
    var activeItem = app.project.activeItem
    if (activeItem == undefined || !(activeItem instanceof CompItem))
        return null
    return activeItem
}

export const getAeLanguage = () => {
    return app.isoLanguage
}

export const getAllEffects = () => {
    return app.effects
}

export const getSelectedEffects = () => {
    let comp = getActiveComp()

    if (comp === null)
        return []

    let effects = []
    for (var i = 0; i < comp.selectedProperties.length; i++) {
        var prop = comp.selectedProperties[i]
        if (prop.isEffect) {
            effects.push(prop.matchName)
        }
    }
    return effects
}

export const applyEffects = (matchNames: string[]) => {
    let comp = getActiveComp()

    if (comp === null)
        return

    app.beginUndoGroup(`openbar.applyEffects`)

    for (let i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i]
        if (layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer)
            for (let j = 0; j < matchNames.length; j++)
                layer.Effects.addProperty(matchNames[j])
    }

    app.endUndoGroup()
}

export const applyExpression = (expression: string) => {
    let comp = getActiveComp()

    if (comp === null)
        return

    app.beginUndoGroup("openbar.applyExpression")

    for (var i = 0; i < comp.selectedProperties.length; i++) {
        var prop = comp.selectedProperties[i] as Property;
        if (prop.canSetExpression) {
            prop.expression = expression
        }
    }

    app.endUndoGroup()
}

export const savePreset = () => {
    let comp = getActiveComp()

    if (comp === null || comp.selectedLayers.length === 0)
        return

    if (comp.selectedLayers.length > 1)
        alert('test')

    const commandId = 3075
    app.executeCommand(commandId)
}

export const selectFiles = (): string[] => {
    const files = File.openDialog("Select ffx files", "*.ffx", true)
    const fileNames = []
    for (let i = 0; i < files.length; i++)
        fileNames.push(files[i].fsName)
    return fileNames
}

export const applyPresets = (presets: string[]) => {
    let comp = getActiveComp()

    if (comp === null)
        return

    app.beginUndoGroup(`openbar.applyPresets`)

    const presetFiles = []
    for (let i = 0; i < presets.length; i++)
        presetFiles.push(new File(presets[i]))

    for (let i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i]
        if (layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer)
            for (let j = 0; j < presets.length; j++)
                layer.applyPreset(presetFiles[j])
    }

    app.endUndoGroup()
}

export const executeCommand = (menuCommandId: number) => {
    app.executeCommand(menuCommandId)
}

export const callSystem = (cmd: string) => {
    return system.callSystem(cmd)
}

export const openDirectory = (path: string) => {
    const isWin = $.os.indexOf("Windows") !== -1
    const command = isWin ? `explorer ${path}` : `open ${path}`
    callSystem(command)
}

export const copyFiles = (files: any[]) => {
    const result = []

    for (let i = 0; i < files.length; i++) {
        var sourceFile = new File(files[i].source)
        var targetFile = new File(files[i].target)

        if (!sourceFile.exists) {
            result[i] = { isSuccess: false, message: 'source not exist' }
            return result
        }

        const isSuccess = sourceFile.copy(targetFile.fsName)
        result[i] = { isSuccess: true, message: targetFile.fsName }

        if (!isSuccess)
            return result
    }

    return result
}