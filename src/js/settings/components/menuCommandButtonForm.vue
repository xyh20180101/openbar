<script setup lang="ts">
import { onBeforeMount, defineProps, ref, h } from 'vue';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NIcon, NTabs, NTabPane, NCascader } from 'naive-ui';
import SvgIcon from '@jamescoyle/vue-icon'
import * as mdi from '@mdi/js'
import { evalTS } from '../../lib/utils/bolt'
import { openBarHelper } from '../../lib/openBarHelper'
import './form.css'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

onBeforeMount(() => {
    loadOptions()
})
const props = defineProps({
    node: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['update:node', 'canceled', 'submitted'])

const data = openBarHelper.getData()
let menuCommandOptions = <any[]>[]
const menuCommandKeyTree = <any[]>[
    {
        key: 'Title/File',
        children: [
            {
                key: 'New_2264',
                children: [
                    { key: 'NewProject_2' },
                    { key: 'NewFolder_2139' },
                    { key: 'AdobePhotoshopFile_3147' },
                    { key: 'Cinema4DFile_4008' }
                ]
            },
            { key: 'OpenProject_3' },
            { key: 'OpenRecentProjects_2284' },
            { key: 'Browse_3689' },
            { key: 'Close_4' },
            { key: 'CloseProject_3154' },
            { key: 'Save_5' },
            {
                key: 'SaveAs_3840',
                children: [
                    { key: 'SaveAs_6' },
                    { key: 'SaveaCopy_2166' },
                    { key: 'SaveAsXML_3785' }
                ]
            },
            { key: 'IncrementandSave_3088' },
            { key: 'Revert_7' },
            {
                key: 'Import_2105',
                children: [
                    { key: 'File_2003' },
                    { key: 'MultipleFiles_2236' },
                    { key: 'ImportCCLibraries_4022' }
                ]
            },
            { key: 'ImportRecentFootage_2283' },
            {
                key: 'Export_2494',
                children: [
                    { key: 'AddToAMERenderQueue_3800' },
                    { key: 'AddtoRenderQueue_2161' }
                ]
            },
            {
                key: 'AdobeDynamicLink_2552',
                children: [
                    { key: 'NewPremiereProSequence_2553' },
                    { key: 'ImportPremiereProSequence_2554' }
                ]
            },
            { key: 'Find_2607' },
            { key: 'AddFootagetoComp_2005' },
            {
                key: 'Title/Dependencies',
                children:
                    [
                        { key: 'CollectFiles_2482' },
                        { key: 'ConsolidateAllFootage_2107' },
                        { key: 'RemoveUnusedFootage_2109' },
                        { key: 'ReduceProject_2735' },
                        { key: 'FindMissingEffects' },
                        { key: 'FindMissingFonts' },
                        { key: 'FindMissingFootage' },
                    ]
            },
            { key: 'WatchFolder_2457' },
            {
                key: 'CreateProxy_2777',
                children:
                    [
                        { key: 'Still_2778' },
                        { key: 'Movie_2779' }
                    ]
            },
            {
                key: 'SetProxy_2106',
                children:
                    [
                        { key: 'File_2104' }
                    ]
            },
            {
                key: 'InterpretFootage_2102',
                children:
                    [
                        { key: 'Main_2077' },
                        { key: 'Proxy_2103' },
                        { key: 'RememberInterpretation_2254' },
                        { key: 'ApplyInterpretation_2255' }
                    ]
            },
            { key: 'ReplaceFootage_2237' },
            { key: 'ReloadFootage_2257' },
            { key: 'LicenseFootage_10420' },
            { key: 'RevealinBridge_3690' },
            { key: 'ProjectSettings_2611' },
            { key: 'Quit_1' }
        ]
    },
    {
        key: 'Title/Edit',
        children: [
            { key: 'Undo_16' },
            { key: 'Redo_2035' },
            { key: 'History_2995' },
            { key: 'Cut_18' },
            { key: 'Copy_19' },
            { key: 'CopyExpressionOnly_53' },
            { key: 'Paste_20' },
            { key: 'PasteReverseKeyframes_54' },
            { key: 'Clear_21' },
            { key: 'Duplicate_2080' },
            { key: 'SplitLayer_2158' },
            { key: 'LiftWorkArea_2613' },
            { key: 'ExtractWorkArea_2614' },
            { key: 'SelectAll_23' },
            { key: 'DeselectAll_2004' },
            { key: 'Label_2358' },
            {
                key: 'KeyframeSelectLabelGroup_4220',
                children: [
                    { key: 'OnSelectedLayers_4221' },
                    { key: 'OnAllLayers_4222' }
                ]
            },
            {
                key: 'Purge_2370',
                children: [
                    { key: 'AllCache_10702' },
                    { key: 'AllMemoryDiskCache_10200' },
                    { key: 'All_2373' },
                    { key: 'AllDiskCache_10700' },
                    { key: 'All3DCache_10701' },
                    { key: 'Undo_2371' },
                    { key: 'ImageCaches_2372' },
                    { key: 'Snapshot_2481' }
                ]
            },
            { key: 'EditOriginal_2142' },
            { key: 'EditinAdobeAudition_3697' },
            {
                key: 'Templates_2265',
                children: [
                    { key: 'RenderSettings_2149' },
                    { key: 'OutputModule_2150' }
                ]
            },
            {
                key: 'Preferences_2079',
                children: [
                    { key: 'General_2359' },
                    { key: 'StartupAndRepair_3134' },
                    { key: 'Previews_2705' },
                    { key: 'Display_2361' },
                    { key: 'Import_2362' },
                    { key: 'Output_2363' },
                    { key: 'GridsGuides_2364' },
                    { key: 'Labels_2365' },
                    { key: 'DiskCaching_2439' },
                    { key: 'VideoPreview_2704' },
                    { key: 'UserInterfaceColors_3071' },
                    { key: 'NewProject_3129' },
                    { key: 'AutoSave_3122' },
                    { key: 'MemoryMultiprocessing_3124' },
                    { key: 'AudioHardware_3125' },
                    { key: 'AudioOutputMapping_3126' },
                    { key: 'Type_3130' },
                    { key: 'ScriptsExpressions_3131' },
                    { key: 'Camera3D_3132' },
                    { key: 'Notifications_3133' },
                ]
            },
            { key: 'KSV_10426' }
        ]
    },
    {
        key: 'Title/Composition',
        children: [
            { key: 'NewComposition_2000' },
            { key: 'CompositionSettings_2007' },
            { key: 'SetPosterTime_2012' },
            { key: 'TrimComptoWorkArea_2360' },
            { key: 'CropComptoRegionofInterest_2997' },
            { key: 'AddToAMERenderQueue_3800' },
            { key: 'AddtoRenderQueue_2161' },
            { key: 'AddOutputModule_2154' },
            {
                key: 'Preview_2131',
                children: [
                    { key: 'PlayPreview_10314' },
                    { key: 'PlayPreview_10550' },
                    { key: 'Audio_2434' }
                ]
            },
            {
                key: 'SaveFrameAs_2233',
                children: [
                    { key: 'File_2118' }
                ]
            },
            { key: 'Prerender_2780' },
            { key: 'SavePreview_2125' },
            {
                key: 'TaffyTimeHeir_4150',
                children: [
                    { key: 'CreateIntro_4151' },
                    { key: 'CreateOutro_4152' },
                    { key: 'CreateProtectedRegion_4153' }
                ]
            },
            { key: 'CompFlowchartView_2258' },
            { key: 'OpenMiniFlowPopup_3792' }
        ]
    },
    {
        key: 'Title/Layer',
        children: [
            {
                key: 'New_2606',
                children: [
                    { key: 'Text_2836' },
                    { key: 'Solid_2038' },
                    { key: 'Light_2563' },
                    { key: 'Camera_2564' },
                    { key: 'NullObject_2767' },
                    { key: 'ShapeLayer_3736' },
                    { key: 'AdjustmentLayer_2279' },
                    { key: 'CAFillLayer_4049' },
                    { key: 'AdobePhotoshopFile_3148' },
                    { key: 'Cinema4DFile_4008' }
                ]
            },
            { key: 'LayerSettings_2021' },
            { key: 'OpenLayer_3784' },
            { key: 'OpenSourceWindow_2523' },
            {
                key: 'Mask_2040',
                children: [
                    { key: 'NewMask_2367' },
                    { key: 'MaskShape_2068' },
                    { key: 'MaskFeather_2069' },
                    { key: 'MaskOpacity_2453' },
                    { key: 'MaskExpansion_2736' },
                    { key: 'ResetMask_2448' },
                    { key: 'RemoveMask_2368' },
                    { key: 'RemoveAllMasks_2369' },
                    {
                        key: 'Mode_2440',
                        children: [
                            { key: 'None_2441' },
                            { key: 'Add_2442' },
                            { key: 'Subtract_2443' },
                            { key: 'Intersect_2444' },
                            { key: 'Lighten_2445' },
                            { key: 'Darken_2446' },
                            { key: 'Difference_2447' }
                        ]
                    },
                    { key: 'Inverted_2052' },
                    { key: 'Locked_2454' },
                    {
                        key: 'MotionBlur_2797',
                        children: [
                            { key: 'SameAsLayer_2798' },
                            { key: 'On_2799' },
                            { key: 'Off_2800' }
                        ]
                    },
                    {
                        key: 'FeatherFalloff_3987',
                        children: [
                            { key: 'Smooth_3988' },
                            { key: 'Linear_3989' }
                        ]
                    },
                    { key: 'UnlockAllMasks_2456' },
                    { key: 'LockOtherMasks_2455' },
                    { key: 'HideLockedMasks_2524' }
                ]
            },
            {
                key: 'MaskandShapePath_3745',
                children: [
                    { key: 'RotoBezier_3053' },
                    { key: 'SetFirstVertex_2768' },
                    { key: 'FreeTransformPoints_2051' }
                ]
            },
            {
                key: 'Quality_2041',
                children: [
                    { key: 'Best_2045' },
                    { key: 'Draft_2044' },
                    { key: 'Wireframe_2042' },
                    { key: 'Bilinear_10207' },
                    { key: 'Bicubic_10208' }
                ]
            },
            {
                key: 'Switches_2053',
                children: [
                    { key: 'HideOtherVideo_2054' },
                    { key: 'ShowAllVideo_2055' },
                    { key: 'UnlockAllLayers_2244' },
                    { key: 'EnableExpressions_10450' },
                    { key: 'DisableExpressions_10451' },
                    { key: 'Shy_2113' },
                    { key: 'Lock_2114' },
                    { key: 'Audio_2056' },
                    { key: 'Video_2059' },
                    { key: 'Solo_2566' },
                    { key: 'Effect_2062' },
                    { key: 'Collapse_2160' },
                    { key: 'MotionBlur_2116' },
                    { key: 'AdjustmentLayer_2263' }
                ]
            },
            {
                key: 'Transform_2020',
                children: [
                    { key: 'Reset_2605' },
                    { key: 'Position_2065' },
                    { key: 'Scale_2066' },
                    { key: 'Orientation_2623' },
                    { key: 'Rotation_2792' },
                    { key: 'Opacity_2070' },
                    { key: 'FlipHorizontal_3766' },
                    { key: 'FlipVertical_3767' },
                    { key: 'CenterInView_3819' },
                    { key: 'CenterAnchor_10312' },
                    { key: 'FittoComp_2156' },
                    { key: 'FittoCompWidth_2732' },
                    { key: 'FittoCompHeight_2733' },
                    { key: 'AutoOrient_2165' }
                ]
            },
            {
                key: 'Time_3155',
                children: [
                    { key: 'EnableTimeRemapping_2153' },
                    { key: 'TimeReverseLayer_2135' },
                    { key: 'TimeStretch_2024' },
                    { key: 'FreezeFrame_3695' },
                    { key: 'FreezeOnLastFrame_4027' },
                    { key: 'AlignVideoToData' }
                ]
            },
            {
                key: 'FrameBlending_2289',
                children: [
                    { key: 'Off_2290' },
                    { key: 'FrameMix_2291' },
                    { key: 'PixelMotion_2292' }
                ]
            },
            { key: '3DLayer_2541' },
            { key: 'GuideLayer_3081' },
            { key: 'EnvironLayer_3972' },
            {
                key: 'LayerMarkers',
                children: [
                    { key: 'AddMarker_2157' },
                    { key: 'UpdateMarkersFromSource_2539' },
                    { key: 'LockMarkers_2565' },
                    { key: 'DeleteAllMarkers_2538' }
                ]
            },
            { key: 'PreserveTransparency_2190' },
            {
                key: 'BlendingMode_2162',
                children: [
                    { key: 'Normal_2167' },
                    { key: 'Dissolve_2168' },
                    { key: 'DancingDissolve_2169' },
                    { key: 'Darken_2178' },
                    { key: 'Multiply_2171' },
                    { key: 'ColorBurn_2201' },
                    { key: 'ClassicColorBurn_2177' },
                    { key: 'LinearBurn_2203' },
                    { key: 'DarkerColor_2209' },
                    { key: 'Add_2170' },
                    { key: 'Lighten_2179' },
                    { key: 'Screen_2172' },
                    { key: 'ColorDodge_2200' },
                    { key: 'ClassicColorDodge_2176' },
                    { key: 'LinearDodge_2202' },
                    { key: 'LighterColor_2208' },
                    { key: 'Overlay_2173' },
                    { key: 'SoftLight_2174' },
                    { key: 'HardLight_2175' },
                    { key: 'LinearLight_2204' },
                    { key: 'VividLight_2205' },
                    { key: 'PinLight_2206' },
                    { key: 'HardMix_2207' },
                    { key: 'Difference_2199' },
                    { key: 'ClassicDifference_2180' },
                    { key: 'Exclusion_2181' },
                    { key: 'Subtract_2210' },
                    { key: 'Divide_2211' },
                    { key: 'Hue_2182' },
                    { key: 'Saturation_2183' },
                    { key: 'Color_2184' },
                    { key: 'Luminosity_2185' },
                    { key: 'StencilAlpha_2186' },
                    { key: 'StencilLuma_2187' },
                    { key: 'SilhouetteAlpha_2188' },
                    { key: 'SilhouetteLuma_2189' },
                    { key: 'AlphaAdd_2198' },
                    { key: 'LuminescentPremul_2197' }
                ]
            },
            { key: 'NextBlendingMode_2781' },
            { key: 'PreviousBlendingMode_2782' },
            {
                key: 'TrackMatte_2269',
                children: [
                    { key: 'NoTrackMatte_2191' },
                    { key: 'SetTypeAlphaMatte_4229' },
                    { key: 'SetTypeAlphaInvertedMatte_4230' },
                    { key: 'SetTypeLumaMatte_4231' },
                    { key: 'SetTypeLumaInvertedMatte_4232' },
                    {
                        key: 'TrackMatteAbove_4233',
                        children: [
                            { key: 'AlphaMatte_2192' },
                            { key: 'AlphaInvertedMatte_2193' },
                            { key: 'LumaMatte_2194' },
                            { key: 'LumaInvertedMatte_2195' }
                        ]
                    },
                    {
                        key: 'TrackMatteBelow_4234',
                        children: [
                            { key: 'AlphaMatteBelow_4235' },
                            { key: 'AlphaInvertedMatteBelow_4236' },
                            { key: 'LumaMatteBelow_4237' },
                            { key: 'LumaInvertedMatteBelow_4238' }
                        ]
                    }
                ]
            },
            {
                key: 'Reveal_4043',
                children: [
                    { key: 'RevealLayerSourceinProject_2517' },
                    { key: 'RevealLayerinProjectFlowchartView_2522' },
                    { key: 'RevealExpressionErrors_2731' }
                ]
            },
            {
                key: 'Create_4044',
                children: [
                    { key: 'ConvertToEditable_3799' },
                    { key: 'CreateOutlineShape_3781' },
                    { key: 'CreateOutlineMasks_2933' },
                    { key: 'CreateFootageOutlines_3973' },
                    { key: 'CreateDataFootageLayerKeyframes_4036' }
                ]
            },
            {
                key: 'Camera_3842',
                children: [
                    { key: 'CreateCameraFrom3DView_2649' },
                    { key: 'CreateStereo3DRig' },
                    { key: 'CreateOrbitNode' },
                    { key: 'CreateCamerasFrom3DModel' },
                    { key: 'LinkFocusDistanceToPointofInterest' },
                    { key: 'LinkFocusDistanceToLayer' },
                    { key: 'SetFocusDistanceToLayer' }
                ]
            },
            { key: 'Autotrace_3044' },
            { key: 'Precompose_2071' }
        ]
    },
    {
        key: 'Title/Effect',
        children: [
            { key: 'EffectControls_2163' },
            { key: 'LastEffect_2452' },
            { key: 'RemoveAll_2072' },
            { key: 'EffectManager_4227' }
        ]
    },
    {
        key: 'Title/Animation',
        children: [
            { key: 'SaveAnimationPreset_3075' },
            { key: 'ApplyAnimationPreset_2450' },
            { key: 'RecentAnimationPresets_2451' },
            { key: 'BrowsePresets_3691' },
            { key: 'SetKeyframe_2701' },
            { key: 'ToggleHoldKeyframe_2226' },
            { key: 'KeyframeInterpolation_2227' },
            { key: 'KeyframeVelocity_2228' },
            { key: 'AddPropToCapsules_4042' },
            {
                key: 'AnimateText_3016',
                children: [
                    { key: 'EnablePercharacter3D_3737' },
                    { key: 'AnchorPoint_3019' },
                    { key: 'Position_3020' },
                    { key: 'Scale_3021' },
                    { key: 'Skew_3022' },
                    { key: 'Rotation_3023' },
                    { key: 'Opacity_3042' },
                    { key: 'AllTransformProperties_3052' },
                    {
                        key: 'FillColor_3039',
                        children: [
                            { key: 'RGB_3029' },
                            { key: 'Hue_3030' },
                            { key: 'Saturation_3031' },
                            { key: 'Brightness_3032' },
                            { key: 'Opacity_3033' }
                        ]
                    },
                    {
                        key: 'StrokeColor_3040',
                        children: [
                            { key: 'RGB_3034' },
                            { key: 'Hue_3035' },
                            { key: 'Saturation_3036' },
                            { key: 'Brightness_3037' },
                            { key: 'Opacity_3038' }
                        ]
                    },
                    { key: 'StrokeWidth_3024' },
                    { key: 'Tracking_3025' },
                    { key: 'LineAnchor_3026' },
                    { key: 'LineSpacing_3043' },
                    { key: 'CharacterOffset_3027' },
                    { key: 'CharacterValue_3028' },
                    { key: 'Blur_3698' }
                ]
            },
            {
                key: 'AddTextSelector_3017',
                children: [
                    { key: 'Range_3018' },
                    { key: 'Wiggly_3041' },
                    { key: 'Expression_3063' }
                ]
            },
            { key: 'RemoveAllTextAnimators_3058' },
            { key: 'AddExpression_2702' },
            { key: 'SeparateDimensions_3764' },
            { key: 'Track3DCameraMotion_3983' },
            { key: 'WarpStabilizer_3986' },
            { key: 'TrackMotion_2568' },
            { key: 'TrackMask_10311' },
            { key: 'TrackthisProperty_2643' },
            { key: 'RevealPropertiesWithKeyframes_2387' },
            { key: 'RevealPropertiesWithAnimation_4011' },
            { key: 'RevealAllModifiedProperties_2771' }
        ]
    },
    {
        key: 'Title/View',
        children: [
            { key: 'NewViewer_3700' },
            { key: 'ZoomIn_2092' },
            { key: 'ZoomOut_2093' },
            {
                key: 'Resolution_2037',
                children: [
                    { key: 'Full_2048' },
                    { key: 'Half_2047' },
                    { key: 'Third_2081' },
                    { key: 'Quarter_2046' },
                    { key: 'Custom_2049' }
                ]
            },
            { key: 'UseDisplayColorManagement_3704' },
            {
                key: 'SimulateOutput_3703',
                children: [
                    { key: 'HDTVRec709_3754' },
                    { key: 'SDTVNTSC_3755' },
                    { key: 'SDTVPAL_3756' },
                    { key: 'MacintoshRGB_3757' },
                    { key: 'WindowsRGB_3758' },
                    { key: 'Kodak5218ICCProfile' },
                    { key: 'UCFtoKodak2383_3814' },
                    { key: 'MyCustomRGB_3759' },
                    { key: 'Custom_3760' }
                ]
            },
            { key: 'ShowRulers_2280' },
            { key: 'ShowGuides_2274' },
            { key: 'SnaptoGuides_2286' },
            { key: 'LockGuides_2275' },
            { key: 'ClearGuides_2276' },
            { key: 'ImportGuides_4158' },
            { key: 'ExportGuides_4159' },
            { key: 'ShowGrid_2277' },
            { key: 'SnaptoGrid_2278' },
            { key: 'ViewOptions_2776' },
            { key: 'ShowLayerControls_2435' },
            { key: 'Reset3DView_2642' },
            { key: 'CreateCameraFrom3DView_2645' },
            {
                key: 'SwitchViewLayout_2650',
                children: [
                    { key: '1Up_2691' },
                    { key: '2Up_2692' },
                    { key: '3Up_2693' },
                    { key: 'ShareViewOptions_2699' }
                ]
            },
            {
                key: 'Switch3DView_2625',
                children: [
                    { key: 'ActiveCamera_2710' },
                    { key: 'Default_10512' },
                    { key: 'Front_2711' },
                    { key: 'Left_2712' },
                    { key: 'Top_2713' },
                    { key: 'Back_2714' },
                    { key: 'Right_2715' },
                    { key: 'Bottom_2716' },
                    { key: 'CustomView1_2717' },
                    { key: 'CustomView2_2718' },
                    { key: 'CustomView3_2719' },
                    { key: 'Reset3DView_2648' }
                ]
            },
            { key: 'SwitchtoLast3DView_2703' },
            { key: 'LookatSelectedLayers_2834' },
            { key: 'LookatAllLayers_2835' },
            { key: 'GotoTime_2076' }
        ]
    },
    {
        key: 'Title/Window',
        children: [
            {
                key: 'Workspace_2738',
                children: [
                    { key: 'ResetWorkspace_3566' },
                    { key: 'SaveWorkspace_2739' },
                    { key: 'NewWorkspace_3565' },
                    { key: 'EditWorkspace_4023' }
                ]
            }
        ]
    },
    {
        key: 'Title/Help',
        children: [
            { key: 'AboutAfterEffects_256' }
        ]
    }
]

const node = ref({ ...props.node })
const mdiIconList: any[] = Object.entries(mdi)
    .filter(([key]) => key.startsWith("mdi"))
    .map(([value, path]) => ({ value, path }))

let menuName = ''

const onCanceled = () => {
    emit('canceled')
}

const onSubmitted = () => {
    if (data.settings.autoName && node.value.label === '' && node.value.menuCommandId)
        node.value.label = menuName
    emit('submitted', node.value)
}

const renderIconSelection = (o: any) => {
    return h('div', { style: 'display:flex;flex-direction:row;align-items:center;line-height:1' }, [
        h(NIcon, { size: 24 }, () => h(SvgIcon, { type: 'mdi', path: o.path }, {})),
        h('span', { style: 'margin-left:8px' }, o.value)
    ])
}

const loadOptions = () => {
    const data = openBarHelper.getMenuCommandData()

    const stack = [...menuCommandKeyTree].reverse()

    //遍历菜单项,补充value和label
    while (stack.length > 0) {
        const node = stack.pop()

        if (!data[node.key])
            console.log(node.key)
        node.value = data[node.key].value
        node.label = data[node.key].label

        if (node.children && node.children.length > 0) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                stack.push(node.children[i])
            }
        }
        else
            node.disabled = !/^\d+$/.test(node.value)
    }

    menuCommandOptions = menuCommandKeyTree
}

