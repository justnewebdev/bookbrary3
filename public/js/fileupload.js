const rootStyle = window.getComputedStyle(document.documentElement)

if(rootStyle.getPropertyValue('--cover-width-large') != null && rootStyle.getPropertyValue('--cover-width-large') != ''){
  ready()
}else{
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready(){
  const coverWidth = parseFloat(rootStyle.getPropertyValue('--cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyle.getPropertyValue('--cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio

  FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
  )

  FilePond.setOptions({
    stylePanelAspectRatio: coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
    imageResizeMode: 'contain'
  })

  FilePond.parse(document.body)
}
