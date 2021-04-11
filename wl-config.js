/*
THIS INCLUDES ALL APP MASKING CONFIGS TO BE USED IN WHITE-LABELING
COPYRIGHTS @ csath

CONFIG OBJECT STRUCTURE
    {
        defaultMasK: STRING, >>>> (one of the mask names from maskList. If specified and no mask argument passed this configs will be picked up for whitelabeling)
        promptDirUnlink: BOOLEAN (default: true), >>>> (prompt for unlink confirmation on any directory list in dirCopy otherthan running mask driCopy destinationDri)
        maskList: ARRAY [
            OBJECT {
                mask: STRING, >>>> (is used as the js file extension; *should be lowercase)
                nativeConfig: OBJECT {
                    skip: BOOLEAN, >>>> (set true to enable run native configuration updates)
                    androidApplicationId: STRING, (android applicationId)
                    iosBundleIdentifier: STRING, (ios bundleIdentifier)
                    displayName: STRING, (application display name)
                },
                dirCopy: ARRAY [
                    {
                        sourceDri: STRING, >>>> (exisitng directory path of the folder or file relative to project root folder)
                        destinationDri: STRING, >>>> (directory path of the folder or file to be copied relative to project root folder)
                        overwrite: BOOLEAN (default: false), >>>> (if you need to remove all existing files in destinationDir)
                    }
                ]
            }
        ]
    }
*/

module.exports = {
    defaultMask: 'sr',
    promptDirUnlink: true,
    maskList: [
        {
            mask: 'sr',
            nativeConfig: {
                skip: false,
                androidApplicationId: 'com.avaapp',
                iosBundleIdentifier: 'com.avaapp',
                displayName: 'AVA',
            },
            dirCopy: [
            ]
        },
    ]
};