const onCascaderValueChange = (value: string, option: any) => {
    menuName = option.label
}
</script>

<template>
    <n-card>
        <n-form ref="formRef" :label-width="80" :model="node" size="small">
            <n-form-item :label="$t('settings.menuCommandButtonForm.name')" path="label">
                <n-input v-model:value="node.label" placeholder="" />
            </n-form-item>
            <n-form-item :label="$t('settings.menuCommandButtonForm.icon')" path="icon">
                <div style="display: flex;width: 100%;align-items: center;">
                    <n-select filterable v-model:value="node.icon" :options="mdiIconList"
                        :render-label="renderIconSelection">
                    </n-select>
                    <n-button round style="margin-left:8px"
                        @click="node.icon = mdiIconList[Math.floor(Math.random() * mdiIconList.length)].value">
                        {{ $t('settings.menuCommandButtonForm.random') }}
                    </n-button>
                </div>
            </n-form-item>
            <n-form-item :label="$t('settings.menuCommandButtonForm.menuCommand')" path="menuCommandId">
                <n-tabs type="segment" animated size="small">
                    <n-tab-pane name="chap1" :tab="$t('settings.menuCommandButtonForm.select')">
                        <n-cascader v-model:value="node.menuCommandId" placeholder="" :options="menuCommandOptions"
                            check-strategy="child" :show-path="false" filterable
                            @update:value="onCascaderValueChange"></n-cascader>
                    </n-tab-pane>
                    <n-tab-pane name="chap2" :tab="$t('settings.menuCommandButtonForm.inputId')">
                        <n-input v-model:value="node.menuCommandId" placeholder=""></n-input>
                    </n-tab-pane>
                </n-tabs>
            </n-form-item>
        </n-form>
        <template #footer>
            <div style="width:100%;display: flex;justify-content: flex-end;">
                <n-button round size="small" @click="onCanceled">
                    {{ $t('settings.menuCommandButtonForm.cancel') }}
                </n-button>
                <n-button style="margin-left: 8px;" type="primary" round size="small" @click="onSubmitted">
                    {{ $t('settings.menuCommandButtonForm.confirm') }}
                </n-button>
            </div>
        </template>
    </n-card>
</template>

<style></style>