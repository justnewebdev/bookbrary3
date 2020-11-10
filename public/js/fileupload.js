FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
)

FilePond.setOptions({
  stylePanelAspectRatio: 150/100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
  imageResizeMode: 'contain'
})

FilePond.parse(document.body)
